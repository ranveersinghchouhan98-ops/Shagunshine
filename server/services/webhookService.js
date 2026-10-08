const crypto = require('crypto');
const db = require('../config/db');

/**
 * Webhook Dispatcher and Signature Generator
 * Dispatches event payloads to registered webhooks with HMAC-SHA256 signatures,
 * retry tracking, and asynchronous delivery logging.
 */
class WebhookService {
  /**
   * Supported core webhook events in Shagun Shine Architecture:
   * - order.created
   * - order.updated
   * - order.cancelled
   * - payment.success
   * - payment.failed
   * - payment.refunded
   * - stock.updated
   * - product.created
   * - product.updated
   * - customer.created
   * - customer.updated
   */

  /**
   * Trigger an outgoing event
   * @param {string} event - e.g., 'order.created'
   * @param {object} payload - event data
   */
  async trigger(event, payload) {
    try {
      // Find active webhooks subscribed to this event or all events ('*')
      const webhooks = db.prepare('SELECT * FROM webhooks WHERE is_active = 1').all();

      for (const wh of webhooks) {
        let events = [];
        try {
          events = JSON.parse(wh.events || '[]');
        } catch (e) {
          events = [];
        }

        if (events.includes('*') || events.includes(event)) {
          // Fire and forget asynchronously
          this.deliver(wh, event, payload).catch(err => {
            console.error(`Webhook delivery failure to ${wh.url}:`, err.message);
          });
        }
      }
    } catch (err) {
      console.error('Error in WebhookService.trigger:', err.message);
    }
  }

  /**
   * Deliver payload to a specific webhook target with HMAC signature
   */
  async deliver(webhook, event, payload) {
    const timestamp = Date.now();
    const eventId = `evt_${crypto.randomBytes(8).toString('hex')}`;
    const wrappedPayload = {
      event_id: eventId,
      event,
      timestamp,
      data: payload
    };

    const bodyString = JSON.stringify(wrappedPayload);
    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(`${timestamp}.${bodyString}`)
      .digest('hex');

    const logId = `whl_${crypto.randomBytes(8).toString('hex')}`;
    let statusCode = null;
    let responseText = '';
    let success = 0;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const res = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shagun-Event': event,
          'X-Shagun-Event-Id': eventId,
          'X-Shagun-Timestamp': String(timestamp),
          'X-Shagun-Signature': `t=${timestamp},v1=${signature}`,
          'User-Agent': 'ShagunShine-Webhook-Engine/1.0'
        },
        body: bodyString,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      statusCode = res.status;
      responseText = await res.text();
      success = res.ok ? 1 : 0;

      // Update webhook last triggered
      db.prepare(`
        UPDATE webhooks 
        SET last_triggered_at = CURRENT_TIMESTAMP, 
            failure_count = CASE WHEN ? = 1 THEN 0 ELSE failure_count + 1 END
        WHERE id = ?
      `).run(success, webhook.id);

    } catch (err) {
      statusCode = 0;
      responseText = err.message;
      success = 0;
      db.prepare('UPDATE webhooks SET failure_count = failure_count + 1 WHERE id = ?').run(webhook.id);
    }

    try {
      db.prepare(`
        INSERT INTO webhook_logs (
          id, webhook_id, event, direction, payload, response_status, response_body, success
        ) VALUES (?, ?, ?, 'outgoing', ?, ?, ?, ?)
      `).run(
        logId,
        webhook.id,
        event,
        bodyString,
        statusCode,
        responseText ? responseText.substring(0, 1000) : '',
        success
      );
    } catch (dbErr) {
      console.error('Error logging webhook delivery:', dbErr.message);
    }
  }

  /**
   * Verify incoming webhook HMAC signature
   * @param {string} payload - raw body string
   * @param {string} signatureHeader - incoming signature header
   * @param {string} secret - shared secret key
   */
  verifyIncomingSignature(payload, signatureHeader, secret) {
    if (!payload || !signatureHeader || !secret) return false;

    try {
      // Standard signature formats supported:
      // 1) v1=hex
      // 2) t=timestamp,v1=hex
      let expectedHash = '';
      if (signatureHeader.includes('v1=')) {
        const parts = signatureHeader.split(',');
        const v1Part = parts.find(p => p.trim().startsWith('v1='));
        const tPart = parts.find(p => p.trim().startsWith('t='));

        if (v1Part && tPart) {
          const timestamp = tPart.split('=')[1].trim();
          const providedSig = v1Part.split('=')[1].trim();
          const computed = crypto.createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
          return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(providedSig));
        } else if (v1Part) {
          const providedSig = v1Part.split('=')[1].trim();
          const computed = crypto.createHmac('sha256', secret).update(payload).digest('hex');
          return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(providedSig));
        }
      }

      // Direct hex comparison
      const computed = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signatureHeader));
    } catch (e) {
      return false;
    }
  }

  /**
   * Check idempotency: returns true if event was already processed
   */
  isDuplicateEvent(eventId, source, eventType) {
    if (!eventId) return false;
    const existing = db.prepare('SELECT id FROM processed_webhooks WHERE id = ?').get(eventId);
    if (existing) return true;

    try {
      db.prepare(`
        INSERT INTO processed_webhooks (id, source, event_type)
        VALUES (?, ?, ?)
      `).run(eventId, source, eventType);
      return false;
    } catch (e) {
      return true;
    }
  }
}

module.exports = new WebhookService();
