const db = require('../config/db');

/**
 * Audit Logging Service for Shagun Shine Cosmetics
 * Tracks all administrative mutations (creations, edits, status changes, deletions, config updates).
 */
class AuditService {
  /**
   * Log an administrative action
   * @param {Object} params - { userId, userName, userEmail, userRole, action, entityType, entityId, details, ipAddress }
   */
  log({
    userId = null,
    userName = null,
    userEmail = 'system',
    userRole = 'system',
    action,
    entityType = 'general',
    entityId = null,
    details = {},
    ipAddress = '127.0.0.1'
  }) {
    try {
      const detailsJson = typeof details === 'string' ? details : JSON.stringify(details);
      const nameToStore = userName || (userEmail ? userEmail.split('@')[0] : 'Administrator');
      const stmt = db.prepare(`
        INSERT INTO audit_logs (user_id, user_name, user_email, user_role, action, entity_type, entity_id, details, ip_address, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `);
      stmt.run(
        userId,
        nameToStore,
        userEmail,
        userRole,
        action,
        entityType,
        entityId ? String(entityId) : null,
        detailsJson,
        ipAddress
      );
    } catch (err) {
      console.error('Failed to write audit log:', err.message);
    }
  }

  /**
   * Query audit logs with pagination and filters
   */
  queryLogs({ page = 1, limit = 50, entityType, action, search }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (entityType && entityType !== 'all') {
      conditions.push('entity_type = ?');
      params.push(entityType);
    }

    if (action && action !== 'all') {
      conditions.push('action LIKE ?');
      params.push(`%${action}%`);
    }

    if (search) {
      conditions.push('(user_email LIKE ? OR user_name LIKE ? OR details LIKE ? OR entity_id LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRow = db.prepare(`SELECT COUNT(*) as total FROM audit_logs ${whereClause}`).get(...params);
    const total = countRow ? countRow.total : 0;

    const rows = db.prepare(`
      SELECT * FROM audit_logs
      ${whereClause}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    return {
      logs: rows.map(r => ({
        ...r,
        details: (() => {
          try { return JSON.parse(r.details); } catch (e) { return r.details; }
        })()
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}

module.exports = new AuditService();
