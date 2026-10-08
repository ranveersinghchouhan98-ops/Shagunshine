const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const db = require('../config/db');

/**
 * Razorpay Standard Checkout API Endpoints
 */

// @route   POST /api/create-order
// @desc    Step 1: Create Razorpay Standard Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;

    // Validate amount
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum < 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Minimum amount is 100 paise (₹1).'
      });
    }

    // Call Razorpay API (amount in paise)
    const orderData = await paymentService.createPaymentOrder({
      amount: amountNum,
      isPaise: true,
      currency,
      receipt
    });

    // Record in payment_orders table for server-side verification and integrity
    try {
      db.prepare(`
        INSERT OR REPLACE INTO payment_orders (id, amount, currency, receipt)
        VALUES (?, ?, ?, ?)
      `).run(orderData.id, orderData.amount, currency, String(receipt));
    } catch (dbErr) {
      // payment_orders table optional recording
    }

    // Return standard response format: { order_id, amount, currency }
    res.status(200).json({
      success: true,
      order_id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      key_id: orderData.key_id
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create Razorpay order.'
    });
  }
});

// @route   POST /api/verify-payment
// @desc    Step 3: Verify HMAC-SHA256 signature
router.post('/verify-payment', (req, res) => {
  try {
    const {
      order_id,
      payment_id,
      razorpay_signature,
      razorpay_order_id,
      razorpay_payment_id,
      payment_order_id,
      signature
    } = req.body;

    const finalOrderId = order_id || razorpay_order_id || payment_order_id;
    const finalPaymentId = payment_id || razorpay_payment_id;
    const finalSignature = razorpay_signature || signature;

    // Missing fields: return 400
    if (!finalOrderId || !finalPaymentId || !finalSignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: order_id, payment_id, and razorpay_signature are required.'
      });
    }

    // Cryptographic HMAC-SHA256 verification
    const verification = paymentService.verifyPaymentSignature({
      order_id: finalOrderId,
      payment_id: finalPaymentId,
      razorpay_signature: finalSignature
    });

    // Signature mismatch: return 400
    if (!verification.verified) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Signature mismatch.'
      });
    }

    // Return success only if signatures match
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully.'
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying payment signature.'
    });
  }
});

module.exports = router;
