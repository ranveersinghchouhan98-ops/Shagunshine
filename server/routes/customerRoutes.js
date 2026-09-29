const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, hasRole } = require('../middleware/auth');

// @route   GET /api/customers (Admin only)
// @desc    Get all customers with aggregate order statistics
router.get('/', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT
        u.id, u.name, u.email, u.phone, u.avatar, u.is_blocked, u.created_at,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        MAX(o.created_at) as last_order_date
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id OR u.email = o.customer_email
      WHERE u.role = 'customer'
    `;
    const params = [];

    if (search) {
      query += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ` GROUP BY u.id ORDER BY u.created_at DESC`;

    const customers = db.prepare(query).all(...params);
    res.json({ success: true, customers });
  } catch (error) {
    console.error('Fetch customers error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching customers.' });
  }
});

// @route   GET /api/customers/:id (Admin only)
// @desc    Get customer details and order history
router.get('/:id', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const customer = db.prepare('SELECT id, name, email, phone, avatar, is_blocked, created_at FROM users WHERE id = ?').get(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? OR customer_email = ? ORDER BY created_at DESC').all(customer.id, customer.email);
    const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ?').all(customer.id);

    res.json({
      success: true,
      customer,
      addresses,
      orders
    });
  } catch (error) {
    console.error('Fetch customer details error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching customer details.' });
  }
});

// @route   PUT /api/customers/:id/toggle-block (Admin only)
router.put('/:id/toggle-block', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const customer = db.prepare('SELECT id, is_blocked FROM users WHERE id = ?').get(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    const newStatus = customer.is_blocked ? 0 : 1;
    db.prepare('UPDATE users SET is_blocked = ? WHERE id = ?').run(newStatus, customer.id);

    res.json({
      success: true,
      message: newStatus ? 'Customer account has been suspended.' : 'Customer account unblocked.',
      is_blocked: newStatus
    });
  } catch (error) {
    console.error('Toggle block error:', error);
    res.status(500).json({ success: false, message: 'Server error updating customer status.' });
  }
});

module.exports = router;
