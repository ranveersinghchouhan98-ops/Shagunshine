require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Initialize database & seed
const db = require('./config/db');
require('./config/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://shagunshine.com',
  'https://www.shagunshine.com'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev mode
    }
  },
  credentials: true
}));

// Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use(generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many authentication attempts, please try again in 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static folder for uploaded product images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SEO: robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: http://localhost:5000/sitemap.xml\n`);
});

// SEO: Dynamic sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  try {
    const products = db.prepare("SELECT slug, updated_at FROM products WHERE status = 'active'").all();
    const categories = db.prepare("SELECT slug FROM categories").all();

    const baseUrl = 'http://localhost:5173';
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static storefront pages
    ['', '/shop', '/about', '/contact', '/track-order', '/privacy-policy', '/terms', '/shipping-policy', '/return-refund-policy'].forEach(p => {
      xml += `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Categories
    categories.forEach(c => {
      xml += `  <url>\n    <loc>${baseUrl}/shop?category=${c.slug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Products
    products.forEach(p => {
      xml += `  <url>\n    <loc>${baseUrl}/product/${p.slug}</loc>\n    <lastmod>${(p.updated_at || new Date().toISOString()).split('T')[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;
    res.type('application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/returns', require('./routes/returnRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin-users', require('./routes/adminUserRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/audit-logs', require('./routes/auditRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Shagun Shine Cosmetics API',
    timestamp: new Date().toISOString(),
    node_env: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('✨ Shagun Shine Cosmetics API Server is running smoothly.');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✨ Shagun Shine Cosmetics Backend Server`);
  console.log(`🚀 API Running on: http://localhost:${PORT}`);
  console.log(`👑 Super Admin Email: shagunshine887@gmail.com / @ShagunShinecosmetics887`);
  console.log(`🛍️ Storefront: http://localhost:5173`);
  console.log(`======================================================\n`);
});
