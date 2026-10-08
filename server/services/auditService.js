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
    const safeLimit = Math.min(Math.max(1, parseInt(limit) || 50), 100);
    const safePage = Math.max(1, parseInt(page) || 1);
    const offset = (safePage - 1) * safeLimit;
    const conditions = [];
    const params = [];

    if (entityType && entityType !== 'all') {
      conditions.push('entity_type = ?');
      params.push(entityType);
    }

    if (action && action !== 'all') {
      const cleanAction = String(action).trim().replace(/[%_\\]/g, '\\$&');
      conditions.push("action LIKE ? ESCAPE '\\'");
      params.push(`%${cleanAction}%`);
    }

    if (search) {
      const cleanSearch = String(search).trim().replace(/[%_\\]/g, '\\$&');
      conditions.push("(user_email LIKE ? ESCAPE '\\' OR user_name LIKE ? ESCAPE '\\' OR details LIKE ? ESCAPE '\\' OR entity_id LIKE ? ESCAPE '\\')");
      params.push(`%${cleanSearch}%`, `%${cleanSearch}%`, `%${cleanSearch}%`, `%${cleanSearch}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRow = db.prepare(`SELECT COUNT(*) as total FROM audit_logs ${whereClause}`).get(...params);
    const total = countRow ? countRow.total : 0;

    const rows = db.prepare(`
      SELECT * FROM audit_logs
      ${whereClause}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `).all(...params, safeLimit, offset);

    return {
      logs: rows.map(r => ({
        ...r,
        details: (() => {
          try { return JSON.parse(r.details); } catch (e) { return r.details; }
        })()
      })),
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit)
    };
  }
}

module.exports = new AuditService();
