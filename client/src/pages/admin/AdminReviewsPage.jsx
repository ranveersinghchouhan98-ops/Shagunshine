import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Check, X, Trash2, Search, Loader2 } from 'lucide-react';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { success, error } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let endpoint = `/reviews/admin/all?`;
      if (statusFilter !== 'All') endpoint += `&status=${statusFilter}`;
      if (search) endpoint += `&search=${encodeURIComponent(search)}`;

      const data = await api.get(endpoint);
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter, search]);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/reviews/${id}/status`, { status });
      if (res.success) {
        success(res.message);
        fetchReviews();
      }
    } catch (err) {
      error(err.message || 'Error updating review.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      success('Review deleted.');
      fetchReviews();
    } catch (err) {
      error(err.message || 'Error deleting review.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Reviews Moderation ({reviews.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Approve, reject, or moderate user reviews and star ratings.
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
            placeholder="Search by product, customer, or comment..."
            className="w-full px-4 py-2 pl-10 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
        </div>

        <div className="flex gap-1.5 w-full sm:w-auto">
          {['All', 'approved', 'pending', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
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

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Review Content</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img src={r.product_image} alt="" className="w-10 h-10 object-cover rounded-lg border border-stone-200" />
                      <span className="font-bold text-stone-900 line-clamp-1 max-w-[150px]">{r.product_name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-stone-900 block">{r.author_name}</span>
                    <span className="text-[10px] text-stone-400">{r.author_email || 'Verified Buyer'}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    {r.title && <strong className="block text-stone-900 font-serif mb-0.5">{r.title}</strong>}
                    <p className="text-stone-600 line-clamp-2 leading-relaxed">{r.comment}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {r.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'approved')}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                        title="Approve Review"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'rejected')}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                        title="Reject Review"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100"
                      title="Delete Review"
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
    </div>
  );
};
