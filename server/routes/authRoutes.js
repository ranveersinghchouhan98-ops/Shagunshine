const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new customer account
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const userId = 'usr_' + uuidv4().substring(0, 8);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=8B1E3B,C5A049&textColor=ffffff`;

    db.prepare(`
      INSERT INTO users (id, name, email, password, phone, role, avatar)
      VALUES (?, ?, ?, ?, ?, 'customer', ?)
    `).run(userId, name.trim(), email.trim().toLowerCase(), hashedPassword, phone || null, defaultAvatar);

    const token = jwt.sign({ id: userId, email: email.trim().toLowerCase(), role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });

    const user = db.prepare('SELECT id, name, email, phone, role, avatar, created_at FROM users WHERE id = ?').get(userId);

    res.status(201).json({
      success: true,
      message: 'Welcome to Shagun Shine Cosmetics! Account created successfully.',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// @route   POST /api/auth/login
// @desc    Login for customer or admin
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    if (user.is_blocked) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact customer support.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userSafe } = user;

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: userSafe
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile & addresses & wishlist
router.get('/me', verifyToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, phone, role, avatar, created_at FROM users WHERE id = ?').get(req.user.id);
    const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC').all(req.user.id);
    const wishlistItems = db.prepare(`
      SELECT p.* FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
    `).all(req.user.id);

    // Parse product JSON fields
    const parsedWishlist = wishlistItems.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      benefits: JSON.parse(p.benefits || '[]'),
      shades: JSON.parse(p.shades || '[]')
    }));

    res.json({
      success: true,
      user,
      addresses,
      wishlist: parsedWishlist
    });
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user profile.' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update current user profile
router.put('/profile', verifyToken, (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    db.prepare(`
      UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), avatar = COALESCE(?, avatar), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, phone, avatar, req.user.id);

    const user = db.prepare('SELECT id, name, email, phone, role, avatar FROM users WHERE id = ?').get(req.user.id);
    res.json({ success: true, message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change password
router.put('/change-password', verifyToken, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password.' });
    }

    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hashedNew = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hashedNew, req.user.id);

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error updating password.' });
  }
});

// @route   POST /api/auth/addresses
// @desc    Add a new address
router.post('/addresses', verifyToken, (req, res) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      return res.status(400).json({ success: false, message: 'Please complete all required address fields.' });
    }

    const addrId = 'addr_' + uuidv4().substring(0, 8);

    if (isDefault) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(req.user.id);
    }

    db.prepare(`
      INSERT INTO addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(addrId, req.user.id, fullName, phone, addressLine1, addressLine2 || '', city, state, postalCode, country || 'India', isDefault ? 1 : 0);

    const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC').all(req.user.id);
    res.status(201).json({ success: true, message: 'Address saved successfully.', addresses });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, message: 'Server error saving address.' });
  }
});

// @route   DELETE /api/auth/addresses/:id
// @desc    Delete an address
router.delete('/addresses/:id', verifyToken, (req, res) => {
  try {
    db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC').all(req.user.id);
    res.json({ success: true, message: 'Address removed.', addresses });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting address.' });
  }
});

// @route   POST /api/auth/wishlist/toggle
// @desc    Toggle product in customer wishlist
router.post('/wishlist/toggle', verifyToken, (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const existing = db.prepare('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?').get(req.user.id, productId);
    let inWishlist = false;

    if (existing) {
      db.prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?').run(req.user.id, productId);
      inWishlist = false;
    } else {
      db.prepare('INSERT INTO wishlists (id, user_id, product_id) VALUES (?, ?, ?)').run(uuidv4(), req.user.id, productId);
      inWishlist = true;
    }

    const wishlistItems = db.prepare(`
      SELECT p.* FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
    `).all(req.user.id);

    const parsedWishlist = wishlistItems.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      benefits: JSON.parse(p.benefits || '[]'),
      shades: JSON.parse(p.shades || '[]')
    }));

    res.json({
      success: true,
      inWishlist,
      message: inWishlist ? 'Added to Wishlist' : 'Removed from Wishlist',
      wishlist: parsedWishlist
    });
  } catch (error) {
    console.error('Wishlist toggle error:', error);
    res.status(500).json({ success: false, message: 'Server error updating wishlist.' });
  }
});

module.exports = router;
