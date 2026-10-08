const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');
const sanitizeHtml = require('sanitize-html');

// @route   POST /api/auth/register
// @desc    Register a new customer account
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const cleanName = sanitizeHtml(name, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanEmail = sanitizeHtml(email, { allowedTags: [], allowedAttributes: {} }).trim().toLowerCase();
    const cleanPhone = phone ? sanitizeHtml(phone, { allowedTags: [], allowedAttributes: {} }).trim() : null;

    if (!cleanName || !cleanEmail) {
      return res.status(400).json({ success: false, message: 'Please provide a valid name and email address.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(cleanEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const userId = 'usr_' + uuidv4().substring(0, 8);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=8B1E3B,C5A049&textColor=ffffff`;

    db.prepare(`
      INSERT INTO users (id, name, email, password, phone, role, avatar)
      VALUES (?, ?, ?, ?, ?, 'customer', ?)
    `).run(userId, cleanName, cleanEmail, hashedPassword, cleanPhone, defaultAvatar);

    const token = jwt.sign({ id: userId, email: cleanEmail, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });

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

    const trimmedIdentifier = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(trimmedIdentifier);

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
    const cleanName = name ? sanitizeHtml(name, { allowedTags: [], allowedAttributes: {} }).trim() : null;
    const cleanPhone = phone ? sanitizeHtml(phone, { allowedTags: [], allowedAttributes: {} }).trim() : null;
    let cleanAvatar = null;
    if (avatar && typeof avatar === 'string') {
      const trimmed = avatar.trim();
      if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('/uploads/')) {
        cleanAvatar = trimmed;
      }
    }

    db.prepare(`
      UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), avatar = COALESCE(?, avatar), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(cleanName, cleanPhone, cleanAvatar, req.user.id);

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

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
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

    const cleanFullName = sanitizeHtml(fullName, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanPhone = sanitizeHtml(phone, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanAddr1 = sanitizeHtml(addressLine1, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanAddr2 = addressLine2 ? sanitizeHtml(addressLine2, { allowedTags: [], allowedAttributes: {} }).trim() : '';
    const cleanCity = sanitizeHtml(city, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanState = sanitizeHtml(state, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanPincode = sanitizeHtml(postalCode, { allowedTags: [], allowedAttributes: {} }).trim();

    const addrId = 'addr_' + uuidv4().substring(0, 8);

    if (isDefault) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(req.user.id);
    }

    db.prepare(`
      INSERT INTO addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(addrId, req.user.id, cleanFullName, cleanPhone, cleanAddr1, cleanAddr2, cleanCity, cleanState, cleanPincode, country || 'India', isDefault ? 1 : 0);

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

// @route   DELETE /api/auth/me
// @desc    Self-account deletion (Removes/anonymizes user personal data & addresses)
router.delete('/me', verifyToken, (req, res) => {
  try {
    if (req.user.role === 'admin' || req.user.role === 'super_admin') {
      return res.status(403).json({ success: false, message: 'Administrative accounts cannot be self-deleted via storefront endpoint.' });
    }

    const userId = req.user.id;

    // Delete personal addresses and wishlists
    db.prepare('DELETE FROM addresses WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM wishlists WHERE user_id = ?').run(userId);

    // Anonymize user record
    db.prepare(`
      UPDATE users SET
        name = 'Deleted User',
        email = ?,
        phone = NULL,
        avatar = NULL,
        password = 'DELETED_ACCOUNT',
        is_blocked = 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(`deleted_${userId}@anonymized.local`, userId);

    res.json({
      success: true,
      message: 'Your account and personal data have been completely deleted and anonymized.'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting account.' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Initiate password reset with time-limited (15 min) crypto token
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const user = db.prepare('SELECT id, email FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
    if (!user) {
      // Do not reveal whether user exists
      return res.json({ success: true, message: 'If an account exists with this email, a password reset link has been dispatched.' });
    }

    const crypto = require('crypto');
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins expiry

    db.prepare(`
      INSERT INTO password_resets (id, user_id, token_hash, expires_at, used)
      VALUES (?, ?, ?, ?, 0)
    `).run(uuidv4(), user.id, tokenHash, expiresAt);

    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been dispatched.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error initiating password reset.' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Complete password reset with valid single-use token
router.post('/reset-password', (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const crypto = require('crypto');
    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const resetRecord = db.prepare(`
      SELECT * FROM password_resets
      WHERE token_hash = ? AND used = 0 AND expires_at > datetime('now')
    `).get(tokenHash);

    if (!resetRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    // Atomic consumption of token to prevent concurrent race condition (double spending)
    const consumeToken = db.prepare('UPDATE password_resets SET used = 1 WHERE id = ? AND used = 0').run(resetRecord.id);
    if (consumeToken.changes === 0) {
      return res.status(400).json({ success: false, message: 'This password reset token has already been consumed.' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hashedPassword, resetRecord.user_id);

    res.json({ success: true, message: 'Password has been successfully reset. You may now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
});

module.exports = router;
