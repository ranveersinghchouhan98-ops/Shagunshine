const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
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
      const cleanSearch = String(search).trim().substring(0, 80).replace(/[%_\\]/g, '\\$&');
      query += ` AND (u.name LIKE ? ESCAPE '\\' OR u.email LIKE ? ESCAPE '\\' OR u.phone LIKE ? ESCAPE '\\')`;
      const term = `%${cleanSearch}%`;
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

// @route   POST /api/customers/sync-pos-customer
// @desc    Connect & sync physical shop in-store customer to central database
router.post('/sync-pos-customer', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const { name, phone, email, address, total_purchase = 0 } = req.body;
    if (!name || (!phone && !email)) {
      return res.status(400).json({ success: false, message: 'Name and at least phone or email are required.' });
    }

    const cleanName = sanitizeHtml(name, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanPhone = phone ? sanitizeHtml(phone, { allowedTags: [], allowedAttributes: {} }).trim() : null;
    const cleanEmail = email ? sanitizeHtml(email, { allowedTags: [], allowedAttributes: {} }).trim().toLowerCase() : null;
    const safePurchase = Math.max(0, parseFloat(total_purchase) || 0);

    const { v4: uuidv4 } = require('uuid');
    const bcrypt = require('bcryptjs');

    // Check if customer already exists by phone or email
    let customer = null;
    if (cleanPhone) customer = db.prepare('SELECT * FROM users WHERE phone = ?').get(cleanPhone);
    if (!customer && cleanEmail) customer = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    let customerId;
    if (customer) {
      customerId = customer.id;
      db.prepare(`
        UPDATE users SET
          name = COALESCE(?, name),
          total_spent = total_spent + ?,
          total_orders = total_orders + 1,
          last_order_date = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(cleanName, safePurchase, customerId);
    } else {
      customerId = 'usr_' + uuidv4().substring(0, 8);
      const tempEmail = cleanEmail || `pos_${(cleanPhone || '').replace(/[^0-9]/g, '')}@shagunshine.store`;
      const tempPass = bcrypt.hashSync(uuidv4(), 10);

      db.prepare(`
        INSERT INTO users (
          id, name, email, phone, password, role, total_spent, total_orders, last_order_date
        ) VALUES (?, ?, ?, ?, ?, 'customer', ?, 1, CURRENT_TIMESTAMP)
      `).run(customerId, cleanName, tempEmail, cleanPhone, tempPass, safePurchase);

      if (address) {
        db.prepare(`
          INSERT INTO addresses (id, user_id, full_name, phone, address_line1, city, state, postal_code, is_default)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `).run(
          'addr_' + uuidv4().substring(0, 8),
          customerId,
          name,
          phone || '',
          address.line1 || address.address_line1 || 'In-Store Customer',
          address.city || 'Mumbai',
          address.state || 'Maharashtra',
          address.postal_code || address.pincode || '400001'
        );
      }
    }

    const webhookService = require('../services/webhookService');
    webhookService.trigger('customer.updated', {
      customerId,
      name,
      phone,
      email,
      source: 'pos'
    });

    const updatedCustomer = db.prepare('SELECT id, name, email, phone, total_spent, total_orders, last_order_date FROM users WHERE id = ?').get(customerId);

    res.json({
      success: true,
      message: 'Physical shop in-store customer synchronized with centralized database.',
      customer: updatedCustomer
    });
  } catch (error) {
    console.error('POS customer sync error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
