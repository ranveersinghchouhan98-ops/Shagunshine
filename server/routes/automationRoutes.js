const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, hasRole } = require('../middleware/auth');

/**
 * AI & Marketing Automation Ready Endpoints
 * Provides clean, structured feeds and analytics payloads for:
 * 1. AI Content & Reel generation (Product catalog, key ingredients, USPs, benefits, tone)
 * 2. Sales Intelligence & Segment analysis (Best sellers, velocity, stock alerts)
 * 3. Customer Segments for automated WhatsApp / SMS marketing
 */

// @route   GET /api/automation/ai/products-feed
// @desc    Optimized product feed for AI Reel ideas, video scripts, ad copy, captions, hashtags
router.get('/ai/products-feed', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const products = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
      ORDER BY p.is_best_seller DESC, p.created_at DESC
    `).all();

    const aiReadyItems = products.map(p => {
      let benefits = [];
      let shades = [];
      try { benefits = JSON.parse(p.benefits || '[]'); } catch (e) {}
      try { shades = JSON.parse(p.shades || '[]'); } catch (e) {}

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category_name,
        price_inr: p.price,
        discount_price_inr: p.discount_price,
        stock_available: p.stock_quantity,
        target_skin_type: p.skin_type,
        key_usps: benefits,
        short_pitch: p.short_description,
        ingredients: p.ingredients,
        usage_instructions: p.how_to_use,
        available_shades: shades.map(s => s.name),
        suggested_reel_hooks: [
          `Discover why everyone is obsessed with ${p.name}! ✨`,
          `Stop scrolling if you want radiant luxury skin with pure 24K gold! 🌟`,
          `The secret behind effortless festive glow: ${p.name}.`
        ],
        hashtags: [
          '#ShagunShine',
          '#LuxuryCosmetics',
          '#CleanBeautyIndia',
          '#GoldInfusedSkincare',
          `#${p.name.replace(/[^a-zA-Z0-9]/g, '')}`
        ]
      };
    });

    res.json({
      success: true,
      brand: 'Shagun Shine Cosmetics',
      brand_tone: 'Royal Luxury, High Pigment, Clean Botanical Actives, 24K Gold Elegance',
      total_products: aiReadyItems.length,
      products: aiReadyItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/automation/ai/sales-intelligence
// @desc    Sales analytics and stock velocity for AI automated decision making & restock recommendations
router.get('/ai/sales-intelligence', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    // 1. Top Selling Products
    const topSellers = db.prepare(`
      SELECT 
        oi.product_id,
        oi.sku,
        oi.product_name,
        SUM(oi.quantity) as total_units_sold,
        SUM(oi.total_price) as total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.order_status NOT IN ('Cancelled', 'Payment Pending')
      GROUP BY oi.product_id
      ORDER BY total_units_sold DESC
      LIMIT 10
    `).all();

    // 2. Low Stock Alerts (< 15 units)
    const lowStockAlerts = db.prepare(`
      SELECT id, sku, name, stock_quantity, price
      FROM products
      WHERE stock_quantity <= 15 AND status = 'active'
      ORDER BY stock_quantity ASC
    `).all();

    // 3. Customer Segments (VIP, Regular, At-Risk, New)
    const customerSegments = db.prepare(`
      SELECT 
        id, name, email, phone, total_orders, total_spent, last_order_date,
        CASE 
          WHEN total_spent >= 10000 THEN 'VIP_High_Value'
          WHEN total_orders >= 3 THEN 'Repeat_Loyal'
          WHEN total_orders = 1 THEN 'First_Time_Buyer'
          ELSE 'Lead_Browser'
        END as customer_tier
      FROM users
      WHERE role = 'customer'
      ORDER BY total_spent DESC
      LIMIT 100
    `).all();

    // 4. Recent Sales Velocity
    const recentOrdersCount = db.prepare(`
      SELECT COUNT(*) as recent_count, COALESCE(SUM(total_amount), 0) as recent_volume
      FROM orders
      WHERE created_at >= date('now', '-30 days')
      AND order_status NOT IN ('Cancelled')
    `).get();

    res.json({
      success: true,
      analysis_date: new Date().toISOString(),
      summary: {
        last_30_days_orders: recentOrdersCount.recent_count,
        last_30_days_revenue: recentOrdersCount.recent_volume,
        low_stock_count: lowStockAlerts.length
      },
      top_selling_products: topSellers,
      low_stock_urgent_restock: lowStockAlerts,
      customer_segments: customerSegments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/automation/marketing/segments
// @desc    Extract filtered contact lists for WhatsApp / SMS campaign triggers
router.get('/marketing/segments', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const { segment } = req.query; // 'vip', 'abandoned_cart', 'inactive', 'all'
    let query = `
      SELECT id, name, email, phone, total_orders, total_spent, last_order_date
      FROM users
      WHERE role = 'customer' AND phone IS NOT NULL AND phone != ''
    `;

    if (segment === 'vip') {
      query += ` AND total_spent >= 5000`;
    } else if (segment === 'inactive') {
      query += ` AND last_order_date <= date('now', '-60 days')`;
    }

    query += ` ORDER BY total_spent DESC`;

    const customers = db.prepare(query).all();

    res.json({
      success: true,
      segment: segment || 'all',
      total_recipients: customers.length,
      recipients: customers.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        total_orders: c.total_orders,
        total_spent: c.total_spent,
        last_order_date: c.last_order_date
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/automation/marketing/export-contacts-csv
// @desc    Export customer segmentation CSV ready for marketing broadcasts
router.get('/marketing/export-contacts-csv', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const { segment } = req.query;
    let query = `
      SELECT name, phone, email, total_orders, total_spent, last_order_date
      FROM users
      WHERE role = 'customer' AND phone IS NOT NULL AND phone != ''
    `;

    if (segment === 'vip') {
      query += ` AND total_spent >= 5000`;
    } else if (segment === 'inactive') {
      query += ` AND last_order_date <= date('now', '-60 days')`;
    }

    query += ` ORDER BY total_spent DESC`;

    const customers = db.prepare(query).all();

    const safeCsvCell = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/"/g, '""');
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str}"`;
    };

    const headers = ['Name', 'Phone', 'Email', 'Total_Orders', 'Total_Spent_INR', 'Last_Order_Date', 'Suggested_Segment'];
    const rows = customers.map(c => {
      const seg = c.total_spent >= 5000 ? 'VIP' : (c.total_orders > 1 ? 'Repeat Buyer' : 'New Customer');
      return [
        safeCsvCell(c.name || ''),
        safeCsvCell(c.phone || ''),
        safeCsvCell(c.email || ''),
        Number(c.total_orders || 0),
        Number(c.total_spent || 0),
        safeCsvCell(c.last_order_date || ''),
        safeCsvCell(seg)
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=marketing_contacts_${segment || 'all'}_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
