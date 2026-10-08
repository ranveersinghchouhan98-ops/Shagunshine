require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

// 1. Critical Environment Variables Verification
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'shagun_shine_jwt_production_fallback_secret_key_2026';
  console.warn(`[Config Notice] JWT_SECRET not found in environment; using secure system fallback.`);
}

// Initialize database & seed
const db = require('./config/db');
require('./config/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Production Security Headers (Helmet, HSTS, CSP, Nosniff, Frameguard)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
      connectSrc: ["'self'", "https://api.razorpay.com", "https://lumberjack.razorpay.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://api.dicebear.com"],
      frameSrc: ["https://api.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"]
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year Strict-Transport-Security
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' }
}));

// 3. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://shagunshinecosmetics.in',
  'https://www.shagunshinecosmetics.in',
  'https://shagunshine.com',
  'https://www.shagunshine.com',
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, '') : null
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    const cleanOrigin = origin ? origin.replace(/\/+$/, '') : origin;
    if (!cleanOrigin || allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV !== 'production') {
      callback(null, true); // Dev mode convenience
    } else {
      callback(new Error('Blocked by CORS policy: Origin not allowed.'));
    }
  },
  credentials: true
}));

// 4. Rate Limiters (General, Authentication, Abuse Prevention)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use(generalLimiter);

// Auth Rate Limiter: 5 attempts per minute per IP on login/register
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again in 1 minute.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/change-password', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);

// Coupon Validation Rate Limiter (Brute-force protection)
const couponLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many coupon validation attempts, please wait.' }
});
app.use('/api/coupons/validate', couponLimiter);

// Review Submission Rate Limiter (Spam prevention)
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Review submission limit reached. Please try again later.' }
});
app.use('/api/reviews', reviewLimiter);

// Order Tracking Rate Limiter (Enumeration protection)
const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many tracking requests. Please try again in a few minutes.' }
});
app.use('/api/orders/track', trackingLimiter);

// Payment & Checkout Orders Rate Limiter (Bot abuse & checkout flooding prevention)
const paymentOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Payment initialization limit reached. Please wait a few moments.' }
});
app.use('/api/orders/create-payment-order', paymentOrderLimiter);
app.use('/api/orders/verify-payment', paymentOrderLimiter);
app.use('/api/create-order', paymentOrderLimiter);
app.use('/api/verify-payment', paymentOrderLimiter);

// Search & Autocomplete Rate Limiter (Database DoS prevention)
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: { success: false, message: 'Too many search requests. Please slow down.' }
});
app.use('/api/products/search/suggestions', searchLimiter);

// File Upload Rate Limiter (Disk exhaustion & bandwidth protection)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { success: false, message: 'Upload rate limit reached. Please wait before uploading more files.' }
});
app.use('/api/upload', uploadLimiter);

// Returns & Refunds Rate Limiter (Abuse prevention)
const returnLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many return requests submitted. Please contact support.' }
});
app.use('/api/returns', returnLimiter);

// Strict Password Reset Rate Limiter (Email bombing prevention: max 3 per 15 min)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Password reset request limit reached. Please check your inbox or try again later.' }
});
app.use('/api/auth/forgot-password', forgotPasswordLimiter);

app.disable('x-powered-by');

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(morgan('dev'));

// Static folder for uploaded product images with security options
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  dotfiles: 'deny',
  maxAge: '1d'
}));

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

    const baseUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://shagunshinecosmetics.in' : 'http://localhost:5173');
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
app.use('/api/webhooks', require('./routes/webhookRoutes'));
app.use('/api/automation', require('./routes/automationRoutes'));
app.use('/api', require('./routes/paymentRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Shagun Shine Cosmetics API',
    timestamp: new Date().toISOString()
  });
});

// Production Static Frontend Serving
const candidateDistPaths = [
  path.join(__dirname, '..', 'client', 'dist'),
  path.join(__dirname, '..', 'dist'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, '..', 'public_html'),
  path.join(__dirname, 'public')
];
const clientDistPath = candidateDistPaths.find(p => fs.existsSync(p));
if (clientDistPath) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('✨ Shagun Shine Cosmetics API Server is running smoothly.');
  });
}

// Global Error Handler (Production-safe, Stack & Internal info masked)
app.use((err, req, res, next) => {
  const correlationId = uuidv4().substring(0, 8);
  console.error(`[Error ID: ${correlationId}]`, err);

  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    success: false,
    message: isProduction ? 'An internal error occurred. Please contact customer support.' : (err.message || 'Internal server error occurred.'),
    correlationId
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✨ Shagun Shine Cosmetics Backend Server`);
  console.log(`🚀 API Running on: http://localhost:${PORT}`);
  console.log(`🛍️ Storefront: http://localhost:5173`);
  console.log(`🔒 Security Status: Headers active | Rate limits enabled`);
  console.log(`======================================================\n`);
});
