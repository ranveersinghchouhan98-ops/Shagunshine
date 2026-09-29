import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  User,
  Eye,
  X,
  FileText
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminAuditLogsPage = () => {
  const { addToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);

  const token = localStorage.getItem('shagun_token');

  useEffect(() => {
    fetchLogs();
  }, [page, entityType]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: '25',
        entityType,
        search
      });

      const res = await fetch(`http://localhost:5000/api/audit-logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      addToast('Failed to fetch audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const getActionBadgeColor = (action) => {
    if (action.includes('CREATE')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (action.includes('UPDATE')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (action.includes('DELETE') || action.includes('PURGE')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (action.includes('RETURN')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-stone-900 flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-maroon-800" />
            <span>Admin Audit Logs & Activity Trail</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Complete immutable security trail of all administrative updates, stock changes, and order modifications.
          </p>
        </div>

        <button
          onClick={() => { setPage(1); fetchLogs(); }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email, action, entity ID..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-maroon-900 text-gold-200 text-xs font-bold rounded-xl hover:bg-maroon-800 transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-stone-400" />
          <span className="text-xs text-stone-600 font-medium">Entity:</span>
          <select
            value={entityType}
            onChange={(e) => { setEntityType(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            <option value="all">All Entities</option>
            <option value="order">Orders</option>
            <option value="product">Products</option>
            <option value="return">Returns</option>
            <option value="setting">Settings</option>
            <option value="database">Database</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Entity ID</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <RefreshCw className="w-6 h-6 text-gold-500 animate-spin mx-auto mb-2" />
                    <span className="text-stone-400 text-xs">Loading audit logs...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-stone-400 text-xs">
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 whitespace-nowrap text-stone-500 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-stone-900">{log.user_email || 'System'}</div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">{log.user_role}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap uppercase text-[10px] font-bold text-stone-500">
                      {log.entity_type}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-stone-600 text-[11px]">
                      {log.entity_id || '-'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-stone-400 text-[11px]">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-stone-400 hover:text-maroon-800 hover:bg-stone-100 rounded-lg transition"
                        title="View Full Payload"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <div>
              Showing {logs.length} of {totalCount} total entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-stone-100 rounded-lg font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <span className="font-mono font-bold px-2">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 bg-stone-100 rounded-lg font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-maroon-800" />
                <h3 className="font-serif text-lg font-bold text-stone-900">Audit Log Details</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-400">Action:</span>
                <span className="font-bold text-stone-900">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-400">Actor Email:</span>
                <span className="font-mono">{selectedLog.user_email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-400">Role:</span>
                <span className="uppercase font-bold text-gold-600">{selectedLog.user_role}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-400">Entity:</span>
                <span className="font-mono">{selectedLog.entity_type} #{selectedLog.entity_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-400">Timestamp:</span>
                <span>{new Date(selectedLog.created_at).toISOString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Payload / Changes Snapshot:</label>
              <pre className="p-3 bg-stone-900 text-gold-300 rounded-xl text-[11px] overflow-x-auto max-h-60 font-mono">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
