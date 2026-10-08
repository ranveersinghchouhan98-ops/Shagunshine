import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  KeyRound,
  LogOut,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Shield,
  Loader2
} from 'lucide-react';
import api from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/common/ProductCard';
import { INDIAN_STATES } from '../../constants/indianStates';

export const MyAccountPage = () => {
  const { user, addresses, addAddress, deleteAddress, updateProfile, changePassword, logout, isStaff } = useAuth();
  const { wishlist } = useWishlist();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses', 'wishlist'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Add Address Modal / Form State
  const [isAddingAddr, setIsAddingAddr] = useState(false);
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('Maharashtra');
  const [addrZip, setAddrZip] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await api.get('/orders/my-orders');
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ name, phone });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    await changePassword(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    await addAddress({
      fullName: addrFullName,
      phone: addrPhone,
      addressLine1: addrLine1,
      addressLine2: addrLine2,
      city: addrCity,
      state: addrState,
      postalCode: addrZip,
      isDefault: addrIsDefault
    });
    setIsAddingAddr(false);
    setAddrLine1('');
    setAddrCity('');
    setAddrZip('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Packed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Placed':
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Account Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-950 via-maroon-950 to-stone-900 text-white p-6 sm:p-8 border border-gold-500/30 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gold-400 shadow-md"
          />
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              Royal Beauty Member
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">{user?.name}</h1>
            <p className="text-xs text-stone-300 mt-0.5">{user?.email} • {user?.phone || 'No phone registered'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isStaff && (
            <Link
              to="/admin"
              className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-xs font-bold uppercase tracking-wider text-stone-950 transition-colors flex items-center gap-2 shadow-md"
            >
              <Shield className="w-4 h-4 text-stone-950" />
              <span>Admin Console</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold uppercase tracking-wider text-white border border-white/20 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Account Tabs & Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-1">
          {isStaff && (
            <Link
              to="/admin"
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold tracking-wide bg-maroon-50 text-maroon-900 border border-maroon-200 hover:bg-maroon-100 transition-all mb-2"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-maroon-800" />
                <span>Go to Admin Panel</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-maroon-700" />
            </Link>
          )}
          {[
            { id: 'orders', label: 'Order History & Tracking', icon: Package, badge: orders.length },
            { id: 'profile', label: 'Profile & Security', icon: User },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, badge: addresses.length },
            { id: 'wishlist', label: 'My Wishlist', icon: Heart, badge: wishlist.length }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === tab.id
                    ? 'bg-maroon-800 text-gold-100 shadow-sm'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-gold-500" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id ? 'bg-gold-500 text-stone-950' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels (9 cols) */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          {/* 1. Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="font-serif text-xl font-bold text-stone-900">Your Orders & Shipments</h3>
                <span className="text-xs text-stone-500">{orders.length} orders placed</span>
              </div>

              {loadingOrders ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-8 h-8 text-gold-600 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-stone-500">Fetching order history...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <Package className="w-12 h-12 text-stone-300 mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-stone-800">No Orders Placed Yet</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    You haven't ordered any luxury cosmetics yet. Discover our radiant formulations now!
                  </p>
                  <Link to="/shop" className="px-6 py-2.5 rounded-full bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider inline-block">
                    Explore Shop
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div key={ord.id} className="rounded-2xl border border-stone-200 p-5 space-y-4 hover:border-gold-300 transition-colors shadow-sm">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                        <div>
                          <span className="font-bold text-stone-900 text-sm">Order #{ord.order_number}</span>
                          <span className="text-stone-400 block sm:inline sm:ml-3">
                            Placed on {new Date(ord.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(ord.order_status)}`}>
                            {ord.order_status}
                          </span>
                          <Link
                            to={`/track?number=${ord.order_number}`}
                            className="px-3 py-1 bg-ivory-100 hover:bg-gold-100 border border-gold-300 text-maroon-900 font-bold rounded-lg text-[11px] transition-colors"
                          >
                            Live Tracking
                          </Link>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-stone-100">
                        {ord.items?.map((item) => (
                          <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img src={item.product_image} alt="" className="w-12 h-12 object-cover rounded-lg border border-stone-200" />
                              <div>
                                <span className="font-bold text-stone-900 text-sm">{item.product_name}</span>
                                {item.selected_shade && <span className="block text-stone-500">Shade: {item.selected_shade}</span>}
                                <span className="text-stone-400 text-[11px]">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</span>
                              </div>
                            </div>
                            <span className="font-serif font-bold text-stone-900 text-sm">₹{item.total_price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Details */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-600 gap-2">
                        <div>
                          <span>Payment: <strong>{ord.payment_method}</strong> ({ord.payment_status})</span>
                          {ord.tracking_number && <span className="ml-3">Tracking: <strong>{ord.tracking_number}</strong></span>}
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-stone-900">Total: </span>
                          <span className="font-serif font-bold text-base text-maroon-900">₹{ord.total_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Profile & Security Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 pb-3 border-b border-stone-200">
                  Profile Information
                </h3>
                <form onSubmit={handleProfileSubmit} className="space-y-4 pt-4 max-w-md">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                      Email Address (Permanent)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-100 text-stone-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md"
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>

              {/* Password Change */}
              <div className="pt-6 border-t border-stone-200">
                <h3 className="font-serif text-xl font-bold text-stone-900 pb-3 border-b border-stone-200">
                  Security & Password
                </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-4 max-w-md">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold uppercase tracking-wider shadow-md"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 3. Saved Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="font-serif text-xl font-bold text-stone-900">Saved Delivery Addresses</h3>
                <button
                  onClick={() => setIsAddingAddr(!isAddingAddr)}
                  className="px-4 py-2 rounded-xl bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add Address Form Modal / Inline */}
              {isAddingAddr && (
                <form onSubmit={handleAddAddressSubmit} className="p-5 rounded-2xl bg-ivory-50 border border-gold-300/70 space-y-4 animate-in fade-in">
                  <h4 className="font-serif font-bold text-stone-900 text-sm">New Delivery Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={addrFullName}
                        onChange={(e) => setAddrFullName(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={addrPhone}
                        onChange={(e) => setAddrPhone(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Address Line 1</label>
                      <input
                        type="text"
                        value={addrLine1}
                        onChange={(e) => setAddrLine1(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">City</label>
                      <input
                        type="text"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">State</label>
                      <select
                        value={addrState}
                        onChange={(e) => setAddrState(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={addrZip}
                        onChange={(e) => setAddrZip(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addrIsDefault}
                      onChange={(e) => setAddrIsDefault(e.target.checked)}
                      className="accent-maroon-800"
                    />
                    <span>Set as primary default address</span>
                  </label>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="px-5 py-2 rounded-xl bg-maroon-800 text-gold-100 text-xs font-bold">
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddr(false)}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-2xl border border-stone-200 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-xs">{addr.full_name}</span>
                      {addr.is_default === 1 && (
                        <span className="bg-gold-200 text-maroon-900 text-[10px] font-bold px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600">{addr.address_line1}</p>
                    {addr.address_line2 && <p className="text-xs text-stone-600">{addr.address_line2}</p>}
                    <p className="text-xs text-stone-600">{addr.city}, {addr.state} - {addr.postal_code}</p>
                    <p className="text-xs text-stone-500">Phone: {addr.phone}</p>

                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-stone-400 hover:text-red-600 p-1.5 transition-colors absolute bottom-3 right-3"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="font-serif text-xl font-bold text-stone-900">Your Saved Wishlist</h3>
                <span className="text-xs text-stone-500">{wishlist.length} saved creations</span>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart className="w-12 h-12 text-stone-300 mx-auto" />
                  <p className="text-xs text-stone-500">Your wishlist is empty. Tap the heart icon on any product to save it!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
