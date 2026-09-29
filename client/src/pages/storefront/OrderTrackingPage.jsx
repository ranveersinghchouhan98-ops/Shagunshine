import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import api from '../../api/apiClient';

const TRACKING_STEPS = [
  { status: 'Placed', label: 'Order Placed', desc: 'Order received and verified' },
  { status: 'Packed', label: 'Packed & Quality Checked', desc: 'Carefully wrapped in velvet packaging' },
  { status: 'Shipped', label: 'Shipped in Transit', desc: 'Handed over to luxury courier fleet' },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier out for doorstep arrival' },
  { status: 'Delivered', label: 'Delivered', desc: 'Package delivered to recipient' }
];

export const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('number') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTracking = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.get(`/orders/track/${encodeURIComponent(searchQuery.trim())}`);
      if (data.success) {
        setOrder(data.order);
      }
    } catch (err) {
      setErrorMsg(err.message || 'No order found with this tracking or order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const num = searchParams.get('number');
    if (num) {
      setQuery(num);
      fetchTracking(num);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTracking(query);
  };

  // Determine current active step index (0 to 4)
  const getStepIndex = (status) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Packed': return 1;
      case 'Shipped': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.order_status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-ivory-100 border border-gold-300 text-maroon-900 flex items-center justify-center mx-auto">
          <Package className="w-7 h-7 text-gold-600" />
        </div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800">
          Live Shipment Radar
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Track Your Luxury Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Enter your Order Number (e.g. <code>SS-2026-8901</code>) or Carrier Tracking ID to view real-time status.
        </p>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order # (e.g. SS-2026-8901) or Tracking ID"
            required
            className="w-full px-4 py-3 pl-11 rounded-2xl border border-stone-300 focus:outline-none focus:border-gold-500 text-xs sm:text-sm bg-white shadow-sm"
          />
          <Search className="w-5 h-5 text-gold-600 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 sm:px-8 py-3 rounded-2xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Track</span>}
        </button>
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tracking Result Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-gold-200/80 p-6 sm:p-10 shadow-luxury space-y-10 animate-in fade-in duration-300">
          {/* Top Status Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 block">
                Order Tracking Details
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Order #{order.order_number}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Recipient: <strong>{order.customer_name}</strong> • Phone: {order.customer_phone}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                order.order_status === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                Current Status: {order.order_status}
              </span>
              <p className="text-xs text-stone-500">
                Carrier: <strong>{order.carrier || 'Delhivery Express Fleet'}</strong>
              </p>
              <p className="text-[11px] font-mono text-stone-400">
                AWB Tracking: {order.tracking_number}
              </p>
            </div>
          </div>

          {/* Step Timeline Progress */}
          {order.order_status === 'Cancelled' ? (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center text-red-800 text-xs font-semibold">
              This order has been cancelled by customer or support team.
            </div>
          ) : (
            <div className="space-y-6">
              <h4 className="font-serif font-bold text-stone-900 text-sm">Shipment Journey:</h4>
              <div className="relative">
                {/* Horizontal Progress Bar */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-stone-200 -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 via-maroon-700 to-emerald-600 transition-all duration-700"
                    style={{ width: `${(currentStepIdx / 4) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                  {TRACKING_STEPS.map((stepItem, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={stepItem.status} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                            isCurrent
                              ? 'bg-maroon-800 text-gold-200 ring-4 ring-gold-400/50 shadow-md scale-110'
                              : isCompleted
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isCurrent ? 'text-maroon-900' : isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>
                            {stepItem.label}
                          </div>
                          <div className="text-[10px] text-stone-500 sm:max-w-[130px] mx-auto mt-0.5 hidden sm:block">
                            {stepItem.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Delivery Estimation Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-ivory-50 border border-gold-200/50 text-xs text-stone-700">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold-700 shrink-0" />
              <div>
                <span className="font-bold text-stone-900">Estimated Delivery:</span>
                <p>{order.estimated_delivery || 'Within 3-4 business days'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gold-700 shrink-0" />
              <div>
                <span className="font-bold text-stone-900">Destination:</span>
                <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
              </div>
            </div>
          </div>

          {/* Ordered Products Overview */}
          <div className="space-y-3 pt-2">
            <h4 className="font-serif font-bold text-stone-900 text-sm">Package Contents ({order.items?.length} items):</h4>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl p-4 bg-stone-50/50">
              {order.items?.map((item) => (
                <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.product_image} alt="" className="w-10 h-10 object-cover rounded-lg border border-stone-200" />
                    <div>
                      <span className="font-semibold text-stone-900">{item.product_name}</span>
                      {item.selected_shade && <span className="block text-stone-500 text-[11px]">Shade: {item.selected_shade}</span>}
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
