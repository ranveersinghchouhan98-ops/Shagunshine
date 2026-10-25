import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Edit2,
  Printer,
  Truck,
  CheckCircle2,
  X,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Loader2
} from 'lucide-react';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Order Details Modal / Drawer
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status Update Modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('Placed');
  const [newPaymentStatus, setNewPaymentStatus] = useState('Paid');
  const [newTracking, setNewTracking] = useState('');
  const [newCarrier, setNewCarrier] = useState('Delhivery Express Luxury Fleet');
  const [newDeliveryDate, setNewDeliveryDate] = useState('');

  const { success, error } = useToast();
  const [syncingOrderId, setSyncingOrderId] = useState(null);

  const handleSyncShiprocket = async (orderId) => {
    setSyncingOrderId(orderId);
    try {
      const res = await api.post(`/orders/${orderId}/sync-shiprocket`);
      if (res.success) {
        success(res.message);
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(res.order);
        }
      }
    } catch (err) {
      error(err.message || 'Failed to dispatch order to Shiprocket.');
    } finally {
      setSyncingOrderId(null);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let endpoint = `/orders?limit=100`;
      if (statusFilter !== 'All') endpoint += `&status=${statusFilter}`;
      if (search) endpoint += `&search=${encodeURIComponent(search)}`;

      const data = await api.get(endpoint);
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const openUpdateModal = (ord) => {
    setEditingOrder(ord);
    setNewStatus(ord.order_status);
    setNewPaymentStatus(ord.payment_status);
    setNewTracking(ord.tracking_number || '');
    setNewCarrier(ord.carrier || 'Delhivery Express Luxury Fleet');
    setNewDeliveryDate(ord.estimated_delivery || '');
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/orders/${editingOrder.id}/status`, {
        order_status: newStatus,
        payment_status: newPaymentStatus,
        tracking_number: newTracking,
        carrier: newCarrier,
        estimated_delivery: newDeliveryDate
      });

      if (res.success) {
        success(res.message);
        setIsUpdateModalOpen(false);
        fetchOrders();
        if (selectedOrder?.id === editingOrder.id) {
          setSelectedOrder(res.order);
        }
      }
    } catch (err) {
      error(err.message || 'Error updating order.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'Packed':
        return 'bg-amber-100 text-amber-800';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800';
      case 'Placed':
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Order Fulfillment & Logistics ({orders.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Process shipments, update carrier tracking numbers, and manage invoices.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, phone, or tracking..."
            className="w-full px-4 py-2 pl-10 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {['All', 'Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-maroon-800 text-gold-100 shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order Details</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Tracking #</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-stone-900 block">{ord.order_number}</span>
                    <span className="text-[10px] text-stone-400">{new Date(ord.created_at).toLocaleString()}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-stone-900 block">{ord.customer_name}</span>
                    <span className="text-[10px] text-stone-500">{ord.customer_phone}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-serif font-bold text-maroon-900 text-sm">
                      ₹{ord.total_amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-400 block">{ord.items?.length || 1} items</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-block text-[10px] font-bold bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                      {ord.payment_method}
                    </span>
                    <span className="block text-[10px] text-stone-500">{ord.payment_status}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(ord.order_status)}`}>
                      {ord.order_status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">
                    <div>{ord.tracking_number || <span className="text-stone-400">Pending</span>}</div>
                    {ord.shiprocket_sync_status === 'synced' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Shiprocket
                      </span>
                    ) : ord.shiprocket_sync_status === 'failed' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded mt-0.5">
                        SR Error
                      </span>
                    ) : null}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {ord.shiprocket_sync_status !== 'synced' && (
                      <button
                        onClick={() => handleSyncShiprocket(ord.id)}
                        disabled={syncingOrderId === ord.id}
                        className="p-1.5 rounded-lg text-amber-700 hover:text-amber-900 hover:bg-amber-100 transition-colors disabled:opacity-50"
                        title="Dispatch to Shiprocket"
                      >
                        {syncingOrderId === ord.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Truck className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-maroon-800 hover:bg-stone-100 transition-colors"
                      title="View Invoice & Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openUpdateModal(ord)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-gold-700 hover:bg-stone-100 transition-colors"
                      title="Update Shipment Status"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Printable Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gold-200/80 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Order Details #{selectedOrder.order_number}
                </h3>
                <span className="text-xs text-stone-500">Placed on {new Date(selectedOrder.created_at).toLocaleString()}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-ivory-50 text-xs text-stone-700">
              <div>
                <strong className="text-stone-900 block mb-1">Customer Info:</strong>
                <p>Name: {selectedOrder.customer_name}</p>
                <p>Email: {selectedOrder.customer_email}</p>
                <p>Phone: {selectedOrder.customer_phone}</p>
              </div>
              <div>
                <strong className="text-stone-900 block mb-1">Shipping Destination:</strong>
                <p>{selectedOrder.shipping_address?.addressLine1}</p>
                <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.postalCode}</p>
              </div>
            </div>

            {/* Shiprocket Logistics Integration */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-stone-900 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-gold-700" />
                    Shiprocket Automated Fulfillment:
                  </strong>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    selectedOrder.shiprocket_sync_status === 'synced'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedOrder.shiprocket_sync_status === 'failed'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {selectedOrder.shiprocket_sync_status || 'Pending Sync'}
                  </span>
                </div>
                {selectedOrder.shiprocket_order_id && (
                  <div className="text-stone-600 mt-1 space-x-2">
                    <span>SR Order ID: <code className="font-mono text-stone-900 font-bold">{selectedOrder.shiprocket_order_id}</code></span>
                    {selectedOrder.shiprocket_awb_code && (
                      <span>• AWB: <code className="font-mono text-stone-900 font-bold">{selectedOrder.shiprocket_awb_code}</code></span>
                    )}
                    {selectedOrder.shiprocket_synced_at && (
                      <span className="text-[10px] text-stone-400 block sm:inline">• Synced: {new Date(selectedOrder.shiprocket_synced_at).toLocaleString()}</span>
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={syncingOrderId === selectedOrder.id}
                onClick={() => handleSyncShiprocket(selectedOrder.id)}
                className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                {syncingOrderId === selectedOrder.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Truck className="w-3.5 h-3.5" />
                )}
                <span>{selectedOrder.shiprocket_sync_status === 'synced' ? 'Re-sync Shiprocket' : 'Dispatch to Shiprocket'}</span>
              </button>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <strong className="text-xs uppercase tracking-wider text-stone-700 block">Ordered Items:</strong>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl p-4 bg-stone-50/50">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.product_image} alt="" className="w-10 h-10 object-cover rounded-lg border border-stone-200" />
                      <div>
                        <span className="font-semibold text-stone-900">{item.product_name}</span>
                        {item.selected_shade && <span className="block text-stone-500 text-[11px]">Shade: {item.selected_shade}</span>}
                        <span className="text-stone-400">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">₹{item.total_price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 max-w-xs ml-auto text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-stone-900">₹{selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrder.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-₹{selectedOrder.discount_amount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>{selectedOrder.shipping_fee === 0 ? 'FREE' : `₹${selectedOrder.shipping_fee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="font-serif text-lg text-maroon-900">₹{selectedOrder.total_amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-gold-700" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={() => {
                  const ord = selectedOrder;
                  setSelectedOrder(null);
                  openUpdateModal(ord);
                }}
                className="px-6 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Shipment Status Modal */}
      {isUpdateModalOpen && editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gold-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Update Order #{editingOrder.order_number}
              </h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Order Fulfillment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500"
                >
                  <option value="Placed">Placed (Received)</option>
                  <option value="Packed">Packed & Quality Checked</option>
                  <option value="Shipped">Shipped in Transit</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered to Recipient</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Payment Status
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending (COD)</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Carrier / Courier Partner
                </label>
                <input
                  type="text"
                  value={newCarrier}
                  onChange={(e) => setNewCarrier(e.target.value)}
                  placeholder="Delhivery Express / Blue Dart"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Tracking AWB Number
                </label>
                <input
                  type="text"
                  value={newTracking}
                  onChange={(e) => setNewTracking(e.target.value)}
                  placeholder="DELHIVERY-98124982"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Save & Notify Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
