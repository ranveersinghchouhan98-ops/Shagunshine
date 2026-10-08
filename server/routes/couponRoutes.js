const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyToken, hasRole } = require('../middleware/auth');

// @route   POST /api/coupons/validate
// @desc    Validate a coupon code at checkout
router.post('/validate', (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
    }

    const coupon = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1').get(code.trim());
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code.' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (coupon.expiry_date < today) {
      return res.status(400).json({ success: false, message: 'This coupon code has expired.' });
    }

    if (coupon.times_used >= coupon.usage_limit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit has been reached.' });
    }

    const amount = Number(cartTotal);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'A valid positive cart total is required to apply coupons.' });
    }
    if (coupon.min_spend && amount < coupon.min_spend) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.min_spend.toLocaleString()} required for this coupon.`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (amount * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = Math.min(coupon.discount_value, amount);
    }

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" applied successfully! You saved ₹${discount.toFixed(0)}.`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        calculatedDiscount: discount
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ success: false, message: 'Server error validating coupon.' });
  }
});

// @route   GET /api/coupons (Admin only)
router.get('/', verifyToken, hasRole(['admin', 'product_manager']), (req, res) => {
  try {
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all();
    res.json({ success: true, coupons });
  } catch (error) {
    console.error('Fetch coupons error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching coupons.' });
  }
});

// @route   POST /api/coupons (Admin only)
router.post('/', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const { code, discount_type, discount_value, min_spend, max_discount, usage_limit, expiry_date, is_active } = req.body;
    if (!code || !discount_type || !discount_value || !expiry_date) {
      return res.status(400).json({ success: false, message: 'Code, discount type, value, and expiry date are required.' });
    }
    const numValue = Number(discount_value);
    if (isNaN(numValue) || numValue <= 0) {
      return res.status(400).json({ success: false, message: 'Discount value must be a positive number.' });
    }
    if (discount_type === 'percentage' && (numValue < 1 || numValue > 100)) {
      return res.status(400).json({ success: false, message: 'Percentage discount must be between 1% and 100%.' });
    }
    if (!['percentage', 'fixed'].includes(discount_type)) {
      return res.status(400).json({ success: false, message: "Invalid discount type. Must be 'percentage' or 'fixed'." });
    }

    const existing = db.prepare('SELECT id FROM coupons WHERE UPPER(code) = UPPER(?)').get(code.trim());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists.' });
    }

    const id = 'cpn_' + uuidv4().substring(0, 8);
    db.prepare(`
      INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, max_discount, usage_limit, expiry_date, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      code.trim().toUpperCase(),
      discount_type,
      Number(discount_value),
      Number(min_spend || 0),
      max_discount ? Number(max_discount) : null,
      Number(usage_limit || 1000),
      expiry_date,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    );

    const coupon = db.prepare('SELECT * FROM coupons WHERE id = ?').get(id);
    res.status(201).json({ success: true, message: 'Coupon created successfully.', coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating coupon.' });
  }
});

// @route   PUT /api/coupons/:id (Admin only)
router.put('/:id', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount_type, discount_value, min_spend, max_discount, usage_limit, expiry_date, is_active } = req.body;

    db.prepare(`
      UPDATE coupons SET
        code = COALESCE(?, code),
        discount_type = COALESCE(?, discount_type),
        discount_value = COALESCE(?, discount_value),
        min_spend = COALESCE(?, min_spend),
        max_discount = COALESCE(?, max_discount),
        usage_limit = COALESCE(?, usage_limit),
        expiry_date = COALESCE(?, expiry_date),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `).run(
      code ? code.toUpperCase() : null,
      discount_type,
      discount_value !== undefined ? Number(discount_value) : null,
      min_spend !== undefined ? Number(min_spend) : null,
      max_discount !== undefined ? Number(max_discount) : null,
      usage_limit !== undefined ? Number(usage_limit) : null,
      expiry_date,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      id
    );

    const coupon = db.prepare('SELECT * FROM coupons WHERE id = ?').get(id);
    res.json({ success: true, message: 'Coupon updated successfully.', coupon });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ success: false, message: 'Server error updating coupon.' });
  }
});

// @route   DELETE /api/coupons/:id (Admin only)
router.delete('/:id', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    db.prepare('DELETE FROM coupons WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Coupon deleted successfully.' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting coupon.' });
  }
});

module.exports = router;
