import React, { useState, useEffect } from 'react';
import { Users, Search, Ban, CheckCircle, Eye, ShoppingBag, X, Loader2 } from 'lucide-react';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { success, error } = useToast();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleToggleBlock = async (customer) => {
    try {
      const res = await api.put(`/customers/${customer.id}/toggle-block`);
      if (res.success) {
        success(res.message);
        fetchCustomers();
      }
    } catch (err) {
      error(err.message || 'Error updating status');
    }
  };

  const handleViewCustomer = async (cust) => {
    setSelectedCustomer(cust);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/customers/${cust.id}`);
      if (res.success) {
        setCustomerOrders(res.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Registered Customers ({customers.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor client accounts, aggregate lifetime spend, and manage access privileges.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or phone..."
            className="w-full px-4 py-2 pl-10 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
                        alt=""
                        className="w-10 h-10 rounded-full border border-gold-400 object-cover"
                      />
                      <div>
                        <span className="font-bold text-stone-900 block">{c.name}</span>
                        <span className="text-[10px] text-stone-400">Joined: {new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-stone-800 block">{c.email}</span>
                    <span className="text-[10px] text-stone-500 font-mono">{c.phone || 'No phone'}</span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    {c.total_orders} orders
                  </td>

                  <td className="py-3.5 px-4 font-serif font-bold text-maroon-900 text-sm">
                    ₹{c.total_spent.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.is_blocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.is_blocked ? 'Suspended' : 'Active'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleViewCustomer(c)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-maroon-800 hover:bg-stone-100"
                      title="View Order History"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleBlock(c)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        c.is_blocked ? 'text-emerald-600 hover:bg-emerald-50' : 'text-rose-600 hover:bg-rose-50'
                      }`}
                      title={c.is_blocked ? 'Unblock Account' : 'Suspend Account'}
                    >
                      {c.is_blocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details & History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedCustomer.name}`}
                  alt=""
                  className="w-12 h-12 rounded-full border border-gold-400 object-cover"
                />
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{selectedCustomer.name}</h3>
                  <span className="text-xs text-stone-500">{selectedCustomer.email} • {selectedCustomer.phone}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif font-bold text-stone-900 text-sm">Purchase History ({customerOrders.length} orders):</h4>
              {loadingDetails ? (
                <div className="py-6 text-center text-xs text-stone-400">Loading purchase record...</div>
              ) : customerOrders.length === 0 ? (
                <div className="py-6 text-center text-xs text-stone-400">No orders placed by this customer yet.</div>
              ) : (
                <div className="space-y-3">
                  {customerOrders.map((ord) => (
                    <div key={ord.id} className="p-3.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-900 block">Order #{ord.order_number}</span>
                        <span className="text-[10px] text-stone-400">{new Date(ord.created_at).toLocaleDateString()} • {ord.payment_method}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-serif font-bold text-maroon-900 block">₹{ord.total_amount.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-emerald-700">{ord.order_status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
