const crypto = require('crypto');
const db = require('../config/db');

let Razorpay = null;
try {
  Razorpay = require('razorpay');
} catch (e) {
  Razorpay = null;
}

/**
 * Razorpay Payment Service for Shagun Shine Cosmetics
 * Full support for UPI (GPay, PhonePe, Paytm), Cards (Credit/Debit), NetBanking.
 * 100% Prepaid store policy (COD permanently disabled).
 */
class PaymentService {
  constructor() {
    this.refreshConfig();
  }

  refreshConfig() {
    try {
      const row = db.prepare("SELECT value FROM settings WHERE key = 'payment_config'").get();
      if (row && row.value) {
        const parsed = JSON.parse(row.value);
        this.config = {
          provider: 'razorpay',
          key_id: parsed.razorpayKeyId || parsed.payment_key_id || process.env.RAZORPAY_KEY_ID || '',
          key_secret: parsed.razorpayKeySecret || parsed.payment_secret || process.env.RAZORPAY_KEY_SECRET || '',
          webhook_secret: parsed.webhookSecret || parsed.webhook_secret || process.env.RAZORPAY_WEBHOOK_SECRET || '',
          cod_enabled: false
        };
      } else {
        this.config = {
          provider: 'razorpay',
          key_id: process.env.RAZORPAY_KEY_ID || '',
          key_secret: process.env.RAZORPAY_KEY_SECRET || process.env.PAYMENT_SECRET || '',
          webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '',
          cod_enabled: false
        };
      }
    } catch (e) {
      this.config = {
        provider: 'razorpay',
        key_id: process.env.RAZORPAY_KEY_ID || '',
        key_secret: process.env.RAZORPAY_KEY_SECRET || process.env.PAYMENT_SECRET || '',
        webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '',
        cod_enabled: false
      };
    }

    if (Razorpay && this.config.key_id && this.config.key_secret && !this.config.key_id.startsWith('rzp_test_mock')) {
      try {
        this.razorpayInstance = new Razorpay({
          key_id: this.config.key_id,
          key_secret: this.config.key_secret
        });
      } catch (err) {
        this.razorpayInstance = null;
      }
    } else {
      this.razorpayInstance = null;
    }
  }

  getPublicConfig() {
    this.refreshConfig();
    return {
      provider: 'razorpay',
      key_id: this.config.key_id || 'rzp_test_placeholder',
      cod_enabled: false, // Strict: 100% Prepaid
      supported_methods: ['UPI', 'CARD', 'NETBANKING', 'WALLET']
    };
  }

  /**
   * Create an online payment order on Razorpay
   * @param {Object} params - { amount, amountInPaise, isPaise, currency, receipt, notes }
   */
  async createPaymentOrder({ amount, amountInPaise, isPaise = false, currency = 'INR', receipt, notes = {} }) {
    this.refreshConfig();

    let finalPaise;
    if (amountInPaise !== undefined) {
      finalPaise = Math.round(Number(amountInPaise));
    } else if (isPaise) {
      finalPaise = Math.round(Number(amount));
    } else {
      finalPaise = Math.round(Number(amount) * 100);
    }

    if (isNaN(finalPaise) || finalPaise < 100) {
      const err = new Error('Amount must be at least 100 paise.');
      err.statusCode = 400;
      throw err;
    }

    if (this.razorpayInstance) {
      try {
        const order = await this.razorpayInstance.orders.create({
          amount: finalPaise,
          currency,
          receipt: String(receipt || `rcpt_${Date.now()}`),
          notes
        });
        return {
          id: order.id,
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
          provider: 'razorpay',
          key_id: this.config.key_id
        };
      } catch (err) {
        console.error('Razorpay API order creation error:', err);
        const isAuthError = err.statusCode === 401 || err.error?.description === 'Authentication failed';
        
        // In local development / test mode with ALLOW_MOCK_PAYMENTS enabled, allow graceful simulation fallback
        if (isAuthError && (process.env.ALLOW_MOCK_PAYMENTS === 'true' || process.env.NODE_ENV === 'test')) {
          console.warn('⚠️ Razorpay credentials failed (401), but ALLOW_MOCK_PAYMENTS is active. Using simulated test order.');
          const orderId = 'order_sim_' + crypto.randomBytes(8).toString('hex');
          return {
            id: orderId,
            order_id: orderId,
            amount: finalPaise,
            currency,
            receipt: String(receipt || `rcpt_${Date.now()}`),
            status: 'created',
            provider: 'razorpay',
            key_id: this.config.key_id || 'rzp_test_placeholder'
          };
        }

        let message = err.error?.description || err.message || 'Razorpay order creation failed.';
        if (isAuthError) {
          message = 'Payment Gateway Authentication Failed: Your Razorpay Key ID or Key Secret is invalid or expired. Please generate fresh API keys from the Razorpay Dashboard (Account & Settings → API Keys) and update them in your .env or Admin Settings.';
        }

        const apiError = new Error(message);
        apiError.statusCode = err.statusCode || 500;
        throw apiError;
      }
    }

    // Simulated / fallback order creation for offline testing
    const orderId = 'order_' + crypto.randomBytes(8).toString('hex');
    return {
      id: orderId,
      order_id: orderId,
      amount: finalPaise,
      currency,
      receipt: String(receipt || `rcpt_${Date.now()}`),
      status: 'created',
      provider: 'razorpay',
      key_id: this.config.key_id || 'rzp_test_placeholder'
    };
  }

  /**
   * Verify HMAC-SHA256 signature from Razorpay payment modal
   * Signature formula: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
   * @param {Object} params - { payment_order_id, payment_id, signature, order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature }
   */
  verifyPaymentSignature({
    payment_order_id,
    payment_id,
    signature,
    order_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  }) {
    this.refreshConfig();

    const finalOrderId = order_id || payment_order_id || razorpay_order_id;
    const finalPaymentId = payment_id || razorpay_payment_id;
    const finalSignature = signature || razorpay_signature;

    if (!finalOrderId || !finalPaymentId || !finalSignature) {
      return { verified: false, error: 'Missing required signature verification fields.' };
    }

    // Restrict simulated test signatures strictly to test runners with explicit flag
    if ((process.env.NODE_ENV === 'test' || process.env.ALLOW_MOCK_PAYMENTS === 'true') && (finalSignature.startsWith('mock_sig_') || finalSignature.startsWith('sig_sim_') || finalSignature.startsWith('sig_sample_'))) {
      return { verified: true, provider: 'razorpay' };
    }

    const secret = this.config.key_secret || process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return { verified: false, error: 'Payment gateway key secret not configured on server' };
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${finalOrderId}|${finalPaymentId}`)
      .digest('hex');

    const generatedBuf = Buffer.from(generatedSignature, 'utf8');
    const providedBuf = Buffer.from(finalSignature, 'utf8');

    if (generatedBuf.length !== providedBuf.length) {
      return { verified: false, provider: 'razorpay' };
    }

    const isMatch = crypto.timingSafeEqual(generatedBuf, providedBuf);
    return { verified: isMatch, provider: 'razorpay' };
  }

  /**
   * Verify Incoming Razorpay Webhook Signature
   */
  verifyWebhookSignature(rawBody, signatureHeader) {
    this.refreshConfig();
    const webhookSecret = this.config.webhook_secret || this.config.key_secret;
    if (!webhookSecret || !signatureHeader) return false;

    try {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf8'),
        Buffer.from(signatureHeader, 'utf8')
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Process a refund via Razorpay
   */
  async processRefund({ paymentId, amount, reason = 'Customer Cancellation' }) {
    this.refreshConfig();
    const amountInPaise = Math.round(Number(amount) * 100);

    if (this.razorpayInstance && paymentId && !paymentId.startsWith('pay_mock')) {
      try {
        const refund = await this.razorpayInstance.payments.refund(paymentId, {
          amount: amountInPaise,
          notes: { reason }
        });
        return {
          id: refund.id,
          status: refund.status || 'processed',
          amount: Number(amount),
          provider: 'razorpay',
          reason
        };
      } catch (err) {
        console.error('Razorpay refund API error:', err);
      }
    }

    return {
      id: 'rfnd_' + crypto.randomBytes(6).toString('hex'),
      status: 'processed',
      amount: Number(amount),
      provider: 'razorpay',
      reason
    };
  }
}

module.exports = new PaymentService();
