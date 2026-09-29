import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [subcategoriesStr, setSubcategoriesStr] = useState('');
  const [isActive, setIsActive] = useState(true);

  const { success, error } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.get('/categories/all');
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800');
    setSubcategoriesStr('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setSubcategoriesStr(Array.isArray(cat.subcategories) ? cat.subcategories.join(', ') : '');
    setIsActive(!!cat.is_active);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subcategories = subcategoriesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name,
        description,
        image,
        subcategories,
        is_active: isActive ? 1 : 0
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, payload);
        success('Category updated successfully!');
      } else {
        await api.post('/categories', payload);
        success('Category created successfully!');
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      error(err.message || 'Error saving category.');
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      success('Category removed.');
      fetchCategories();
    } catch (err) {
      error(err.message || 'Error deleting category.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Category & Subcategory Hierarchy ({categories.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize catalog classifications, banner images, and store sub-menus.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-ivory-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    cat.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-stone-900">{cat.name}</h3>
                  <span className="text-xs font-semibold text-maroon-800 bg-ivory-100 px-2.5 py-0.5 rounded-md border border-gold-300">
                    {cat.product_count} Products
                  </span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>

                {cat.subcategories?.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-stone-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Subcategories:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cat.subcategories.map((sub) => (
                        <span
                          key={sub}
                          className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 flex items-center justify-end gap-2 bg-stone-50/50">
              <button
                onClick={() => openEditModal(cat)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-maroon-800 hover:bg-stone-200 transition-colors"
                title="Edit Category"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-stone-200 transition-colors"
                title="Delete Category"
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
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Skincare"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Subcategories (Comma separated)
                </label>
                <input
                  type="text"
                  value={subcategoriesStr}
                  onChange={(e) => setSubcategoriesStr(e.target.value)}
                  placeholder="Serums, Moisturizers, Cleansers, Face Masks"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of category highlights..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-maroon-800"
                />
                <span>Active on storefront navigation</span>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
