const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/db');
const { verifyToken, hasRole } = require('../middleware/auth');
const webhookService = require('../services/webhookService');
const paymentService = require('../services/paymentService');

/**
 * --------------------------------------------------------------------------
 * INCOMING WEBHOOKS
 * --------------------------------------------------------------------------
 */

// @route   POST /api/webhooks/incoming/payment-gateway
// @desc    Payment gateway webhook (Digital payment verification)
router.post('/incoming/payment-gateway', async (req, res) => {
  try {
    const signature = req.headers['x-gateway-signature'] || req.headers['x-webhook-signature'] || req.headers['x-razorpay-signature'];
    const row = db.prepare("SELECT value FROM settings WHERE key = 'payment_config'").get();
    let webhookSecret = '';
    if (row && row.value) {
      const cfg = JSON.parse(row.value);
      webhookSecret = cfg.webhook_secret || cfg.payment_secret;
    }

    // Server-side Signature Verification strictly enforced
    const effectiveSecret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;
    if (!effectiveSecret) {
      return res.status(503).json({ success: false, message: 'Payment webhook is not configured on the server.' });
    }
    if (!signature) {
      return res.status(401).json({ success: false, message: 'Missing payment webhook signature header.' });
    }
    const isValid = paymentService.verifyWebhookSignature(JSON.stringify(req.body), signature);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid payment webhook signature.' });
    }

    const { event, payload } = req.body;
    const eventId = req.headers['x-event-id'] || req.headers['x-razorpay-event-id'] || `pay_evt_${Date.now()}`;

    // Duplicate webhook protection
    if (webhookService.isDuplicateEvent(eventId, 'payment_gateway', event || 'payment.event')) {
      return res.status(200).json({ success: true, message: 'Event already processed.' });
    }

    // Handle payment.captured / payment.authorized
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload?.payment?.entity;
      const gatewayOrderId = paymentEntity?.order_id;
      const gatewayPaymentId = paymentEntity?.id;

      if (gatewayOrderId) {
        const order = db.prepare('SELECT id, order_number, payment_status FROM orders WHERE payment_gateway_order_id = ?').get(gatewayOrderId);
        if (order && order.payment_status !== 'Paid') {
          db.prepare(`
            UPDATE orders 
            SET payment_status = 'Paid',
                payment_gateway_payment_id = COALESCE(payment_gateway_payment_id, ?),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(gatewayPaymentId, order.id);

          webhookService.trigger('payment.success', {
            orderId: order.id,
            orderNumber: order.order_number,
            paymentId: gatewayPaymentId
          });
        }
      }
    }

    // Handle payment.failed
    if (event === 'payment.failed') {
      const paymentEntity = payload?.payment?.entity;
      const gatewayOrderId = paymentEntity?.order_id;

      if (gatewayOrderId) {
        db.prepare(`
          UPDATE orders 
          SET payment_status = 'Failed',
              updated_at = CURRENT_TIMESTAMP
          WHERE payment_gateway_order_id = ?
        `).run(gatewayOrderId);

        webhookService.trigger('payment.failed', {
          gatewayOrderId,
          reason: paymentEntity?.error_description || 'Payment failed'
        });
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Payment Webhook Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * --------------------------------------------------------------------------
 * OUTGOING WEBHOOK SUBSCRIPTION MANAGEMENT (ADMIN ONLY)
 * --------------------------------------------------------------------------
 */

// @route   GET /api/webhooks
// @desc    List all registered webhook endpoints
router.get('/', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const webhooks = db.prepare('SELECT id, name, url, events, is_active, failure_count, last_triggered_at, created_at FROM webhooks ORDER BY created_at DESC').all();
    const formatted = webhooks.map(w => ({
      ...w,
      events: typeof w.events === 'string' ? JSON.parse(w.events || '[]') : w.events || []
    }));
    res.json({ success: true, webhooks: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const isValidWebhookUrl = (urlString) => {
  try {
    const parsed = new URL(urlString);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
      return false;
    }
    // Block loopback, private networks, and cloud metadata (SSRF defense)
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '169.254.169.254' ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

// @route   POST /api/webhooks
// @desc    Register a new webhook subscription
router.post('/', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const { name, url, events = ['*'] } = req.body;
    if (!name || !url) {
      return res.status(400).json({ success: false, message: 'Name and valid destination URL are required.' });
    }

    if (!isValidWebhookUrl(url)) {
      return res.status(400).json({ success: false, message: 'Invalid or restricted webhook URL. Internal/private endpoints are forbidden.' });
    }

    const id = `wh_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const secret = `whsec_${crypto.randomBytes(24).toString('hex')}`;

    db.prepare(`
      INSERT INTO webhooks (id, name, url, events, secret, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(id, name, url, JSON.stringify(events), secret);

    res.json({
      success: true,
      message: 'Webhook subscription created successfully.',
      webhook: {
        id,
        name,
        url,
        events,
        secret // returned once upon creation for security
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/webhooks/:id
// @desc    Update webhook status or subscribed events
router.put('/:id', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const { name, url, events, is_active } = req.body;
    const existing = db.prepare('SELECT * FROM webhooks WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Webhook not found.' });
    }

    if (url && !isValidWebhookUrl(url)) {
      return res.status(400).json({ success: false, message: 'Invalid or restricted webhook URL. Internal/private endpoints are forbidden.' });
    }

    db.prepare(`
      UPDATE webhooks 
      SET name = COALESCE(?, name),
          url = COALESCE(?, url),
          events = COALESCE(?, events),
          is_active = COALESCE(?, is_active)
      WHERE id = ?
    `).run(
      name,
      url,
      events ? JSON.stringify(events) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      req.params.id
    );

    res.json({ success: true, message: 'Webhook updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/webhooks/:id
// @desc    Delete webhook endpoint
router.delete('/:id', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    db.prepare('DELETE FROM webhooks WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Webhook deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/webhooks/logs
// @desc    Get recent webhook delivery logs
router.get('/logs', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT wl.*, w.name as webhook_name, w.url as webhook_url
      FROM webhook_logs wl
      LEFT JOIN webhooks w ON wl.webhook_id = w.id
      ORDER BY wl.created_at DESC
      LIMIT 100
    `).all();

    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/webhooks/:id/test
// @desc    Trigger test webhook payload
router.post('/:id/test', verifyToken, hasRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const webhook = db.prepare('SELECT * FROM webhooks WHERE id = ?').get(req.params.id);
    if (!webhook) {
      return res.status(404).json({ success: false, message: 'Webhook not found.' });
    }

    await webhookService.deliver(webhook, 'test.ping', {
      message: 'Shagun Shine Webhook Engine Test Connection',
      timestamp: new Date().toISOString(),
      store: 'Shagun Shine Cosmetics'
    });

    res.json({ success: true, message: 'Test ping dispatched to webhook endpoint.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
