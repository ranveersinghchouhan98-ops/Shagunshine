import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Edit2, Trash2, X, Sparkles, ArrowRight, Eye } from 'lucide-react';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const AdminBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [ctaText, setCtaText] = useState('Shop Now');
  const [ctaLink, setCtaLink] = useState('/shop');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState('');
  const [position, setPosition] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const { success, error } = useToast();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await api.get('/banners/all');
      if (data.success) {
        setBanners(data.banners);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setTagline('NEW ARRIVALS');
    setCtaText('Explore Collection');
    setCtaLink('/shop');
    setImage('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600');
    setBadge('FLAT 20% OFF WITH CODE: SHINE20');
    setPosition(banners.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setTagline(b.tagline || '');
    setCtaText(b.cta_text || 'Shop Now');
    setCtaLink(b.cta_link || '/shop');
    setImage(b.image);
    setBadge(b.badge || '');
    setPosition(b.position || 1);
    setIsActive(!!b.is_active);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        subtitle,
        tagline,
        cta_text: ctaText,
        cta_link: ctaLink,
        image,
        badge,
        position: Number(position),
        is_active: isActive ? 1 : 0
      };

      if (editingBanner) {
        await api.put(`/banners/${editingBanner.id}`, payload);
        success('Banner updated successfully!');
      } else {
        await api.post('/banners', payload);
        success('Banner created successfully!');
      }

      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      error(err.message || 'Error saving banner.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete banner "${title}"?`)) return;
    try {
      await api.delete(`/banners/${id}`);
      success('Banner deleted.');
      fetchBanners();
    } catch (err) {
      error(err.message || 'Error deleting banner.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Homepage Hero Banners & Slider ({banners.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage promotional hero slides, headlines, discount badges, and CTA links dynamically without modifying code.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-stone-900">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-gold-500 text-stone-950 text-[10px] font-bold px-2.5 py-0.5 rounded shadow">
                    Position #{b.position}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    b.is_active ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-300 text-stone-700'
                  }`}>
                    {b.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="absolute bottom-4 inset-x-4 text-white space-y-1">
                  {b.badge && (
                    <span className="text-[10px] font-bold uppercase text-gold-300 bg-maroon-900/80 px-2 py-0.5 rounded">
                      {b.badge}
                    </span>
                  )}
                  <h3 className="font-serif text-lg font-bold line-clamp-1">{b.title}</h3>
                  <p className="text-xs text-stone-300 line-clamp-2">{b.subtitle}</p>
                </div>
              </div>

              <div className="p-4 text-xs text-stone-600 flex items-center justify-between">
                <span>CTA: <strong>{b.cta_text}</strong> ({b.cta_link})</span>
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50">
              <button
                onClick={() => openEditModal(b)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-maroon-800 hover:bg-stone-200"
                title="Edit Banner"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(b.id, b.title)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-stone-200"
                title="Delete Banner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gold-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingBanner ? 'Edit Hero Banner' : 'Create Hero Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Main Headline *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. The Golden Radiance Collection"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Subtitle Description
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Unlock luminous beauty with Kashmiri saffron & botanicals..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  High-Res Image URL *
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="FLAT 20% OFF WITH CODE: SHINE20"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Slider Order Position
                  </label>
                  <input
                    type="number"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Shop Now"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    CTA Target Link
                  </label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="/shop?category=skincare"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-maroon-800"
                />
                <span>Active on Homepage Carousel</span>
              </label>

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
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
