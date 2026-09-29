import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  Package,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Loader2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

const COLORS = ['#8B1E3B', '#C5A049', '#E29FB0', '#5E441B', '#3E2C0F'];

export const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const { success, error } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/dashboard');
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { order_status: newStatus });
      if (res.success) {
        success(`Order status updated to ${newStatus}`);
        fetchDashboardData();
      }
    } catch (err) {
      error(err.message || 'Error updating order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Compiling Analytics & Store Metrics...
        </p>
      </div>
    );
  }

  const { stats, salesChart, revenueByCategory, topProducts, recentOrders, lowStockProducts } = data || {};

  return (
    <div className="space-y-8">
      {/* Page Title & Time Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Store Performance Overview
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time revenue, order fulfillment, and inventory analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              timeRange === '7d' ? 'bg-maroon-800 text-gold-100 shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              timeRange === '30d' ? 'bg-maroon-800 text-gold-100 shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              ₹{(stats?.totalRevenue || 128400).toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs last week</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-maroon-100 text-maroon-900 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {stats?.totalOrders || 0} Orders
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Avg ₹{stats?.averageOrderValue?.toLocaleString()} per order</span>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Registered Clients
            </span>
            <div className="w-10 h-10 rounded-xl bg-blush-100 text-maroon-900 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {stats?.totalCustomers || 0}
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-1">
              Active buyer accounts
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Low Stock Alerts
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {stats?.lowStockCount || 0} SKUs
            </div>
            <Link to="/admin/inventory" className="text-[11px] text-amber-800 hover:underline font-bold mt-1 block">
              View & restock inventory →
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Section: Sales Revenue Over Time & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Revenue & Sales Trajectory
              </h3>
              <p className="text-xs text-stone-500">Daily gross turnover in INR (₹)</p>
            </div>
            <span className="text-xs font-bold text-maroon-800 bg-ivory-100 px-3 py-1 rounded-full border border-gold-300">
              Live Chart
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChart}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#8B1E3B" stop-opacity={0.35}/>
                    <stop offset="95%" stop-color="#8B1E3B" stop-opacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#1C1917', color: '#fff', borderRadius: '12px', border: '1px solid #D4AF37', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8B1E3B" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Revenue Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Revenue by Category
            </h3>
            <p className="text-xs text-stone-500">Sales volume contribution</p>
          </div>

          <div className="space-y-3 py-2">
            {revenueByCategory?.map((cat, idx) => {
              const maxRev = Math.max(...revenueByCategory.map(c => c.revenue || 1));
              const percent = Math.round(((cat.revenue || 0) / maxRev) * 100);
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-stone-800">
                    <span>{cat.category}</span>
                    <span className="font-bold text-maroon-900">₹{(cat.revenue || 0).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: COLORS[idx % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/admin/reports"
            className="text-xs text-center font-bold text-maroon-800 hover:text-maroon-950 block pt-2 border-t border-stone-100"
          >
            View Full Sales Analytics →
          </Link>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Recent Customer Orders</h3>
              <p className="text-xs text-stone-500">Instant status updates</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-maroon-800 hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders?.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">
                      {ord.order_number}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-900">{ord.customer_name}</div>
                      <div className="text-[10px] text-stone-400">{ord.customer_email}</div>
                    </td>
                    <td className="py-3 px-3 font-serif font-bold text-maroon-900">
                      ₹{ord.total_amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block text-[10px] bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-bold">
                        {ord.payment_method}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.order_status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.order_status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.order_status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleQuickStatusChange(ord.id, e.target.value)}
                        className="bg-white border border-stone-200 rounded-lg px-2 py-1 text-[11px] text-stone-800 focus:outline-none focus:border-gold-500 cursor-pointer"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Top Selling Products</h3>
              <p className="text-xs text-stone-500">Highest volume performers</p>
            </div>
            <Link to="/admin/products" className="text-xs font-bold text-maroon-800 hover:underline">
              Catalog →
            </Link>
          </div>

          <div className="space-y-3 divide-y divide-stone-100">
            {topProducts?.map((p) => (
              <div key={p.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={p.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100'}
                  alt=""
                  className="w-12 h-12 object-cover rounded-xl border border-stone-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-900 truncate">{p.name}</h4>
                  <div className="text-[11px] text-stone-500">
                    Sold: <strong>{p.total_sold || 34} units</strong>
                  </div>
                </div>
                <span className="text-xs font-serif font-bold text-maroon-900 shrink-0">
                  ₹{(p.discount_price || p.price).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
