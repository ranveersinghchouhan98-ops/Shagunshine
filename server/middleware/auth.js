const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'shagun_shine_luxury_secret_key_2026_@!';

// Role to permissions mapping
const ROLE_PERMISSIONS = {
  admin: ['*'],
  super_admin: ['*'],
  product_manager: [
    'manage_products',
    'view_products',
    'manage_categories',
    'manage_inventory',
    'moderate_reviews',
    'view_reports'
  ],
  order_manager: [
    'manage_orders',
    'view_orders',
    'manage_returns',
    'view_customers',
    'view_reports'
  ],
  inventory_manager: [
    'manage_inventory',
    'view_products',
    'view_inventory_logs'
  ],
  customer_support: [
    'view_orders',
    'view_customers',
    'manage_returns',
    'moderate_reviews'
  ],
  marketing_manager: [
    'manage_coupons',
    'manage_banners',
    'moderate_reviews',
    'view_reports'
  ],
  reports_viewer: [
    'view_reports'
  ],
  customer: []
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Fetch fresh user from DB
    const user = db.prepare('SELECT id, name, email, phone, role, is_blocked FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or account deleted.' });
    }
    if (user.is_blocked) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by administration.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

// Optional token middleware for public storefront endpoints
const optionalToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db.prepare('SELECT id, name, email, phone, role, is_blocked FROM users WHERE id = ?').get(decoded.id);
      if (user && !user.is_blocked) {
        req.user = user;
      }
    } catch (e) {
      // Proceed without user
    }
  }
  next();
};

// Role-based authorization middleware
const hasRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    // Super admin has access to everything
    if (req.user.role === 'admin' || req.user.role === 'super_admin') {
      return next();
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
    });
  };
};

// Permission-based authorization middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const role = req.user.role;
    const permissions = ROLE_PERMISSIONS[role] || [];

    if (permissions.includes('*') || permissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Missing required permission: '${permission}' for role '${role}'`
    });
  };
};

const isAdmin = hasRole(['admin', 'super_admin']);
const isStaff = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  if (req.user.role !== 'customer') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Staff access required.' });
};

module.exports = {
  verifyToken,
  optionalToken,
  hasRole,
  requirePermission,
  isAdmin,
  isStaff,
  ROLE_PERMISSIONS,
  JWT_SECRET
};
