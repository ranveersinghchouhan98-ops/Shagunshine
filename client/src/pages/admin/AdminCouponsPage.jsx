import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, X, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage', 'flat'
  const [discountValue, setDiscountValue] = useState('');
  const [minSpend, setMinSpend] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState('500');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [isActive, setIsActive] = useState(true);

  const { success, error } = useToast();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await api.get('/coupons');
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openAddModal = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('15');
    setMinSpend('999');
    setMaxDiscount('500');
    setUsageLimit('500');
    setExpiryDate('2027-12-31');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_spend: minSpend ? Number(minSpend) : 0,
        max_discount: maxDiscount ? Number(maxDiscount) : null,
        usage_limit: Number(usageLimit || 1000),
        expiry_date: expiryDate,
        is_active: isActive ? 1 : 0
      };

      await api.post('/coupons', payload);
      success('Coupon created successfully!');
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      error(err.message || 'Error creating coupon.');
    }
  };

  const handleDelete = async (id, couponCode) => {
    if (!window.confirm(`Delete coupon "${couponCode}"?`)) return;
    try {
      await api.delete(`/coupons/${id}`);
      success('Coupon deleted.');
      fetchCoupons();
    } catch (err) {
      error(err.message || 'Error deleting coupon.');
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      await api.put(`/coupons/${coupon.id}`, { is_active: coupon.is_active ? 0 : 1 });
      success(`Coupon ${coupon.code} updated.`);
      fetchCoupons();
    } catch (err) {
      error(err.message || 'Error updating coupon.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Promotional Coupons & Discounts ({coupons.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Create promotional codes, set minimum order values, and track redemptions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min. Spend</th>
                <th className="py-3.5 px-4">Max. Discount</th>
                <th className="py-3.5 px-4">Usage Stats</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-maroon-900 text-sm bg-ivory-100 px-2.5 py-1 rounded-md border border-gold-300 inline-block">
                      {c.code}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} FLAT OFF`}
                  </td>

                  <td className="py-3.5 px-4 text-stone-700">
                    {c.min_spend > 0 ? `₹${c.min_spend.toLocaleString()}` : 'None'}
                  </td>

                  <td className="py-3.5 px-4 text-stone-700">
                    {c.max_discount ? `₹${c.max_discount.toLocaleString()}` : 'Unlimited'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-stone-900">{c.times_used}</span>
                    <span className="text-stone-400"> / {c.usage_limit} used</span>
                  </td>

                  <td className="py-3.5 px-4 text-stone-600">
                    {c.expiry_date}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {c.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gold-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">Create Discount Coupon</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. GLOW25"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                    placeholder="20"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Min. Spend (₹)
                  </label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    placeholder="999"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Max. Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="500"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="500"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
