const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyToken, hasRole } = require('../middleware/auth');

// @route   GET /api/admin-users (Super Admin only)
router.get('/', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, name, email, phone, role, avatar, is_blocked, created_at
      FROM users
      WHERE role IN ('admin', 'product_manager', 'order_manager')
      ORDER BY created_at ASC
    `).all();

    res.json({ success: true, users });
  } catch (error) {
    console.error('Fetch admin users error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching team members.' });
  }
});

// @route   POST /api/admin-users (Super Admin only)
// @desc    Add new sub-admin with limited role
router.post('/', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and role are required.' });
    }

    if (!['admin', 'product_manager', 'order_manager'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role assigned.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const userId = 'usr_' + uuidv4().substring(0, 8);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=8B1E3B,C5A049`;

    db.prepare(`
      INSERT INTO users (id, name, email, password, phone, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, name.trim(), email.trim().toLowerCase(), hashedPassword, phone || null, role, avatar);

    const created = db.prepare('SELECT id, name, email, phone, role, avatar, created_at FROM users WHERE id = ?').get(userId);
    res.status(201).json({ success: true, message: 'Staff member added successfully.', user: created });
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating staff account.' });
  }
});

// @route   PUT /api/admin-users/:id/role (Super Admin only)
router.put('/:id/role', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'product_manager', 'order_manager'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    // Prevent demoting current self if only 1 admin
    if (req.user.id === id && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot remove your own Super Admin privileges.' });
    }

    db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(role, id);
    res.json({ success: true, message: 'Role updated successfully.' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ success: false, message: 'Server error updating role.' });
  }
});

// @route   DELETE /api/admin-users/:id (Super Admin only)
router.delete('/:id', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id === id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.json({ success: true, message: 'Staff member removed successfully.' });
  } catch (error) {
    console.error('Delete admin user error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting user.' });
  }
});

module.exports = router;
