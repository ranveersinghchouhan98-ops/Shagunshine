require('dotenv').config();
const assert = require('assert');
const crypto = require('crypto');
const paymentService = require('../services/paymentService');

console.log('🧪 Starting Razorpay Standard Checkout Integration Test Suite...\n');

async function testRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  console.log(`Configured Razorpay Key ID: ${keyId}`);
  assert.ok(keyId && (keyId.startsWith('rzp_test_') || keyId.startsWith('rzp_live_')), 'RAZORPAY_KEY_ID must be configured');
  assert.ok(keySecret && keySecret.length > 10, 'RAZORPAY_KEY_SECRET must be configured');

  // Test 1: Minimum amount validation (< 100 paise rejected)
  try {
    await paymentService.createPaymentOrder({ amount: 0.5, amountInPaise: 50 });
    assert.fail('Should have failed for amount < 100 paise');
  } catch (err) {
    assert.strictEqual(err.statusCode, 400);
    console.log('  ✅ PASS: Rejects order creation for amount < 100 paise');
  }

  // Test 2: Live Razorpay Order Creation via official API
  const testAmountPaise = 50000; // ₹500
  const orderRes = await paymentService.createPaymentOrder({
    amountInPaise: testAmountPaise,
    currency: 'INR',
    receipt: `test_rcpt_${Date.now()}`
  });

  assert.ok(orderRes.order_id || orderRes.id, 'Returns valid Razorpay order_id');
  const orderId = orderRes.order_id || orderRes.id;
  assert.ok(orderId.startsWith('order_'), `Order ID starts with 'order_': ${orderId}`);
  assert.strictEqual(orderRes.amount, testAmountPaise, 'Amount matches in paise');
  assert.strictEqual(orderRes.currency, 'INR', 'Currency is INR');
  console.log(`  ✅ PASS: Successfully created live Razorpay Order (${orderId}, ₹${testAmountPaise / 100})`);

  // Test 3: Signature Verification with Genuine HMAC-SHA256
  const testPaymentId = 'pay_' + crypto.randomBytes(7).toString('hex');
  const validSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${testPaymentId}`)
    .digest('hex');

  const validVerif = paymentService.verifyPaymentSignature({
    order_id: orderId,
    payment_id: testPaymentId,
    razorpay_signature: validSignature
  });
  assert.strictEqual(validVerif.verified, true, 'Valid HMAC signature is verified');
  console.log('  ✅ PASS: Correct HMAC-SHA256 signature verified successfully');

  // Test 4: Tampered / Invalid Signature Rejection
  const invalidVerif = paymentService.verifyPaymentSignature({
    order_id: orderId,
    payment_id: testPaymentId,
    razorpay_signature: 'fake_tampered_signature_99999'
  });
  assert.strictEqual(invalidVerif.verified, false, 'Tampered signature is strictly rejected');
  console.log('  ✅ PASS: Tampered/invalid signature strictly rejected');

  // Test 5: Missing parameters rejection
  const missingVerif = paymentService.verifyPaymentSignature({
    order_id: orderId,
    payment_id: ''
  });
  assert.strictEqual(missingVerif.verified, false, 'Missing payment_id is rejected');
  console.log('  ✅ PASS: Missing signature verification fields rejected');

  console.log('\n======================================================');
  console.log('🎯 All 5 Razorpay Standard Checkout Tests Passed 100%!');
  console.log('======================================================\n');
}

testRazorpay().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
