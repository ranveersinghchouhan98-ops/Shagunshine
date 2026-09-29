import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Eye,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [skinType, setSkinType] = useState('All Skin Types');
  const [images, setImages] = useState(['']);
  const [status, setStatus] = useState('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  // Bulk CSV Upload Modal
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkData, setBulkData] = useState('');

  const { success, error } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/categories')
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSku('SS-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900));
    setCategoryId(categories[0]?.id || '');
    setSubcategory('');
    setPrice('');
    setDiscountPrice('');
    setStockQuantity('30');
    setDescription('');
    setShortDescription('');
    setIngredients('');
    setHowToUse('');
    setSkinType('All Skin Types');
    setImages(['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800']);
    setStatus('active');
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsNewArrival(true);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setSku(product.sku);
    setCategoryId(product.category_id);
    setSubcategory(product.subcategory || '');
    setPrice(product.price);
    setDiscountPrice(product.discount_price || '');
    setStockQuantity(product.stock_quantity);
    setDescription(product.description);
    setShortDescription(product.short_description || '');
    setIngredients(product.ingredients || '');
    setHowToUse(product.how_to_use || '');
    setSkinType(product.skin_type || 'All Skin Types');
    setImages(product.images?.length ? product.images : ['']);
    setStatus(product.status || 'active');
    setIsFeatured(!!product.is_featured);
    setIsBestSeller(!!product.is_best_seller);
    setIsNewArrival(!!product.is_new_arrival);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name,
        sku,
        category_id: categoryId,
        subcategory,
        price: Number(price),
        discount_price: discountPrice ? Number(discountPrice) : null,
        stock_quantity: Number(stockQuantity),
        description,
        short_description: shortDescription,
        ingredients,
        how_to_use: howToUse,
        skin_type: skinType,
        images: images.filter((img) => img.trim()),
        status,
        is_featured: isFeatured ? 1 : 0,
        is_best_seller: isBestSeller ? 1 : 0,
        is_new_arrival: isNewArrival ? 1 : 0
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        success('Product updated successfully!');
      } else {
        await api.post('/products', payload);
        success('Product created successfully!');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      error(err.message || 'Error saving product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      success('Product deleted.');
      fetchData();
    } catch (err) {
      error(err.message || 'Error deleting product.');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(bulkData);
      const res = await api.post('/products/bulk-upload', { items: parsed });
      if (res.success) {
        success(res.message);
        setIsBulkModalOpen(false);
        setBulkData('');
        fetchData();
      }
    } catch (err) {
      error('Invalid JSON format for bulk upload. Please check syntax.');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !selectedCat || p.category_id === selectedCat || p.category_slug === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Product Management ({products.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Add, update, adjust stock levels, and curate cosmetic offerings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-gold-700" />
            <span>Bulk CSV/JSON</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product title or SKU code..."
            className="w-full px-4 py-2 pl-10 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-gold-500 cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product Info</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const image = Array.isArray(p.images) ? p.images[0] : '';
                return (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80'}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-stone-900 text-xs line-clamp-1">{p.name}</h4>
                          <span className="text-[10px] font-mono text-stone-400">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-800">{p.category_name}</span>
                      {p.subcategory && <span className="block text-[10px] text-stone-400">{p.subcategory}</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-serif font-bold text-maroon-900 text-sm">
                        ₹{(p.discount_price || p.price).toLocaleString()}
                      </div>
                      {p.discount_price && (
                        <div className="text-[10px] text-stone-400 line-through">
                          ₹{p.price.toLocaleString()}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        p.stock_quantity <= 10 ? 'text-rose-600' : 'text-stone-800'
                      }`}>
                        {p.stock_quantity <= 10 && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                        <span>{p.stock_quantity} units</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'out_of_stock'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.is_best_seller === 1 && <span className="text-[9px] bg-maroon-800 text-gold-200 font-bold px-1.5 py-0.5 rounded">Best</span>}
                        {p.is_featured === 1 && <span className="text-[9px] bg-gold-200 text-maroon-900 font-bold px-1.5 py-0.5 rounded">Featured</span>}
                        {p.is_new_arrival === 1 && <span className="text-[9px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 rounded">New</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-maroon-800 hover:bg-stone-100 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-stone-100 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gold-200/80 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingProduct ? `Edit: ${editingProduct.name}` : 'Create New Luxury Formulation'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. 24K Gold Radiant Youth Elixir"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">SKU Code *</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                    placeholder="SS-SK-001"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Serums & Elixirs"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">Skin Type</label>
                  <input
                    type="text"
                    value={skinType}
                    onChange={(e) => setSkinType(e.target.value)}
                    placeholder="All Skin Types / Dry / Oily"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">Standard Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="2499"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="1899"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    required
                    placeholder="50"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Image URLs */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Product Image URLs (Unsplash or Local Uploads)
                </label>
                {images.map((img, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => {
                        const copy = [...images];
                        copy[idx] = e.target.value;
                        setImages(copy);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300"
                    />
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="text-stone-400 hover:text-red-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setImages([...images, ''])}
                  className="text-xs font-bold text-maroon-800 hover:underline"
                >
                  + Add Another Image URL
                </button>
              </div>

              {/* Description & Ingredients */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">Ingredients</label>
                  <textarea
                    rows={2}
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="24K Pure Gold Flakes, Kashmiri Saffron, Hyaluronic Acid..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-maroon-800"
                  />
                  <span>Featured Collection</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="accent-maroon-800"
                  />
                  <span>Best Seller Badge</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="accent-maroon-800"
                  />
                  <span>New Arrival Badge</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-200 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV / JSON Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">Bulk Product Upload</h3>
              <button onClick={() => setIsBulkModalOpen(false)} className="text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Paste a JSON array of product objects to import multiple items simultaneously.
            </p>

            <form onSubmit={handleBulkUpload} className="space-y-4">
              <textarea
                rows={8}
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                placeholder={`[
  {
    "name": "Luxury Pearl Facial Serum",
    "price": 1499,
    "stock_quantity": 40,
    "category_id": "cat_skincare",
    "description": "Infused with pearl essence and hyaluronic acid."
  }
]`}
                required
                className="w-full p-3 font-mono text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500 bg-stone-50"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Import Products
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
