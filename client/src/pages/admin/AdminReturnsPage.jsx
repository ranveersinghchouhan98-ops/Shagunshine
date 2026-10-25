import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Eye,
  X,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/apiClient';

export const AdminReturnsPage = () => {
  const { addToast } = useToast();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [actionModal, setActionModal] = useState(null); // { type: 'approve' | 'reject' | 'refund', returnReq }
  const [adminNote, setAdminNote] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReturns();
  }, [page, statusFilter]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/returns?status=${statusFilter}&page=${page}&limit=25`);
      if (data.success) {
        setReturns(data.returns || []);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch return requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async () => {
    if (!actionModal) return;

    try {
      setSubmitting(true);
      const data = await api.put(`/returns/${actionModal.returnReq.id}/moderate`, {
        action: actionModal.type,
        admin_notes: adminNote,
        refund_amount: actionModal.type === 'refund' ? Number(refundAmount) : undefined
      });
      if (data.success) {
        addToast(`Return request ${actionModal.type}ed successfully!`, 'success');
        setActionModal(null);
        setAdminNote('');
        setRefundAmount('');
        fetchReturns();
      } else {
        addToast(data.message || 'Action failed', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Network error processing request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'requested':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'approved':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'refunded':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-stone-900 flex items-center gap-2.5">
            <RotateCcw className="w-7 h-7 text-maroon-800" />
            <span>Returns, Refunds & Exchanges</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Review customer return requests, inspect reasons, approve shipments, and initiate refunds.
          </p>
        </div>

        <button
          onClick={() => { setPage(1); fetchReturns(); }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        {['all', 'requested', 'approved', 'refunded', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => { setStatusFilter(st); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              statusFilter === st
                ? 'bg-maroon-900 text-gold-300 shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {st === 'all' ? 'All Requests' : st}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <RefreshCw className="w-6 h-6 text-gold-500 animate-spin mx-auto mb-2" />
                    <span className="text-stone-400 text-xs">Loading return requests...</span>
                  </td>
                </tr>
              ) : returns.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-stone-400 text-xs">
                    No return requests found in this view.
                  </td>
                </tr>
              ) : (
                returns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 whitespace-nowrap text-stone-500 font-mono text-[11px]">
                      {new Date(ret.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-bold text-stone-900 font-mono">
                      #{ret.order_number || ret.order_id}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-stone-900">{ret.customer_name || 'Customer'}</div>
                      <div className="text-[10px] text-stone-400">{ret.customer_phone || ret.customer_email}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-stone-600">
                      {ret.reason}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-bold text-stone-900 font-mono">
                      ₹{ret.refund_amount || ret.order_total}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(ret.status)}`}>
                        {ret.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => setSelectedReturn(ret)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {ret.status === 'requested' && (
                        <>
                          <button
                            onClick={() => {
                              setActionModal({ type: 'approve', returnReq: ret });
                              setAdminNote('Return approved. Please dispatch the unopened product to our warehouse.');
                            }}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-lg hover:bg-emerald-100 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setActionModal({ type: 'reject', returnReq: ret });
                              setAdminNote('Rejected as cosmetic seal was reported broken / policy exceeded.');
                            }}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold rounded-lg hover:bg-rose-100 transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {ret.status === 'approved' && (
                        <button
                          onClick={() => {
                            setActionModal({ type: 'refund', returnReq: ret });
                            setRefundAmount(String(ret.refund_amount || ret.order_total));
                            setAdminNote('Product received and quality checked. Refund initiated.');
                          }}
                          className="px-2.5 py-1 bg-maroon-900 text-gold-200 text-[11px] font-bold rounded-lg hover:bg-maroon-800 transition"
                        >
                          Process Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderation Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900 capitalize">
                {actionModal.type} Return Request
              </h3>
              <button onClick={() => setActionModal(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Order: <span className="font-bold text-stone-900">#{actionModal.returnReq.order_number || actionModal.returnReq.order_id}</span>
            </p>

            {actionModal.type === 'refund' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Refund Amount (₹)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono font-bold"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Admin Resolution Note to Customer</label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActionModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleModerate}
                disabled={submitting}
                className="px-4 py-2 bg-maroon-900 text-gold-200 text-xs font-bold rounded-xl hover:bg-maroon-800 disabled:opacity-50 transition"
              >
                {submitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Inspector Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Return Request Details</h3>
              <button onClick={() => setSelectedReturn(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="bg-stone-50 p-3 rounded-xl space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Order ID:</span>
                  <span className="font-mono">#{selectedReturn.order_number || selectedReturn.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Customer:</span>
                  <span>{selectedReturn.customer_name} ({selectedReturn.customer_phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Refund Claim:</span>
                  <span className="font-mono font-bold text-maroon-900">₹{selectedReturn.refund_amount}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-900 block mb-1">Reason for Return:</span>
                <p className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl text-stone-700">
                  {selectedReturn.reason}
                </p>
              </div>

              {selectedReturn.comments && (
                <div>
                  <span className="font-bold text-stone-900 block mb-1">Customer Comments:</span>
                  <p className="p-3 bg-stone-50 rounded-xl text-stone-600">
                    {selectedReturn.comments}
                  </p>
                </div>
              )}

              {selectedReturn.admin_notes && (
                <div>
                  <span className="font-bold text-stone-900 block mb-1">Admin Response Note:</span>
                  <p className="p-3 bg-stone-100 rounded-xl text-stone-800 font-medium">
                    {selectedReturn.admin_notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReturn(null)}
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
