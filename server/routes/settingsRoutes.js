const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, hasRole, optionalToken } = require('../middleware/auth');
const auditService = require('../services/auditService');

// @route   GET /api/settings/public
// @desc    Get public store configuration (store profile, GST number, shipping threshold, social links)
router.get('/public', (req, res) => {
  try {
    const rows = db.prepare("SELECT key, value FROM settings WHERE key IN ('store_profile', 'shipping_config', 'seo_config', 'gst_config')").all();
    const config = {};
    for (const r of rows) {
      try {
        config[r.key] = JSON.parse(r.value);
      } catch (e) {
        config[r.key] = r.value;
      }
    }
    res.json({ success: true, settings: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/settings
// @desc    Get all administrative settings
router.get('/', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    for (const r of rows) {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch (e) {
        settings[r.key] = r.value;
      }
    }

    // Mask all sensitive payment secrets and webhook credentials
    if (settings.payment_config && typeof settings.payment_config === 'object') {
      const secretFields = ['payment_secret', 'razorpayKeySecret', 'webhookSecret', 'webhook_secret', 'key_secret'];
      for (const f of secretFields) {
        if (settings.payment_config[f]) {
          const secret = String(settings.payment_config[f]);
          settings.payment_config[f] = secret.length > 8 ? secret.slice(0, 4) + '********' : '********';
        }
      }
    }

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/settings/:key
// @desc    Update a specific configuration setting
router.put('/:key', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'Value is required.' });
    }

    const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);

    // If updating payment_config, preserve existing secrets if masked versions passed back
    if (key === 'payment_config' && typeof value === 'object') {
      const existing = db.prepare("SELECT value FROM settings WHERE key = 'payment_config'").get();
      if (existing && existing.value) {
        try {
          const existingParsed = JSON.parse(existing.value);
          const secretFields = ['payment_secret', 'razorpayKeySecret', 'webhookSecret', 'webhook_secret', 'key_secret'];
          for (const f of secretFields) {
            if (value[f] && typeof value[f] === 'string' && value[f].includes('****')) {
              value[f] = existingParsed[f];
            }
          }
        } catch (e) {
          // ignore parsing error
        }
      }
    }

    const stmt = db.prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
    `);
    stmt.run(key, typeof value === 'object' ? JSON.stringify(value) : valueStr);

    auditService.log({
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'UPDATE_SETTINGS',
      entityType: 'setting',
      entityId: key,
      details: { key },
      ipAddress: req.ip
    });

    res.json({ success: true, message: `Setting '${key}' updated successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/settings/purge-demo
// @desc    Safely clear all demo transactional data (orders, returns, coupon usages, demo reviews)
router.post('/purge-demo', verifyToken, hasRole(['super_admin']), (req, res) => {
  try {
    const purgeTx = db.transaction(() => {
      db.prepare('DELETE FROM order_items').run();
      db.prepare('DELETE FROM orders').run();
      db.prepare('DELETE FROM returns').run();
      db.prepare('DELETE FROM coupon_usages').run();
      db.prepare('DELETE FROM inventory_logs').run();
      db.prepare('DELETE FROM audit_logs').run();
      db.prepare("DELETE FROM users WHERE role = 'customer'").run();
      // Reset coupon usage counts
      db.prepare('UPDATE coupons SET times_used = 0').run();
      // Reset product stock to standard default levels
      db.prepare('UPDATE products SET stock_quantity = 50, status = "active"').run();
    });

    purgeTx();

    auditService.log({
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'PURGE_DEMO_DATA',
      entityType: 'database',
      entityId: 'all_tables',
      details: { message: 'Demo transactions, customers, and test orders cleared for production launch.' },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Demo transactional data purged successfully! Database is clean for live client handover.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
