import React, { useState, useEffect } from 'react';
import {
  Building2,
  Receipt,
  CreditCard,
  Truck,
  Globe,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { INDIAN_STATES } from '../../constants/indianStates';

export const AdminSettingsPage = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [purgeModalOpen, setPurgeModalOpen] = useState(false);
  const [purgeConfirmText, setPurgeConfirmText] = useState('');
  const [purging, setPurging] = useState(false);

  // Settings State
  const [storeProfile, setStoreProfile] = useState({
    store_name: 'Shagun Shine Cosmetics',
    tagline: 'Pure Radiance, Timeless Indian Luxury',
    legal_name: 'Shagun Shine Luxury Beauty Private Limited',
    support_email: 'care@shagunshine.com',
    support_phone: '+91 98765 43210',
    address: 'Plot 42, Sector 18, Udyog Vihar',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122015',
    currency: 'INR'
  });

  const [gstConfig, setGstConfig] = useState({
    gstin: '07AAAAA0000A1Z5',
    legal_name: 'Shagun Shine Luxury Beauty Private Limited',
    state: 'Haryana',
    default_gst_rate: 18,
    is_inclusive: true
  });

  const [paymentConfig, setPaymentConfig] = useState({
    provider: 'mock',
    razorpay_key_id: 'rzp_test_mock_shagun',
    razorpay_key_secret: 'mock_secret_shagun_shine',
    webhook_secret: 'mock_wh_secret_2026',
    cod_enabled: true
  });

  const [shippingConfig, setShippingConfig] = useState({
    free_shipping_threshold: 999,
    standard_shipping_fee: 99,
    express_shipping_fee: 199,
    default_dispatch_days: 2
  });

  const [seoConfig, setSeoConfig] = useState({
    meta_title: 'Shagun Shine Cosmetics | Luxury Organic Indian Beauty',
    meta_description: 'Discover cruelty-free, luxury Ayurvedic & cosmetic formulations infused with 24K Gold, Kumkumadi & botanicals for radiant, glowing Indian skin.',
    instagram_handle: '@shagunshinebeauty',
    facebook_handle: 'shagunshinebeauty',
    youtube_handle: '@shagunshineofficial'
  });

  const token = localStorage.getItem('shagun_token');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.settings) {
        if (data.settings.store_profile) setStoreProfile(data.settings.store_profile);
        if (data.settings.gst_config) setGstConfig(data.settings.gst_config);
        if (data.settings.payment_config) setPaymentConfig(data.settings.payment_config);
        if (data.settings.shipping_config) setShippingConfig(data.settings.shipping_config);
        if (data.settings.seo_config) setSeoConfig(data.settings.seo_config);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key, value, label) => {
    try {
      setSaving(true);
      const res = await fetch(`http://localhost:5000/api/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ value })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`${label} saved successfully!`, 'success');
      } else {
        addToast(data.message || 'Failed to update setting', 'error');
      }
    } catch (err) {
      addToast('Network error saving setting', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePurgeDemoData = async () => {
    if (purgeConfirmText !== 'PURGE DEMO DATA') {
      addToast('Please type PURGE DEMO DATA exactly to confirm.', 'error');
      return;
    }

    try {
      setPurging(true);
      const res = await fetch('http://localhost:5000/api/settings/purge-demo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        addToast('Demo transactions and test orders cleared successfully!', 'success');
        setPurgeModalOpen(false);
        setPurgeConfirmText('');
      } else {
        addToast(data.message || 'Failed to purge demo data', 'error');
      }
    } catch (err) {
      addToast('Error during demo data purge', 'error');
    } finally {
      setPurging(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Store Profile', icon: Building2 },
    { id: 'gst', label: 'Indian GST & Tax', icon: Receipt },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'seo', label: 'SEO & Socials', icon: Globe },
    { id: 'handover', label: 'Launch & Handover', icon: ShieldCheck }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-stone-900">
            Store Settings & Configuration
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Manage Indian business profile, GST rates, payment credentials, shipping thresholds, and handover tools.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-stone-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-maroon-900 text-gold-300 shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General Store Profile */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">Brand & Store Profile</h2>
              <p className="text-xs text-stone-500">Official business information displayed to customers and on invoices.</p>
            </div>
            <button
              onClick={() => handleSave('store_profile', storeProfile, 'Store Profile')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-maroon-900 text-gold-200 text-xs font-bold rounded-xl hover:bg-maroon-800 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Store Name</label>
              <input
                type="text"
                value={storeProfile.store_name}
                onChange={(e) => setStoreProfile({ ...storeProfile, store_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={storeProfile.tagline}
                onChange={(e) => setStoreProfile({ ...storeProfile, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Legal Registered Entity Name</label>
              <input
                type="text"
                value={storeProfile.legal_name}
                onChange={(e) => setStoreProfile({ ...storeProfile, legal_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Customer Support Email</label>
              <input
                type="email"
                value={storeProfile.support_email}
                onChange={(e) => setStoreProfile({ ...storeProfile, support_email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Customer Support Phone</label>
              <input
                type="text"
                value={storeProfile.support_phone}
                onChange={(e) => setStoreProfile({ ...storeProfile, support_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Registered Address</label>
              <input
                type="text"
                value={storeProfile.address}
                onChange={(e) => setStoreProfile({ ...storeProfile, address: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
              <input
                type="text"
                value={storeProfile.city}
                onChange={(e) => setStoreProfile({ ...storeProfile, city: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">State / Province</label>
              <select
                value={storeProfile.state}
                onChange={(e) => setStoreProfile({ ...storeProfile, state: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Indian GST & Tax */}
      {activeTab === 'gst' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">Goods & Services Tax (GST) Settings</h2>
              <p className="text-xs text-stone-500">Configures Intra-state (CGST + SGST) vs Inter-state (IGST) tax calculation rules.</p>
            </div>
            <button
              onClick={() => handleSave('gst_config', gstConfig, 'GST Configuration')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-maroon-900 text-gold-200 text-xs font-bold rounded-xl hover:bg-maroon-800 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save GST Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Company GSTIN Number</label>
              <input
                type="text"
                value={gstConfig.gstin}
                onChange={(e) => setGstConfig({ ...gstConfig, gstin: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono uppercase"
              />
              <p className="text-[10px] text-stone-400 mt-1">15-digit Indian GST Identification Number</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Store Registered Origin State</label>
              <select
                value={gstConfig.state}
                onChange={(e) => setGstConfig({ ...gstConfig, state: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <p className="text-[10px] text-stone-400 mt-1">Used to split CGST+SGST for local orders vs IGST for outer states</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Standard Cosmetics GST Rate (%)</label>
              <input
                type="number"
                value={gstConfig.default_gst_rate}
                onChange={(e) => setGstConfig({ ...gstConfig, default_gst_rate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <p className="text-[10px] text-stone-400 mt-1">Standard cosmetic goods rate in India is 18%</p>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="inclusive"
                checked={gstConfig.is_inclusive}
                onChange={(e) => setGstConfig({ ...gstConfig, is_inclusive: e.target.checked })}
                className="w-4 h-4 text-maroon-900 rounded border-stone-300 focus:ring-gold-400"
              />
              <label htmlFor="inclusive" className="text-xs text-stone-700 font-medium">
                Catalog Prices are GST Inclusive (Recommended for B2C Retail)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Payment Gateway (Razorpay) */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">Razorpay Payment Gateway</h2>
              <p className="text-xs text-stone-500">
                Accept 100% Prepaid Payments via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking.
              </p>
            </div>
            <button
              onClick={() => handleSave('payment_config', paymentConfig, 'Razorpay Settings')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-maroon-900 text-gold-200 text-xs font-bold rounded-xl hover:bg-maroon-800 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Razorpay Settings</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-sky-950 text-xs block">Official Razorpay Integration Ready</span>
                <span className="text-[11px] text-sky-800">
                  Enter your Razorpay Key ID and Key Secret from the Razorpay Dashboard. Supports both Test Mode (<code>rzp_test_...</code>) and Live Mode (<code>rzp_live_...</code>).
                </span>
              </div>
              <span className="bg-sky-200 text-sky-900 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                Razorpay
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Razorpay Key ID <span className="text-maroon-800">*</span>
                </label>
                <input
                  type="text"
                  value={paymentConfig.razorpayKeyId || paymentConfig.payment_key_id || ''}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, razorpayKeyId: e.target.value, payment_key_id: e.target.value })}
                  placeholder="rzp_test_... or rzp_live_..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono"
                />
                <p className="text-[10px] text-stone-400 mt-1">Found in Razorpay Dashboard → Account & Settings → API Keys</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Razorpay Key Secret <span className="text-maroon-800">*</span>
                </label>
                <input
                  type="password"
                  value={paymentConfig.razorpayKeySecret || paymentConfig.payment_secret || ''}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, razorpayKeySecret: e.target.value, payment_secret: e.target.value })}
                  placeholder="Generated Razorpay secret key"
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono"
                />
                <p className="text-[10px] text-stone-400 mt-1">Generated alongside Key ID in your Razorpay Dashboard</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Razorpay Webhook Secret (Optional for Real-time Webhooks)
                </label>
                <input
                  type="password"
                  value={paymentConfig.webhookSecret || paymentConfig.webhook_secret || ''}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, webhookSecret: e.target.value, webhook_secret: e.target.value })}
                  placeholder="Secret entered when creating Razorpay Webhook"
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono"
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  Webhook URL to add in Razorpay Dashboard: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">http://localhost:5000/api/webhooks/incoming/payment-gateway</code>
                </p>
              </div>

              <div className="md:col-span-2 pt-2">
                <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-between text-stone-600 text-xs">
                  <span className="font-bold text-stone-900">Cash on Delivery (COD) Policy:</span>
                  <span className="bg-stone-300 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Permanently Disabled (100% Prepaid Orders Only)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Shipping Settings */}
      {activeTab === 'shipping' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">Shipping & Delivery Rates</h2>
              <p className="text-xs text-stone-500">Configure free shipping cart values, standard shipping fees, and dispatch SLA.</p>
            </div>
            <button
              onClick={() => handleSave('shipping_config', shippingConfig, 'Shipping Configuration')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-maroon-900 text-gold-200 text-xs font-bold rounded-xl hover:bg-maroon-800 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Shipping Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Free Shipping Order Threshold (₹)</label>
              <input
                type="number"
                value={shippingConfig.free_shipping_threshold}
                onChange={(e) => setShippingConfig({ ...shippingConfig, free_shipping_threshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <p className="text-[10px] text-stone-400 mt-1">Orders above this amount get free luxury delivery</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Standard Shipping Charge (₹)</label>
              <input
                type="number"
                value={shippingConfig.standard_shipping_fee}
                onChange={(e) => setShippingConfig({ ...shippingConfig, standard_shipping_fee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <p className="text-[10px] text-stone-400 mt-1">Applied for orders below free shipping threshold</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Default Estimated Dispatch Time (Days)</label>
              <input
                type="number"
                value={shippingConfig.default_dispatch_days}
                onChange={(e) => setShippingConfig({ ...shippingConfig, default_dispatch_days: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: SEO & Socials */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">SEO & Social Links</h2>
              <p className="text-xs text-stone-500">Configure global metadata tags and social profiles.</p>
            </div>
            <button
              onClick={() => handleSave('seo_config', seoConfig, 'SEO Settings')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-maroon-900 text-gold-200 text-xs font-bold rounded-xl hover:bg-maroon-800 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save SEO Settings</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Global Meta Title</label>
              <input
                type="text"
                value={seoConfig.meta_title}
                onChange={(e) => setSeoConfig({ ...seoConfig, meta_title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Global Meta Description</label>
              <textarea
                rows={3}
                value={seoConfig.meta_description}
                onChange={(e) => setSeoConfig({ ...seoConfig, meta_description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={seoConfig.instagram_handle}
                  onChange={(e) => setSeoConfig({ ...seoConfig, instagram_handle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Facebook Page</label>
                <input
                  type="text"
                  value={seoConfig.facebook_handle}
                  onChange={(e) => setSeoConfig({ ...seoConfig, facebook_handle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">YouTube Channel</label>
                <input
                  type="text"
                  value={seoConfig.youtube_handle}
                  onChange={(e) => setSeoConfig({ ...seoConfig, youtube_handle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Launch & Handover Controls */}
      {activeTab === 'handover' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Production Launch & Client Handover Controls</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Actions for preparing the store for real paying customers and final client handover.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Purge Demo Transactions & Test Orders
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Before handing over the store to your client, purge all test orders, test returns, test customer accounts, and temporary audit trails. 
                  This leaves the product catalog, categories, and staff logins completely intact with reset stock.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setPurgeModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 shadow-sm transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Purge Demo Data for Live Launch</span>
              </button>
            </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Launch Readiness Verification
            </h3>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>GST Tax breakdown (CGST/SGST/IGST) configured and active</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Razorpay HMAC-SHA256 signature verification & Mock fallback enabled</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Atomic inventory logging preventing overselling & negative stock</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sensitive product cost prices protected from customer API endpoints</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Purge Demo Modal */}
      {purgeModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-stone-900">Confirm Demo Data Purge</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              This action will permanently delete all test orders, return requests, and test customer accounts.
              Product catalog, categories, and administrator accounts will remain safe.
            </p>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Type <span className="font-mono font-bold text-rose-600">PURGE DEMO DATA</span> to confirm:
              </label>
              <input
                type="text"
                value={purgeConfirmText}
                onChange={(e) => setPurgeConfirmText(e.target.value)}
                placeholder="PURGE DEMO DATA"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => { setPurgeModalOpen(false); setPurgeConfirmText(''); }}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handlePurgeDemoData}
                disabled={purging || purgeConfirmText !== 'PURGE DEMO DATA'}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 disabled:opacity-50 transition"
              >
                {purging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Confirm Purge</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
