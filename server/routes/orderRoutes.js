const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyToken, optionalToken, hasRole, requirePermission } = require('../middleware/auth');
const taxService = require('../services/taxService');
const shippingService = require('../services/shippingService');
const paymentService = require('../services/paymentService');
const auditService = require('../services/auditService');
const notificationService = require('../services/notificationService');
const webhookService = require('../services/webhookService');
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');

// Rate limiter for order placement to prevent bot cart-spam & stock exhaustion
const orderPlacementLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many order creation attempts from your network. Please wait a few minutes.' }
});

// Valid status transitions
const ALLOWED_TRANSITIONS = {
  Placed: ['Confirmed', 'Processing', 'Cancelled'],
  Confirmed: ['Processing', 'Shipped', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered', 'Cancelled'],
  Delivered: ['Return_Requested', 'Returned'],
  Return_Requested: ['Returned', 'Delivered'],
  Returned: ['Refunded'],
  Cancelled: [],
  Refunded: []
};

// Format single order with parsed items and address
const formatOrder = (order) => {
  if (!order) return null;
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  const returns = db.prepare('SELECT * FROM returns WHERE order_id = ?').all(order.id);
  return {
    ...order,
    shipping_address: typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address || '{}') : order.shipping_address || {},
    timeline: typeof order.timeline === 'string' ? JSON.parse(order.timeline || '[]') : order.timeline || [],
    items,
    returns
  };
};

// Helper to generate Invoice Number (e.g., INV-2026-00012)
const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const row = db.prepare('SELECT COUNT(*) as count FROM orders WHERE invoice_number IS NOT NULL').get();
  const nextNum = (row ? row.count : 0) + 1;
  return `INV-${year}-${String(nextNum).padStart(5, '0')}`;
};

// @route   GET /api/orders/payment-config
// @desc    Get public gateway configuration
router.get('/payment-config', (req, res) => {
  try {
    const config = paymentService.getPublicConfig();
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/orders/create-payment-order
// @desc    Create online digital payment order
router.post('/create-payment-order', optionalToken, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required.' });
    }

    const orderData = await paymentService.createPaymentOrder({
      amount,
      currency,
      receipt
    });

    // Record payment order to enforce price and amount integrity
    db.prepare(`
      INSERT OR REPLACE INTO payment_orders (id, amount, currency, receipt)
      VALUES (?, ?, ?, ?)
    `).run(orderData.id, orderData.amount, currency, receipt);

    res.json({ success: true, order: orderData, key_id: orderData.key_id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/orders
// @desc    Place a new order with atomic stock deduction & GST computation
router.post('/', orderPlacementLimiter, optionalToken, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      items,
      couponCode,
      notes,
      paymentGatewayOrderId,
      paymentGatewayPaymentId,
      paymentGatewaySignature
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !items.length || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Please provide all customer details, shipping address, and cart items.' });
    }

    // Sanitize customer inputs to prevent Stored XSS in admin invoices and notifications
    const cleanCustomerName = sanitizeHtml(customerName, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanCustomerEmail = sanitizeHtml(customerEmail, { allowedTags: [], allowedAttributes: {} }).trim().toLowerCase();
    const cleanCustomerPhone = sanitizeHtml(customerPhone, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanNotes = notes ? sanitizeHtml(notes, { allowedTags: [], allowedAttributes: {} }).trim() : '';

    // Validate Pincode Serviceability (support postalCode, postal_code, pincode, pin_code)
    const rawPincode = shippingAddress.postal_code || shippingAddress.postalCode || shippingAddress.pincode || shippingAddress.pin_code;
    const pincodeCheck = shippingService.validatePincode(rawPincode);
    if (!pincodeCheck.serviceable) {
      return res.status(400).json({ success: false, message: pincodeCheck.message || 'Pincode is not currently serviceable.' });
    }
    shippingAddress.postal_code = rawPincode;
    shippingAddress.postalCode = rawPincode;

    // Verify stock and compute subtotal
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty <= 0 || qty > 50) {
        return res.status(400).json({ success: false, message: `Invalid quantity for item: ${item.productId}. Must be an integer between 1 and 50.` });
      }
      item.quantity = qty;

      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      if (product.status !== 'active') {
        return res.status(400).json({ success: false, message: `Product "${product.name}" is currently unavailable.` });
      }

      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Only ${product.stock_quantity} units available.` });
      }

      const effectivePrice = product.discount_price || product.price;
      const itemTotal = effectivePrice * item.quantity;
      subtotal += itemTotal;

      const productImages = JSON.parse(product.images || '[]');

      verifiedItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        name: product.name,
        image: productImages[0] || '',
        sku: product.sku,
        price: effectivePrice,
        quantity: item.quantity,
        selectedShade: item.selectedShade || null,
        totalPrice: itemTotal,
        gstRate: product.gst_rate || 18,
        costPrice: product.cost_price || 0
      });
    }

    // Validate coupon
    let discountAmount = 0;
    let validCouponId = null;
    if (couponCode) {
      const coupon = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1').get(couponCode.trim());
      if (coupon) {
        const isExpired = new Date(coupon.expiry_date) < new Date();
        const meetsMinSpend = subtotal >= (coupon.min_spend || 0);

        // Check if user has already redeemed this coupon
        const userAlreadyUsed = req.user
          ? db.prepare('SELECT id FROM coupon_usages WHERE coupon_id = ? AND user_id = ?').get(coupon.id, req.user.id)
          : db.prepare('SELECT cu.id FROM coupon_usages cu JOIN orders o ON cu.order_id = o.id WHERE cu.coupon_id = ? AND LOWER(o.customer_email) = ?').get(coupon.id, cleanCustomerEmail);

        if (userAlreadyUsed) {
          return res.status(400).json({ success: false, message: `Coupon code '${couponCode}' has already been redeemed by your account.` });
        }

        if (!isExpired && meetsMinSpend && coupon.times_used < coupon.usage_limit) {
          if (coupon.discount_type === 'percentage') {
            let disc = (subtotal * coupon.discount_value) / 100;
            if (coupon.max_discount && disc > coupon.max_discount) {
              disc = coupon.max_discount;
            }
            discountAmount = disc;
          } else {
            discountAmount = Math.min(coupon.discount_value, subtotal);
          }
          validCouponId = coupon.id;
        }
      }
    }

    // Shipping calculation
    const shippingFee = shippingService.calculateShippingFee(subtotal - discountAmount, shippingAddress.state);
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    // GST Tax computation
    const taxCalculation = taxService.calculateOrderTax(verifiedItems, shippingAddress.state, discountAmount);

    // Strictly reject Cash on Delivery (COD disabled per business policy)
    if (paymentMethod === 'COD') {
      return res.status(400).json({
        success: false,
        message: 'Cash on Delivery (COD) is not accepted. Please pay securely using UPI, Cards, or NetBanking.'
      });
    }

    // Verify online payment via Digital Payment Gateway
    if (!paymentGatewayOrderId || !paymentGatewayPaymentId || !paymentGatewaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification parameters (Order ID, Payment ID, and Signature) are strictly required for online orders.'
      });
    }

    // Anti-Replay: Prevent payment ID reuse across multiple orders
    const existingPayment = db.prepare('SELECT id FROM orders WHERE payment_gateway_payment_id = ?').get(paymentGatewayPaymentId);
    if (existingPayment) {
      return res.status(400).json({ success: false, message: 'Duplicate payment detected. This transaction has already been processed.' });
    }

    // Cryptographic HMAC Signature Verification
    const verification = paymentService.verifyPaymentSignature({
      payment_order_id: paymentGatewayOrderId,
      payment_id: paymentGatewayPaymentId,
      signature: paymentGatewaySignature
    });

    if (!verification.verified) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid transaction signature.' });
    }

    // Payment Amount Integrity: Verify transaction amount matches order total exactly
    const paymentOrderRecord = db.prepare('SELECT amount FROM payment_orders WHERE id = ?').get(paymentGatewayOrderId);
    if (paymentOrderRecord) {
      const expectedPaise = Math.round(totalAmount * 100);
      if (paymentOrderRecord.amount !== expectedPaise) {
        return res.status(400).json({
          success: false,
          message: 'Payment amount mismatch. The transaction amount does not correspond to the cart order total.'
        });
      }
    }

    const paymentStatus = 'Paid';

    const orderId = 'ord_' + uuidv4().substring(0, 8);
    const orderNumber = 'SS-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    const invoiceNumber = generateInvoiceNumber();
    const trackingNumber = 'SS-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const estDeliveryStr = shippingService.getEstimatedDeliveryDate(shippingAddress.state);

    const initialTimeline = [{
      status: 'Placed',
      timestamp: new Date().toISOString(),
      actor: customerName.trim(),
      note: `Order placed successfully with payment method: ${paymentMethod}`
    }];

    const insertOrderStmt = db.prepare(`
      INSERT INTO orders (
        id, order_number, invoice_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, payment_method, payment_status, order_status,
        subtotal, discount_amount, coupon_code, shipping_fee, total_amount,
        taxable_amount, cgst_amount, sgst_amount, igst_amount,
        payment_gateway_order_id, payment_gateway_payment_id, payment_gateway_signature,
        tracking_number, carrier, estimated_delivery, notes, timeline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItemStmt = db.prepare(`
      INSERT INTO order_items (
        id, order_id, product_id, product_name, product_image, sku, price, quantity, selected_shade, total_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStockStmt = db.prepare(`
      UPDATE products SET
        stock_quantity = MAX(0, stock_quantity - ?),
        status = CASE WHEN stock_quantity - ? <= 0 THEN 'out_of_stock' ELSE status END
      WHERE id = ?
    `);

    const insertInventoryLogStmt = db.prepare(`
      INSERT INTO inventory_logs (
        id, product_id, variant_id, order_id, change_qty, balance_qty, reason, performed_by,
        change_type, quantity_change, previous_stock, new_stock, reference_id, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Execute atomic transaction
    const placeOrderTransaction = db.transaction(() => {
      insertOrderStmt.run(
        orderId,
        orderNumber,
        invoiceNumber,
        req.user ? req.user.id : null,
        cleanCustomerName,
        cleanCustomerEmail,
        cleanCustomerPhone,
        JSON.stringify(shippingAddress),
        paymentMethod,
        paymentStatus,
        'Placed',
        subtotal,
        discountAmount,
        couponCode || null,
        shippingFee,
        totalAmount,
        taxCalculation.taxableAmount,
        taxCalculation.cgstAmount,
        taxCalculation.sgstAmount,
        taxCalculation.igstAmount,
        paymentGatewayOrderId || null,
        paymentGatewayPaymentId || null,
        paymentGatewaySignature || null,
        trackingNumber,
        'Delhivery Express Luxury Fleet',
        estDeliveryStr,
        cleanNotes,
        JSON.stringify(initialTimeline)
      );

      for (const item of verifiedItems) {
        insertItemStmt.run(
          uuidv4(),
          orderId,
          item.productId,
          item.name,
          item.image,
          item.sku,
          item.price,
          item.quantity,
          item.selectedShade,
          item.totalPrice
        );

        // Fetch current product stock atomically within transaction
        const currentProd = db.prepare('SELECT stock_quantity FROM products WHERE id = ?').get(item.productId);
        const prevStock = currentProd ? currentProd.stock_quantity : 0;
        if (prevStock < item.quantity) {
          throw new Error(`Insufficient stock for "${item.name}". Only ${prevStock} units remaining.`);
        }
        const newStock = prevStock - item.quantity;

        updateStockStmt.run(item.quantity, item.quantity, item.productId);

        insertInventoryLogStmt.run(
          uuidv4(),
          item.productId,
          item.variantId || null,
          orderId,
          -item.quantity,
          newStock,
          `Order #${orderNumber} placed`,
          req.user ? req.user.name : 'Online Customer',
          'OUT',
          -item.quantity,
          prevStock,
          newStock,
          orderId,
          req.user ? req.user.id : null
        );
      }

      // Update coupon usage and record in coupon_usages
      if (validCouponId) {
        const freshCoupon = db.prepare('SELECT times_used, usage_limit FROM coupons WHERE id = ?').get(validCouponId);
        if (freshCoupon && freshCoupon.times_used >= freshCoupon.usage_limit) {
          throw new Error('Coupon usage limit was reached by a concurrent transaction.');
        }
        db.prepare('UPDATE coupons SET times_used = times_used + 1 WHERE id = ?').run(validCouponId);
        db.prepare(`
          INSERT INTO coupon_usages (id, coupon_id, user_id, order_id, discount_amount)
          VALUES (?, ?, ?, ?, ?)
        `).run(uuidv4(), validCouponId, req.user ? req.user.id : null, orderId, discountAmount);
      }
    });

    placeOrderTransaction();

    const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const formatted = formatOrder(createdOrder);

    // Send transactional notification
    notificationService.sendOrderConfirmation(formatted, {
      name: customerName,
      email: customerEmail,
      phone: customerPhone
    });

    // Update customer stats (total_spent, total_orders, last_order_date)
    if (req.user && req.user.id) {
      try {
        db.prepare(`
          UPDATE users SET
            total_orders = total_orders + 1,
            total_spent = total_spent + ?,
            last_order_date = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(totalAmount, req.user.id);
      } catch (custErr) {}
    }

    // Trigger Webhook Event: order.created
    webhookService.trigger('order.created', {
      orderId: formatted.id,
      orderNumber: formatted.order_number,
      customerName: formatted.customer_name,
      customerEmail: formatted.customer_email,
      customerPhone: formatted.customer_phone,
      totalAmount: formatted.total_amount,
      paymentMethod: formatted.payment_method,
      paymentStatus: formatted.payment_status,
      items: formatted.items
    });

    res.status(201).json({
      success: true,
      message: 'Your order has been placed successfully! Confirmation email and SMS have been triggered.',
      order: formatted
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error placing order.' });
  }
});

// @route   POST /api/orders/pos-sale
// @desc    Create In-Store Retail POS Sale with GST Invoice & instant stock deduction
router.post('/pos-sale', verifyToken, async (req, res) => {
  try {
    if (req.user && req.user.role === 'customer') {
      return res.status(403).json({ success: false, message: 'POS billing is restricted to authorized store staff.' });
    }

    const {
      customerName = 'Walk-in Retail Customer',
      customerPhone = '',
      customerEmail = '',
      customerState = 'Madhya Pradesh',
      customerCity = 'Indore',
      paymentMethod = 'Cash',
      cashTendered = 0,
      changeReturned = 0,
      items = [],
      discountAmount = 0,
      notes = ''
    } = req.body;

    const cleanCustomerName = sanitizeHtml(customerName, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanCustomerPhone = sanitizeHtml(customerPhone, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanCustomerEmail = sanitizeHtml(customerEmail, { allowedTags: [], allowedAttributes: {} }).trim().toLowerCase();
    const cleanNotes = notes ? sanitizeHtml(notes, { allowedTags: [], allowedAttributes: {} }).trim() : '';

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Billing cart cannot be empty. Please select products.' });
    }

    // Verify items and stock
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ success: false, message: `Invalid quantity for item: ${item.name || item.productId}` });
      }

      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      if (product.stock_quantity < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock_quantity}, requested: ${qty}`
        });
      }

      // Price Integrity: Standard staff cannot arbitrarily zero or manipulate catalog price; only admin/super_admin can apply manual overrides
      let unitPrice = product.discount_price || product.price;
      if (item.price !== undefined && parseFloat(item.price) !== unitPrice) {
        const isAuthorizedManager = req.user && ['admin', 'super_admin'].includes(req.user.role);
        if (isAuthorizedManager) {
          const customPrice = parseFloat(item.price);
          if (!isNaN(customPrice) && customPrice >= 0) {
            unitPrice = customPrice;
          }
        }
      }
      const itemTotal = unitPrice * qty;
      subtotal += itemTotal;

      let productImages = [];
      try {
        productImages = JSON.parse(product.images || '[]');
      } catch (e) {}

      verifiedItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        name: product.name,
        image: productImages[0] || item.image || '',
        sku: product.sku,
        price: unitPrice,
        mrp: product.mrp || product.price,
        quantity: qty,
        selectedShade: item.selectedShade || null,
        totalPrice: itemTotal,
        gstRate: product.gst_rate || 18,
        hsnCode: product.hsn_code || '330499',
        costPrice: product.cost_price || 0
      });
    }

    const appliedDiscount = Math.max(0, Math.min(parseFloat(discountAmount) || 0, subtotal));
    const netTotal = Math.max(0, subtotal - appliedDiscount);

    // GST Tax computation
    const taxCalculation = taxService.calculateOrderTax(verifiedItems, customerState, appliedDiscount);

    const orderId = 'ord_pos_' + uuidv4().substring(0, 8);
    const orderNumber = 'SS-POS-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    const invoiceNumber = generateInvoiceNumber();

    const shippingAddress = {
      addressLine1: 'In-Store Counter / Walk-in Sale',
      city: customerCity || 'Indore',
      state: customerState || 'Madhya Pradesh',
      postalCode: '452001'
    };

    const initialTimeline = [{
      status: 'Delivered',
      timestamp: new Date().toISOString(),
      actor: req.user ? `${req.user.name} (${req.user.role})` : 'Store Staff',
      note: `In-Store POS Sale completed. Payment received via ${paymentMethod}. Invoice #${invoiceNumber}`
    }];

    const insertOrderStmt = db.prepare(`
      INSERT INTO orders (
        id, order_number, invoice_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, payment_method, payment_status, order_status,
        subtotal, discount_amount, coupon_code, shipping_fee, total_amount,
        taxable_amount, cgst_amount, sgst_amount, igst_amount,
        tracking_number, carrier, estimated_delivery, notes, timeline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItemStmt = db.prepare(`
      INSERT INTO order_items (
        id, order_id, product_id, product_name, product_image, sku, price, quantity, selected_shade, total_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStockStmt = db.prepare(`
      UPDATE products SET
        stock_quantity = MAX(0, stock_quantity - ?),
        status = CASE WHEN stock_quantity - ? <= 0 THEN 'out_of_stock' ELSE status END
      WHERE id = ?
    `);

    const insertInventoryLogStmt = db.prepare(`
      INSERT INTO inventory_logs (
        id, product_id, variant_id, order_id, change_qty, balance_qty, reason, performed_by,
        change_type, quantity_change, previous_stock, new_stock, reference_id, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const posTransaction = db.transaction(() => {
      insertOrderStmt.run(
        orderId,
        orderNumber,
        invoiceNumber,
        req.user ? req.user.id : null,
        cleanCustomerName || 'Walk-in Retail Customer',
        cleanCustomerEmail || '',
        cleanCustomerPhone || '',
        JSON.stringify(shippingAddress),
        paymentMethod,
        'Paid',
        'Delivered',
        subtotal,
        appliedDiscount,
        null,
        0,
        netTotal,
        taxCalculation.taxableAmount,
        taxCalculation.cgstAmount,
        taxCalculation.sgstAmount,
        taxCalculation.igstAmount,
        'POS-HANDOVER',
        'In-Store Retail Counter',
        new Date().toISOString(),
        cleanNotes || `In-Store Retail Sale [Cash Tendered: ₹${cashTendered}, Change: ₹${changeReturned}]`,
        JSON.stringify(initialTimeline)
      );

      for (const item of verifiedItems) {
        insertItemStmt.run(
          uuidv4(),
          orderId,
          item.productId,
          item.name,
          item.image,
          item.sku,
          item.price,
          item.quantity,
          item.selectedShade,
          item.totalPrice
        );

        const currentProd = db.prepare('SELECT stock_quantity FROM products WHERE id = ?').get(item.productId);
        const prevStock = currentProd ? currentProd.stock_quantity : 0;
        const newStock = Math.max(0, prevStock - item.quantity);

        updateStockStmt.run(item.quantity, item.quantity, item.productId);

        insertInventoryLogStmt.run(
          uuidv4(),
          item.productId,
          item.variantId || null,
          orderId,
          -item.quantity,
          newStock,
          `In-Store POS Sale #${orderNumber}`,
          req.user ? req.user.name : 'Store Staff',
          'OUT',
          -item.quantity,
          prevStock,
          newStock,
          orderId,
          req.user ? req.user.id : null
        );
      }
    });

    posTransaction();

    const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const formatted = formatOrder(createdOrder);

    // Audit log
    auditService.log({
      userId: req.user ? req.user.id : 'system',
      userEmail: req.user ? req.user.email : 'pos@shagunshine.com',
      userRole: req.user ? req.user.role : 'staff',
      action: 'POS_RETAIL_SALE',
      entityType: 'order',
      entityId: orderId,
      details: { orderNumber, invoiceNumber, totalAmount: netTotal, paymentMethod, itemsCount: verifiedItems.length },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Retail sale completed and GST invoice generated.',
      order: formatted,
      invoice: {
        invoiceNumber,
        orderNumber,
        date: new Date().toISOString(),
        cashier: req.user ? req.user.name : 'Store Cashier',
        paymentMethod,
        cashTendered,
        changeReturned,
        taxDetails: taxCalculation
      }
    });
  } catch (error) {
    console.error('POS Sale error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating POS sale.' });
  }
});

// @route   POST /api/orders/verify-payment
// @desc    Verify payment signature and update order status (Strictly hardened with ownership, anti-replay, and amount checks)
router.post('/verify-payment', optionalToken, (req, res) => {
  try {
    const {
      orderId,
      payment_order_id,
      payment_id,
      signature,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(orderId, orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Ownership check: must be owner, guest, or staff
    const isStaff = req.user && ['admin', 'super_admin', 'order_manager'].includes(req.user.role);
    const isOwner = req.user && order.user_id && req.user.id === order.user_id;
    const isGuest = !order.user_id;
    if (!isStaff && !isOwner && !isGuest) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update payment for this order.' });
    }

    // Idempotent: if order is already Paid, return success
    if (order.payment_status === 'Paid') {
      return res.json({ success: true, message: 'Order is already marked as paid.', order: formatOrder(order) });
    }

    const finalOrderId = payment_order_id || razorpay_order_id;
    const finalPaymentId = payment_id || razorpay_payment_id;
    const finalSignature = signature || razorpay_signature;

    if (!finalOrderId || !finalPaymentId || !finalSignature) {
      return res.status(400).json({ success: false, message: 'Missing payment signature verification parameters.' });
    }

    // Anti-replay check: prevent reuse of transaction ID on multiple orders
    const existingPayment = db.prepare('SELECT id FROM orders WHERE payment_gateway_payment_id = ? AND id != ?').get(finalPaymentId, order.id);
    if (existingPayment) {
      return res.status(400).json({ success: false, message: 'Duplicate payment transaction. This payment has already been credited to another order.' });
    }

    // Cryptographic signature verification
    const verification = paymentService.verifyPaymentSignature({
      payment_order_id: finalOrderId,
      payment_id: finalPaymentId,
      signature: finalSignature
    });

    if (!verification.verified) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }

    // Payment Amount Integrity check
    const paymentOrderRecord = db.prepare('SELECT amount FROM payment_orders WHERE id = ?').get(finalOrderId);
    if (paymentOrderRecord) {
      const expectedPaise = Math.round(order.total_amount * 100);
      if (paymentOrderRecord.amount !== expectedPaise) {
        return res.status(400).json({
          success: false,
          message: 'Payment amount mismatch. The transaction amount does not correspond to this order total.'
        });
      }
    }

    db.prepare(`
      UPDATE orders SET
        payment_status = 'Paid',
        payment_gateway_order_id = ?,
        payment_gateway_payment_id = ?,
        payment_gateway_signature = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(finalOrderId, finalPaymentId, finalSignature, order.id);

    // Trigger payment.success webhook
    webhookService.trigger('payment.success', {
      orderId: order.id,
      orderNumber: order.order_number,
      paymentGatewayOrderId: finalOrderId,
      paymentGatewayPaymentId: finalPaymentId
    });

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id);
    res.json({ success: true, message: 'Payment successfully verified.', order: formatOrder(updated) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/orders/:id/cancel
// @desc    Customer cancel order (allowed if Placed or Confirmed) with stock restoration
router.post('/:id/cancel', optionalToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Customer request' } = req.body;

    const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(id, id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Permission check: owner or staff
    const isStaff = req.user && ['admin', 'super_admin', 'order_manager'].includes(req.user.role);
    const isOwnerUser = req.user && order.user_id && req.user.id === order.user_id;
    const isOwnerEmail = req.user && order.customer_email && req.user.email.toLowerCase() === order.customer_email.toLowerCase();
    const guestMatch = !order.user_id &&
      req.body.customerEmail &&
      req.body.customerPhone &&
      order.customer_email.toLowerCase() === req.body.customerEmail.trim().toLowerCase() &&
      order.customer_phone.replace(/[^0-9]/g, '') === req.body.customerPhone.replace(/[^0-9]/g, '');

    if (!isStaff && !isOwnerUser && !isOwnerEmail && !guestMatch) {
      return res.status(403).json({ success: false, message: 'Unauthorized. Verification with matching email and phone required to cancel this order.' });
    }

    if (!['Placed', 'Confirmed'].includes(order.order_status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in status '${order.order_status}'. Please contact customer support.`
      });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

    // Process refund if online paid
    let refundResult = null;
    let paymentStatus = order.payment_status;
    if (order.payment_status === 'Paid' && order.payment_gateway_payment_id) {
      refundResult = await paymentService.processRefund({
        paymentId: order.payment_gateway_payment_id,
        amount: order.total_amount,
        reason
      });
      paymentStatus = 'Refunded';
    }

    const timeline = typeof order.timeline === 'string' ? JSON.parse(order.timeline || '[]') : order.timeline || [];
    timeline.push({
      status: 'Cancelled',
      timestamp: new Date().toISOString(),
      actor: req.user ? req.user.name : order.customer_name,
      note: `Cancelled: ${reason}`
    });

    const cancelTransaction = db.transaction(() => {
      // Update order
      db.prepare(`
        UPDATE orders SET
          order_status = 'Cancelled',
          payment_status = ?,
          cancel_reason = ?,
          cancelled_at = datetime('now'),
          timeline = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(paymentStatus, reason, JSON.stringify(timeline), order.id);

      // Restore inventory
      for (const item of items) {
        const prod = db.prepare('SELECT stock_quantity FROM products WHERE id = ?').get(item.product_id);
        const prevStock = prod ? prod.stock_quantity : 0;
        const newStock = prevStock + item.quantity;

        db.prepare(`
          UPDATE products SET
            stock_quantity = stock_quantity + ?,
            status = 'active'
          WHERE id = ?
        `).run(item.quantity, item.product_id);

        db.prepare(`
          INSERT INTO inventory_logs (
            id, product_id, variant_id, order_id, change_qty, balance_qty, reason, performed_by,
            change_type, quantity_change, previous_stock, new_stock, reference_id, user_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          uuidv4(),
          item.product_id,
          null,
          order.id,
          item.quantity,
          newStock,
          `Restored from cancelled Order #${order.order_number}`,
          req.user ? req.user.name : order.customer_name,
          'IN',
          item.quantity,
          prevStock,
          newStock,
          order.id,
          req.user ? req.user.id : null
        );
      }
    });

    cancelTransaction();

    notificationService.sendOrderCancelled(order, refundResult ? { amount: order.total_amount } : {});

    // Trigger order.cancelled webhook
    webhookService.trigger('order.cancelled', {
      orderId: order.id,
      orderNumber: order.order_number,
      reason,
      refund: refundResult
    });

    res.json({
      success: true,
      message: `Order #${order.order_number} has been cancelled and items returned to stock.`,
      refund: refundResult
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get order history for logged in customer
router.get('/my-orders', verifyToken, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders
      WHERE user_id = ? OR customer_email = ?
      ORDER BY created_at DESC
    `).all(req.user.id, req.user.email);

    res.json({
      success: true,
      orders: orders.map(formatOrder)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching orders.' });
  }
});

// @route   GET /api/orders/track/:query
// @desc    Track order by Order Number or Tracking Number (Public access - PII masked)
router.get('/track/:query', (req, res) => {
  try {
    const { query } = req.params;
    const order = db.prepare(`
      SELECT * FROM orders
      WHERE UPPER(order_number) = UPPER(?) OR UPPER(tracking_number) = UPPER(?) OR id = ?
    `).get(query.trim(), query.trim(), query.trim());

    if (!order) {
      return res.status(404).json({ success: false, message: 'No shipment found with this order or tracking number.' });
    }

    let parsedAddr = {};
    try {
      parsedAddr = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address || {};
    } catch (e) {}

    let timeline = [];
    try {
      timeline = typeof order.timeline === 'string' ? JSON.parse(order.timeline) : order.timeline || [];
    } catch (e) {}

    const maskName = (name) => {
      if (!name) return 'Customer';
      return name.split(' ').map(p => p.length > 1 ? p[0] + '*'.repeat(p.length - 1) : p).join(' ');
    };

    const trackingSummary = {
      order_number: order.order_number,
      order_status: order.order_status,
      carrier: order.carrier,
      tracking_number: order.tracking_number,
      estimated_delivery: order.estimated_delivery,
      timeline,
      created_at: order.created_at,
      recipient: maskName(order.customer_name),
      destination_city: parsedAddr.city || '',
      destination_state: parsedAddr.state || ''
    };

    res.json({
      success: true,
      order: trackingSummary
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error tracking order.' });
  }
});

// @route   GET /api/orders (Admin & Staff with permission)
router.get('/', verifyToken, requirePermission('view_orders'), (req, res) => {
  try {
    const { status, paymentMethod, search, limit = 50, page = 1 } = req.query;

    let query = `SELECT * FROM orders WHERE 1=1`;
    const params = [];

    if (status && status !== 'All') {
      query += ` AND order_status = ?`;
      params.push(status);
    }

    if (paymentMethod && paymentMethod !== 'All') {
      query += ` AND payment_method = ?`;
      params.push(paymentMethod);
    }

    if (search) {
      query += ` AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ? OR tracking_number LIKE ? OR invoice_number LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term, term, term);
    }

    query += ` ORDER BY created_at DESC`;

    const offset = (Number(page) - 1) * Number(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const orders = db.prepare(query).all(...params);

    const countQuery = `SELECT COUNT(*) as total FROM orders WHERE 1=1`;
    const totalCount = db.prepare(countQuery).get().total;

    res.json({
      success: true,
      orders: orders.map(formatOrder),
      total: totalCount,
      page: Number(page)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching orders.' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order details (Protected: Owner, matching email, or Admin/Staff)
router.get('/:id', optionalToken, (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(req.params.id, req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const isStaff = req.user && ['admin', 'super_admin', 'order_manager'].includes(req.user.role);
    const isOwnerUser = req.user && order.user_id && req.user.id === order.user_id;
    const isOwnerEmail = req.user && req.user.email && order.customer_email && req.user.email.toLowerCase() === order.customer_email.toLowerCase();
    const isGuestOrder = !order.user_id;
    const guestEmailMatch = isGuestOrder && req.query.email && order.customer_email && order.customer_email.toLowerCase() === req.query.email.trim().toLowerCase();

    if (!isStaff && !isOwnerUser && !isOwnerEmail && !guestEmailMatch) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not have permission to view this order.' });
    }

    res.json({ success: true, order: formatOrder(order) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching order.' });
  }
});

// @route   PUT /api/orders/:id/status (Admin / Order Manager)
// @desc    Update order status, tracking, and carrier with state-machine verification
router.put('/:id/status', verifyToken, requirePermission('manage_orders'), (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status, tracking_number, carrier, estimated_delivery, admin_note } = req.body;

    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Validate state transition if status changed
    if (order_status && order_status !== existing.order_status) {
      const allowed = ALLOWED_TRANSITIONS[existing.order_status] || [];
      if (!allowed.includes(order_status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from '${existing.order_status}' to '${order_status}'. Allowed: [${allowed.join(', ')}]`
        });
      }
    }

    const timeline = typeof existing.timeline === 'string' ? JSON.parse(existing.timeline || '[]') : existing.timeline || [];
    if (order_status && order_status !== existing.order_status) {
      timeline.push({
        status: order_status,
        timestamp: new Date().toISOString(),
        actor: `${req.user.name} (${req.user.role})`,
        note: admin_note || `Status updated to ${order_status}`
      });
    }

    // Timestamps
    let shippedAt = existing.shipped_at;
    let deliveredAt = existing.delivered_at;
    let cancelledAt = existing.cancelled_at;

    if (order_status === 'Shipped' && !shippedAt) shippedAt = new Date().toISOString();
    if (order_status === 'Delivered' && !deliveredAt) deliveredAt = new Date().toISOString();
    if (order_status === 'Cancelled' && !cancelledAt) cancelledAt = new Date().toISOString();

    db.prepare(`
      UPDATE orders SET
        order_status = COALESCE(?, order_status),
        payment_status = COALESCE(?, payment_status),
        tracking_number = COALESCE(?, tracking_number),
        carrier = COALESCE(?, carrier),
        estimated_delivery = COALESCE(?, estimated_delivery),
        shipped_at = COALESCE(?, shipped_at),
        delivered_at = COALESCE(?, delivered_at),
        cancelled_at = COALESCE(?, cancelled_at),
        timeline = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      order_status,
      payment_status,
      tracking_number,
      carrier,
      estimated_delivery,
      shippedAt,
      deliveredAt,
      cancelledAt,
      JSON.stringify(timeline),
      id
    );

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    const formatted = formatOrder(updated);

    // Audit log
    auditService.log({
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'order',
      entityId: id,
      details: { previousStatus: existing.order_status, newStatus: order_status, payment_status, tracking_number },
      ipAddress: req.ip
    });

    // Transactional notification
    if (order_status === 'Shipped') {
      notificationService.sendOrderShipped(formatted, { email: formatted.customer_email, name: formatted.customer_name }, {
        courier: carrier || formatted.carrier,
        tracking_number: tracking_number || formatted.tracking_number
      });
    }

    // Trigger order.updated webhook
    webhookService.trigger('order.updated', {
      orderId: updated.id,
      orderNumber: updated.order_number,
      orderStatus: updated.order_status,
      paymentStatus: updated.payment_status,
      trackingNumber: updated.tracking_number
    });

    res.json({
      success: true,
      message: `Order #${updated.order_number} status updated to ${updated.order_status}.`,
      order: formatted
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Server error updating order.' });
  }
});

module.exports = router;
