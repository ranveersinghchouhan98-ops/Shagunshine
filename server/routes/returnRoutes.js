const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyToken, requirePermission } = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const auditService = require('../services/auditService');
const notificationService = require('../services/notificationService');

// @route   POST /api/returns
// @desc    Submit a return / refund request (Customer)
router.post('/', verifyToken, (req, res) => {
  try {
    const { orderId, reason, items = [], comments } = req.body;
    if (!orderId || !reason) {
      return res.status(400).json({ success: false, message: 'Order ID and reason are required.' });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(orderId, orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Verify customer ownership
    if (order.user_id && order.user_id !== req.user.id && req.user.role === 'customer') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    // Check if order is delivered
    if (order.order_status !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Returns can only be requested for delivered orders. For undelivered orders, you may cancel.'
      });
    }

    const returnId = 'ret_' + uuidv4().substring(0, 8);
    const refundAmount = order.total_amount; // Default to full amount or sum of items

    db.prepare(`
      INSERT INTO returns (id, order_id, user_id, reason, status, refund_amount, return_items, comments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      returnId,
      order.id,
      req.user.id,
      reason,
      'requested',
      refundAmount,
      JSON.stringify(items),
      comments || ''
    );

    // Update order status to Return_Requested
    db.prepare(`
      UPDATE orders SET order_status = 'Return_Requested', updated_at = datetime('now') WHERE id = ?
    `).run(order.id);

    res.status(201).json({
      success: true,
      message: 'Return request submitted successfully. Our customer support team will review it within 24-48 hours.',
      returnId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/returns (Admin & Staff)
// @desc    Get all return requests
router.get('/', verifyToken, requirePermission('manage_returns'), (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    let query = `
      SELECT r.*, o.order_number, o.customer_name, o.customer_email, o.customer_phone, o.total_amount as order_total
      FROM returns r
      LEFT JOIN orders o ON r.order_id = o.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ` AND r.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY r.created_at DESC LIMIT ? OFFSET ?`;
    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit), Number(offset));

    const returns = db.prepare(query).all(...params);
    const count = db.prepare(`SELECT COUNT(*) as total FROM returns ${status && status !== 'all' ? 'WHERE status = ?' : ''}`).get(status && status !== 'all' ? [status] : []).total;

    res.json({
      success: true,
      returns: returns.map(r => ({
        ...r,
        return_items: typeof r.return_items === 'string' ? JSON.parse(r.return_items || '[]') : r.return_items || []
      })),
      total: count,
      page: Number(page)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/returns/:id/moderate (Admin / Support)
// @desc    Approve, reject, or refund a return request
router.put('/:id/moderate', verifyToken, requirePermission('manage_returns'), async (req, res) => {
  try {
    const { id } = req.params;
    const { action, admin_notes, refund_amount } = req.body; // action: 'approve' | 'reject' | 'refund'

    const returnReq = db.prepare('SELECT * FROM returns WHERE id = ?').get(id);
    if (!returnReq) {
      return res.status(404).json({ success: false, message: 'Return request not found.' });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(returnReq.order_id);

    if (action === 'approve') {
      db.prepare(`
        UPDATE returns SET
          status = 'approved',
          admin_notes = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(admin_notes || 'Return approved. Awaiting product arrival.', id);

      db.prepare(`UPDATE orders SET order_status = 'Returned', updated_at = datetime('now') WHERE id = ?`).run(returnReq.order_id);
    } else if (action === 'reject') {
      db.prepare(`
        UPDATE returns SET
          status = 'rejected',
          admin_notes = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(admin_notes || 'Return request rejected as per return policy guidelines.', id);

      db.prepare(`UPDATE orders SET order_status = 'Delivered', updated_at = datetime('now') WHERE id = ?`).run(returnReq.order_id);
    } else if (action === 'refund') {
      const amountToRefund = refund_amount || returnReq.refund_amount || order.total_amount;
      
      let refundResult = null;
      if (order.payment_status === 'Paid' && order.payment_gateway_payment_id) {
        refundResult = await paymentService.processRefund({
          paymentId: order.payment_gateway_payment_id,
          amount: amountToRefund,
          reason: `Return #${id}`
        });
      }

      db.prepare(`
        UPDATE returns SET
          status = 'refunded',
          refund_amount = ?,
          admin_notes = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(amountToRefund, admin_notes || 'Refund processed successfully.', id);

      db.prepare(`
        UPDATE orders SET
          order_status = 'Refunded',
          payment_status = 'Refunded',
          updated_at = datetime('now')
        WHERE id = ?
      `).run(returnReq.order_id);
    }

    auditService.log({
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: `RETURN_${action.toUpperCase()}`,
      entityType: 'return',
      entityId: id,
      details: { orderId: returnReq.order_id, admin_notes, action },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: `Return request ${action}ed successfully.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
