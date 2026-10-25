const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'data', 'shagun_shine.db');

// Ensure data folder exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db;
try {
  // Primary: Built-in SQLite in Node 22+ (Zero native compilation / zero Python dependencies)
  const { DatabaseSync } = require('node:sqlite');
  db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  db.pragma = (str) => {
    try { db.exec(`PRAGMA ${str};`); } catch (e) {}
  };
  db.transaction = function(fn) {
    return function(...args) {
      db.exec('BEGIN IMMEDIATE TRANSACTION');
      try {
        const result = fn(...args);
        db.exec('COMMIT');
        return result;
      } catch (error) {
        try { db.exec('ROLLBACK'); } catch (e) {}
        throw error;
      }
    };
  };
} catch (err) {
  try {
    const Database = require('better-sqlite3');
    db = new Database(dbPath, { verbose: null });
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('busy_timeout = 5000');
  } catch (fallbackErr) {
    console.error('Failed to initialize SQLite:', fallbackErr);
    throw fallbackErr;
  }
}

function initDatabase() {
  db.exec(`
    -- 1. Users Table (Customers, Staff Roles: super_admin, product_manager, order_manager, inventory_manager, customer_support, marketing_manager, reports_viewer)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'customer',
      avatar TEXT,
      is_blocked INTEGER DEFAULT 0,
      failed_login_attempts INTEGER DEFAULT 0,
      locked_until DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Customer Addresses Table
    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      country TEXT DEFAULT 'India',
      is_default INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 3. Categories Table
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image TEXT,
      subcategories TEXT, -- JSON array of string subcategories
      is_active INTEGER DEFAULT 1,
      is_demo INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. Products Table (Complete Indian Cosmetic Compliance & Sensitive Cost Separation)
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sku TEXT UNIQUE NOT NULL,
      barcode TEXT,
      category_id TEXT NOT NULL,
      subcategory TEXT,
      product_type TEXT DEFAULT 'Cosmetics',
      mrp REAL NOT NULL,
      price REAL NOT NULL,
      discount_price REAL,
      cost_price REAL, -- Sensitive: Never exposed to storefront/customers
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      low_stock_threshold INTEGER DEFAULT 10,
      description TEXT NOT NULL,
      short_description TEXT,
      ingredients TEXT,
      key_ingredients TEXT,
      how_to_use TEXT,
      skin_type TEXT DEFAULT 'All Skin Types',
      hair_type TEXT,
      fragrance_notes TEXT,
      net_quantity TEXT DEFAULT '50ml',
      unit TEXT DEFAULT 'ml',
      manufacturer TEXT DEFAULT 'Shagun Shine Cosmetics Labs, Mumbai',
      marketer TEXT DEFAULT 'Shagun Shine Cosmetics Pvt. Ltd.',
      country_of_origin TEXT DEFAULT 'India',
      batch_number TEXT,
      mfg_date DATE,
      exp_date DATE,
      warnings TEXT DEFAULT 'For external use only. Patch test recommended.',
      storage_instructions TEXT DEFAULT 'Store in a cool, dry place away from direct sunlight.',
      gst_rate REAL DEFAULT 18.0, -- Standard 18% GST on beauty & personal care in India
      hsn_code TEXT DEFAULT '33049990', -- Cosmetics HSN Code
      benefits TEXT, -- JSON array
      shades TEXT, -- JSON array of {name, hex}
      images TEXT NOT NULL, -- JSON array of image URLs
      thumbnail TEXT,
      status TEXT DEFAULT 'active', -- 'active', 'inactive', 'out_of_stock'
      is_featured INTEGER DEFAULT 0,
      is_best_seller INTEGER DEFAULT 0,
      is_new_arrival INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      is_demo INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );

    -- 5. Product Variants Table (Reusable Size / Shade / Volume variations)
    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      shade_name TEXT,
      shade_hex TEXT,
      size_net_qty TEXT,
      mrp REAL,
      price REAL NOT NULL,
      cost_price REAL,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- 6. Inventory Transactions Log (Atomic audit trail for every single stock change)
    CREATE TABLE IF NOT EXISTS inventory_logs (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      variant_id TEXT,
      order_id TEXT,
      change_qty INTEGER NOT NULL,
      balance_qty INTEGER NOT NULL,
      reason TEXT NOT NULL, -- 'order_placed', 'order_cancelled', 'manual_restock', 'return_received', 'adjustment'
      notes TEXT,
      performed_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- 7. Coupons Table (Server-side validated with per-user limits and category scoping)
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL, -- 'percentage', 'flat'
      discount_value REAL NOT NULL,
      min_spend REAL DEFAULT 0,
      max_discount REAL,
      usage_limit INTEGER DEFAULT 1000,
      per_user_limit INTEGER DEFAULT 1,
      times_used INTEGER DEFAULT 0,
      applicable_category_id TEXT,
      is_first_order_only INTEGER DEFAULT 0,
      start_date DATE,
      expiry_date DATE NOT NULL,
      is_active INTEGER DEFAULT 1,
      is_demo INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Coupon Usages by User tracking
    CREATE TABLE IF NOT EXISTS coupon_usages (
      id TEXT PRIMARY KEY,
      coupon_id TEXT NOT NULL,
      user_id TEXT,
      order_id TEXT NOT NULL,
      discount_amount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
    );

    -- 8. Orders Table (Full Indian GST compliance, Gateway Signatures, Idempotency & Lifecycle)
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      invoice_number TEXT UNIQUE,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL, -- JSON object
      billing_address TEXT, -- JSON object
      customer_gstin TEXT, -- Optional B2B GSTIN
      payment_method TEXT NOT NULL, -- 'COD', 'UPI', 'CARD', 'NETBANKING', 'RAZORPAY'
      payment_status TEXT DEFAULT 'Pending', -- 'Pending', 'Paid', 'Failed', 'Refunded'
      payment_gateway TEXT DEFAULT 'mock', -- 'mock', 'razorpay'
      payment_gateway_order_id TEXT,
      payment_gateway_payment_id TEXT,
      payment_gateway_signature TEXT,
      order_status TEXT DEFAULT 'Placed', -- 'Payment Pending', 'Placed', 'Payment Verified', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Return Requested', 'Return Approved', 'Return Rejected', 'Return Received', 'Refund Initiated', 'Refund Completed'
      subtotal REAL NOT NULL,
      discount_amount REAL DEFAULT 0,
      coupon_code TEXT,
      shipping_fee REAL DEFAULT 0,
      taxable_amount REAL DEFAULT 0,
      gst_rate REAL DEFAULT 18.0,
      cgst_amount REAL DEFAULT 0,
      sgst_amount REAL DEFAULT 0,
      igst_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      tracking_number TEXT,
      carrier TEXT,
      estimated_delivery DATE,
      notes TEXT,
      cancel_reason TEXT,
      cancelled_at DATETIME,
      return_status TEXT, -- 'none', 'requested', 'approved', 'rejected', 'received', 'refunded'
      refund_status TEXT, -- 'none', 'pending', 'processed', 'failed'
      refund_amount REAL DEFAULT 0,
      refund_transaction_id TEXT,
      timeline TEXT, -- JSON array of { status, timestamp, note, actor }
      shiprocket_order_id TEXT,
      shiprocket_shipment_id TEXT,
      shiprocket_awb_code TEXT,
      shiprocket_sync_status TEXT DEFAULT 'pending',
      shiprocket_synced_at DATETIME,
      is_demo INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- 9. Order Items Table
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id TEXT,
      product_name TEXT NOT NULL,
      product_image TEXT,
      sku TEXT,
      hsn_code TEXT DEFAULT '33049990',
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      selected_shade TEXT,
      gst_rate REAL DEFAULT 18.0,
      taxable_amount REAL DEFAULT 0,
      cgst_amount REAL DEFAULT 0,
      sgst_amount REAL DEFAULT 0,
      igst_amount REAL DEFAULT 0,
      total_price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    );

    -- 10. Returns & Refunds Table
    CREATE TABLE IF NOT EXISTS returns (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      order_number TEXT NOT NULL,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      reason TEXT NOT NULL, -- 'Damaged Product', 'Defective Texture/Fragrance', 'Wrong Shade Received', 'Allergic Reaction', 'Other'
      description TEXT NOT NULL,
      images TEXT, -- JSON array of photo URLs
      status TEXT DEFAULT 'requested', -- 'requested', 'approved', 'rejected', 'received', 'refunded'
      admin_notes TEXT,
      refund_amount REAL NOT NULL,
      refund_method TEXT DEFAULT 'original_payment_method',
      refund_transaction_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- 11. Product Reviews Table (Eligibility checked server-side)
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_id TEXT,
      author_name TEXT NOT NULL,
      author_email TEXT,
      rating INTEGER NOT NULL,
      title TEXT,
      comment TEXT NOT NULL,
      images TEXT, -- JSON array of reviewer photos
      status TEXT DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
      is_verified_purchase INTEGER DEFAULT 1,
      is_demo INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- 12. Banners & Homepage CMS Table
    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      tagline TEXT,
      cta_text TEXT DEFAULT 'Shop Now',
      cta_link TEXT DEFAULT '/shop',
      image TEXT NOT NULL,
      badge TEXT,
      banner_type TEXT DEFAULT 'hero',
      position INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      is_demo INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 13. Wishlists Table
    CREATE TABLE IF NOT EXISTS wishlists (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- 14. Admin Audit Logs (Tracks every administrative action with actor, target, timestamp, IP)
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT NOT NULL,
      user_role TEXT NOT NULL,
      action TEXT NOT NULL, -- e.g. 'PRODUCT_CREATED', 'PRICE_CHANGED', 'ORDER_STATUS_UPDATED', 'REFUND_PROCESSED', 'COUPON_CREATED', 'CUSTOMER_BLOCKED'
      entity_type TEXT NOT NULL, -- 'product', 'order', 'return', 'coupon', 'customer', 'staff', 'settings'
      entity_id TEXT,
      details TEXT, -- JSON object diff / description
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 15. Centralized System Settings Table (Store info, GSTIN, Razorpay keys, Shipping thresholds, GA4)
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 16. Password Resets Table
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 17. Newsletter Subscribers Table
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      is_subscribed INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 18. Outgoing Webhooks Subscriptions Table
    CREATE TABLE IF NOT EXISTS webhooks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      events TEXT NOT NULL, -- JSON array of subscribed events
      secret TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      failure_count INTEGER DEFAULT 0,
      last_triggered_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 19. Webhook Delivery & Execution Logs
    CREATE TABLE IF NOT EXISTS webhook_logs (
      id TEXT PRIMARY KEY,
      webhook_id TEXT,
      event TEXT NOT NULL,
      direction TEXT DEFAULT 'outgoing', -- 'incoming', 'outgoing'
      payload TEXT NOT NULL,
      response_status INTEGER,
      response_body TEXT,
      success INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 20. Processed Webhooks Idempotency Log (Prevents duplicate processing)
    CREATE TABLE IF NOT EXISTS processed_webhooks (
      id TEXT PRIMARY KEY, -- event ID or payload HMAC signature
      source TEXT NOT NULL, -- 'gateway', 'system'
      event_type TEXT NOT NULL,
      processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 21. Payment Orders (Tracks gateway order creation & guarantees price/amount integrity)
    CREATE TABLE IF NOT EXISTS payment_orders (
      id TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      currency TEXT DEFAULT 'INR',
      receipt TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Performance Indexes
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
    CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_logs(product_id);
    CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_returns_order ON returns(order_id);
  `);

  // Initialize Default Settings if not present
  initDefaultSettings();
}

function initDefaultSettings() {
  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');

  const defaultSettings = [
    {
      key: 'store_profile',
      value: JSON.stringify({
        storeName: 'SHAGUN SHINE COSMETICS',
        legalName: 'RAJKUMAR SINGH CHOUHAN (Proprietor)',
        ownerName: 'RAJKUMAR SINGH CHOUHAN',
        fatherName: '',
        pan: '',
        gstin: '23BBVPC0623C1Z8',
        udyamRegNo: 'UDYAM-MP-23-0310066',
        labourRegNo: 'INDO260913SE002490',
        supportEmail: 'rajsinghchouhan112@gmail.com',
        supportPhone: '+91 99265 39866',
        businessAddress: '45, Adarsh Maulik Nagar Road, Sukhliya (Near Surabhi Shoe Mart), Indore, Madhya Pradesh - 452003',
        storeCity: 'Indore',
        storeState: 'Madhya Pradesh',
        storeStateCode: '23',
        pincode: '452003',
        bankName: 'UCO BANK',
        bankIfsc: 'UCBA0002388',
        bankAccountNo: '',
        currencySymbol: '₹',
        currencyCode: 'INR'
      })
    },
    {
      key: 'gst_config',
      value: JSON.stringify({
        gstin: '23BBVPC0623C1Z8',
        legalName: 'RAJKUMAR SINGH CHOUHAN',
        tradeName: 'SHAGUN SHINE COSMETICS',
        registeredState: 'Madhya Pradesh',
        stateCode: '23',
        city: 'Indore',
        pincode: '452003',
        address: 'Building No. 45, Adarsh Maulik Nagar Road, Nearby Landmark: Surabhi Shoe Mart, Sukhliya, Indore, Madhya Pradesh - 452003',
        constitution: 'Proprietorship',
        registrationType: 'Regular',
        defaultGSTRate: 18.0,
        defaultHSN: '33049990',
        isGstRegistered: true,
        disclaimer: 'Official GSTIN issued by Goods and Services Tax Network, Government of India.'
      })
    },
    {
      key: 'invoice_config',
      value: JSON.stringify({
        invoicePrefix: 'SS-INV-',
        nextInvoiceNumber: 1001,
        termsNote: 'Goods once sold are covered under Shagun Shine 7-Day Replacement Policy. All disputes subject to Indore, Madhya Pradesh jurisdiction.'
      })
    },
    {
      key: 'payment_config',
      value: JSON.stringify({
        activeGateway: 'razorpay',
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
        razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
        isCodEnabled: false,
        codExtraCharge: 0,
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || ''
      })
    },
    {
      key: 'shipping_config',
      value: JSON.stringify({
        activeProvider: 'manual', // 'manual', 'delhivery', 'shiprocket'
        defaultShippingFee: 0,
        freeShippingThreshold: 0,
        estimatedDaysMetro: '2-3 business days',
        estimatedDaysNonMetro: '4-5 business days',
        serviceablePincodesCount: 26000
      })
    },
    {
      key: 'analytics_config',
      value: JSON.stringify({
        ga4MeasurementId: '', // e.g. G-XXXXXXXXXX
        metaPixelId: '', // e.g. 1234567890
        googleSearchConsoleVerification: ''
      })
    },
    {
      key: 'seo_config',
      value: JSON.stringify({
        defaultTitle: 'Shagun Shine Cosmetics | 24K Gold & Clean Luxury Beauty',
        defaultDescription: 'Discover royal Indian cosmetics infused with pure 24K gold flakes, Kashmiri Saffron, and clean botanical actives. Cruelty-free, vegan-friendly, and dermatologically tested.',
        ogImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=85'
      })
    }
  ];

  defaultSettings.forEach(s => insertSetting.run(s.key, s.value));

  // Run non-destructive column migrations for existing tables
  const alterQueries = [
    "ALTER TABLE products ADD COLUMN mrp REAL",
    "ALTER TABLE users ADD COLUMN total_spent REAL DEFAULT 0",
    "ALTER TABLE users ADD COLUMN total_orders INTEGER DEFAULT 0",
    "ALTER TABLE users ADD COLUMN last_order_date DATETIME",
    "ALTER TABLE inventory_logs ADD COLUMN change_type TEXT",
    "ALTER TABLE inventory_logs ADD COLUMN quantity_change INTEGER",
    "ALTER TABLE inventory_logs ADD COLUMN previous_stock INTEGER",
    "ALTER TABLE inventory_logs ADD COLUMN new_stock INTEGER",
    "ALTER TABLE inventory_logs ADD COLUMN reference_id TEXT",
    "ALTER TABLE inventory_logs ADD COLUMN user_id TEXT"
  ];

  for (const q of alterQueries) {
    try {
      db.exec(q);
    } catch (e) {
      // Column already exists, safe to ignore
    }
  }

  // Backfill mrp where null
  try {
    db.prepare("UPDATE products SET mrp = price WHERE mrp IS NULL").run();
  } catch (e) {}
}

initDatabase();

module.exports = db;
