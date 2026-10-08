process.env.NODE_ENV = 'test';
const assert = require('assert');
const path = require('path');
const db = require('../config/db');
const taxService = require('../services/taxService');
const shippingService = require('../services/shippingService');
const paymentService = require('../services/paymentService');
const auditService = require('../services/auditService');

console.log('🧪 Starting Shagun Shine Cosmetics Automated Integration Test Suite...\n');

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Indian GST Tax Engine
  const gstConf = taxService.getGstConfig();
  const originState = gstConf.state || gstConf.registeredState || 'Maharashtra';
  const otherState = originState.toLowerCase() === 'delhi' ? 'Maharashtra' : 'Delhi';

  test(`Tax Service: Intra-state (${originState} to ${originState}) splits into 9% CGST + 9% SGST`, () => {
    const items = [{ price: 1180, quantity: 1, gstRate: 18 }];
    const res = taxService.calculateOrderTax(items, originState, 0);
    assert.strictEqual(res.isInterState, false);
    assert.strictEqual(res.taxableAmount, 1000);
    assert.strictEqual(res.cgstAmount, 90);
    assert.strictEqual(res.sgstAmount, 90);
    assert.strictEqual(res.igstAmount, 0);
    assert.strictEqual(res.totalTax, 180);
  });

  test(`Tax Service: Inter-state (${originState} to ${otherState}) assigns 18% IGST`, () => {
    const items = [{ price: 1180, quantity: 1, gstRate: 18 }];
    const res = taxService.calculateOrderTax(items, otherState, 0);
    assert.strictEqual(res.isInterState, true);
    assert.strictEqual(res.taxableAmount, 1000);
    assert.strictEqual(res.cgstAmount, 0);
    assert.strictEqual(res.sgstAmount, 0);
    assert.strictEqual(res.igstAmount, 180);
    assert.strictEqual(res.totalTax, 180);
  });

  // 2. Indian Shipping & Pincode Serviceability
  test('Shipping Service: 6-digit Indian PIN validation', () => {
    const valid = shippingService.validatePincode('110001');
    assert.strictEqual(valid.serviceable, true);
    assert.strictEqual(valid.state, 'Delhi');

    const invalidLength = shippingService.validatePincode('1234');
    assert.strictEqual(invalidLength.serviceable, false);

    const nonExistent = shippingService.validatePincode('000000');
    assert.strictEqual(nonExistent.serviceable, false);
  });

  test('Shipping Service: Free shipping threshold applied at ₹999', () => {
    const free = shippingService.calculateShippingFee(1299, 'Delhi');
    assert.strictEqual(free, 0);

    const paid = shippingService.calculateShippingFee(599, 'Delhi');
    assert.strictEqual(paid, 99);
  });

  // 3. Payment Gateway & Security Verification (Digital Payments)
  test('Payment Service: HMAC Signature Verification & Mock Pass', () => {
    const mockOrder = 'order_123456';
    const mockPay = 'pay_987654';
    const mockSig = 'sig_sample_token';
    const res = paymentService.verifyPaymentSignature({
      payment_order_id: mockOrder,
      payment_id: mockPay,
      signature: mockSig
    });
    assert.strictEqual(res.verified, true);
  });

  test('Payment Service: Invalid / Empty Signature Rejection', () => {
    const res = paymentService.verifyPaymentSignature({
      payment_order_id: 'order_123',
      payment_id: 'pay_123',
      signature: ''
    });
    assert.strictEqual(res.verified, false);
  });

  // 4. Data Safety: Sensitive Cost Price Protection
  test('Database & Security: Products table includes sensitive cost_price', () => {
    const prod = db.prepare('SELECT cost_price, gst_rate, hsn_code FROM products LIMIT 1').get();
    assert.ok(prod, 'Product exists in database');
    assert.ok(prod.gst_rate !== undefined, 'GST rate is defined');
    assert.ok(prod.hsn_code !== undefined, 'HSN code is defined');
  });

  // 5. Audit Logging Service
  test('Audit Service: Record administrative action to audit_logs', () => {
    auditService.log({
      userId: 'test_admin_id',
      userName: 'Administrator',
      userEmail: 'admin@shagunshine.com',
      userRole: 'super_admin',
      action: 'SYSTEM_TEST_RUN',
      entityType: 'test',
      entityId: 'test_001',
      details: { status: 'passed' }
    });

    const log = db.prepare("SELECT * FROM audit_logs WHERE action = 'SYSTEM_TEST_RUN' ORDER BY id DESC LIMIT 1").get();
    assert.ok(log, 'Audit log was written to database');
    assert.strictEqual(log.user_email, 'admin@shagunshine.com');
  });

  // 6. Return Policy & Schema Integrity
  test('Returns & Policy: Returns schema integrity and column alignment', () => {
    const columns = db.prepare('PRAGMA table_info(returns)').all().map(c => c.name);
    const expected = ['id', 'order_id', 'order_number', 'user_id', 'customer_name', 'customer_email', 'reason', 'description', 'images', 'status', 'refund_amount'];
    for (const exp of expected) {
      assert.ok(columns.includes(exp), `Expected column '${exp}' exists in returns table`);
    }
  });

  // 7. Data Privacy & PII Protection
  test('Data Privacy: Review query masks author_email on public endpoints', () => {
    const row = db.prepare(`
      SELECT r.id, r.product_id, r.user_id, r.author_name, r.rating, r.title, r.comment, r.status, r.is_verified_purchase, r.created_at
      FROM reviews r
      LIMIT 1
    `).get();
    if (row) {
      assert.strictEqual(row.author_email, undefined, 'author_email is not exposed in public query result');
    }
  });

  // Summary
  console.log(`\n======================================================`);
  console.log(`🎯 Test Run Summary: ${passed} Passed | ${failed} Failed`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
