const express = require('express');
const router = express.Router();
const { verifyToken, hasRole } = require('../middleware/auth');
const auditService = require('../services/auditService');

// @route   GET /api/audit-logs
// @desc    Get paginated admin audit logs
router.get('/', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const { page = 1, limit = 50, entityType, action, search } = req.query;
    const result = auditService.queryLogs({
      page: Number(page),
      limit: Number(limit),
      entityType,
      action,
      search
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
