import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
  Search,
  Grid3X3,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import api from '../../api/apiClient';
import { ProductCard } from '../../components/common/ProductCard';
import { QuickViewModal } from '../../components/common/QuickViewModal';

const SKIN_TYPES = ['All Skin Types', 'Oily', 'Dry', 'Sensitive', 'Combination'];

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || '');
  const [selectedSkinType, setSelectedSkinType] = useState(searchParams.get('skinType') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '10000');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popularity');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [gridCols, setGridCols] = useState(3); // 3 or 4 cols on desktop

  // Fetch Categories once
  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        if (res.success) setCategories(res.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSubcategory) params.subcategory = selectedSubcategory;
    if (selectedSkinType && selectedSkinType !== 'All Skin Types') params.skinType = selectedSkinType;
    if (maxPrice && maxPrice !== '10000') params.maxPrice = maxPrice;
    if (sort && sort !== 'popularity') params.sort = sort;
    if (search) params.search = search;
    if (page > 1) params.page = page;

    setSearchParams(params);
  }, [selectedCategory, selectedSubcategory, selectedSkinType, maxPrice, sort, search, page]);

  // Sync state if URL param changes directly (e.g. from navbar click)
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const q = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearch(q);
  }, [searchParams]);

  // Fetch Products based on current active filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let endpoint = `/products?page=${page}&limit=12&sort=${sort}`;
        if (selectedCategory) endpoint += `&category=${encodeURIComponent(selectedCategory)}`;
        if (selectedSubcategory) endpoint += `&subcategory=${encodeURIComponent(selectedSubcategory)}`;
        if (selectedSkinType && selectedSkinType !== 'All Skin Types') endpoint += `&skinType=${encodeURIComponent(selectedSkinType)}`;
        if (maxPrice && Number(maxPrice) < 10000) endpoint += `&maxPrice=${maxPrice}`;
        if (search) endpoint += `&search=${encodeURIComponent(search)}`;

        const data = await api.get(endpoint);
        if (data.success) {
          setProducts(data.products);
          setTotalCount(data.total);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error('Fetch shop products error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubcategory, selectedSkinType, maxPrice, sort, search, page]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedSkinType('');
    setMaxPrice('10000');
    setSearch('');
    setSort('popularity');
    setPage(1);
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 border-b border-stone-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800 mb-1">
              Shagun Shine Catalog
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              {activeCategoryObj ? activeCategoryObj.name : search ? `Search: "${search}"` : 'All Formulations'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
              {activeCategoryObj
                ? activeCategoryObj.description
                : 'Indulge in pure 24K gold elixirs, velvet lipsticks, Ayurvedic hair rituals, and royal French-Indian perfumery.'}
            </p>
          </div>

          {/* Desktop Controls (Grid toggle & Sort) */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-800 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-maroon-800" />
              <span>Filters</span>
            </button>

            {/* Grid Column Selector (Desktop) */}
            <div className="hidden sm:flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white p-0.5">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 transition-colors ${gridCols === 3 ? 'bg-maroon-800 text-white' : 'text-stone-500 hover:text-stone-900'}`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2 transition-colors ${gridCols === 4 ? 'bg-maroon-800 text-white' : 'text-stone-500 hover:text-stone-900'}`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-white border border-stone-300 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-stone-800 focus:outline-none focus:border-gold-500 shadow-sm cursor-pointer"
              >
                <option value="popularity">Sort By: Popularity</option>
                <option value="rating">Sort By: Top Rated</option>
                <option value="newest">Sort By: Newest Arrivals</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedCategory || selectedSubcategory || selectedSkinType || search || maxPrice < 10000) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-stone-100">
            <span className="text-xs text-stone-500 font-medium">Active filters:</span>

            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory-100 border border-gold-300 text-xs font-semibold text-maroon-900">
                Category: {activeCategoryObj?.name || selectedCategory}
                <button onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); }} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSubcategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory-100 border border-gold-300 text-xs font-semibold text-maroon-900">
                Subcategory: {selectedSubcategory}
                <button onClick={() => setSelectedSubcategory('')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSkinType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory-100 border border-gold-300 text-xs font-semibold text-maroon-900">
                Skin: {selectedSkinType}
                <button onClick={() => setSelectedSkinType('')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {Number(maxPrice) < 10000 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory-100 border border-gold-300 text-xs font-semibold text-maroon-900">
                Under ₹{Number(maxPrice).toLocaleString()}
                <button onClick={() => setMaxPrice('10000')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory-100 border border-gold-300 text-xs font-semibold text-maroon-900">
                "{search}"
                <button onClick={() => setSearch('')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-red-600 hover:text-red-800 underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold-600" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-stone-400 hover:text-maroon-800 font-semibold transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Search within catalog */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Product name or keyword..."
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-gold-500 bg-stone-50"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2.5">
              Category
            </label>
            <div className="space-y-1.5">
              <button
                onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-between items-center ${
                  !selectedCategory ? 'bg-maroon-800 text-gold-100 font-bold' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>All Categories</span>
                <span>{categories.reduce((a, b) => a + (b.product_count || 0), 0)}</span>
              </button>
              {categories.map((cat) => (
                <div key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setSelectedSubcategory('');
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-between items-center ${
                      selectedCategory === cat.slug || selectedCategory === cat.id
                        ? 'bg-maroon-800 text-gold-100 font-bold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-75">({cat.product_count})</span>
                  </button>

                  {/* Subcategories accordion when category is selected */}
                  {(selectedCategory === cat.slug || selectedCategory === cat.id) && cat.subcategories?.length > 0 && (
                    <div className="pl-4 py-1.5 space-y-1">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? '' : sub)}
                          className={`w-full text-left px-2.5 py-1 rounded text-[11px] transition-colors ${
                            selectedSubcategory === sub
                              ? 'text-maroon-900 font-bold bg-gold-100/70'
                              : 'text-stone-500 hover:text-stone-900'
                          }`}
                        >
                          • {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Max Price
              </label>
              <span className="text-xs font-serif font-bold text-maroon-900">
                ₹{Number(maxPrice).toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-maroon-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>₹500</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* Skin Type Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2.5">
              Skin Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SKIN_TYPES.map((skin) => (
                <button
                  key={skin}
                  onClick={() => setSelectedSkinType(selectedSkinType === skin ? '' : skin)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                    selectedSkinType === skin
                      ? 'bg-gold-500 text-stone-950 font-bold border-gold-600 shadow-sm'
                      : 'border-stone-200 text-stone-600 hover:border-gold-300 bg-white'
                  }`}
                >
                  {skin}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer Overlay */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[120] flex justify-end bg-stone-950/60 backdrop-blur-sm lg:hidden animate-in fade-in">
            <div className="absolute inset-0" onClick={() => setIsMobileFilterOpen(false)} />
            <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="font-serif font-bold text-lg text-stone-900">Filter Formulations</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-stone-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile filter elements */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">Category</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${!selectedCategory ? 'bg-maroon-800 text-white font-bold' : 'text-stone-700'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${selectedCategory === c.slug ? 'bg-maroon-800 text-white font-bold' : 'text-stone-700'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                  Max Price: ₹{Number(maxPrice).toLocaleString()}
                </label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full accent-maroon-800"
                />
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-maroon-800 text-gold-100 text-xs font-bold"
                >
                  Apply ({totalCount})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Catalog Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-gold-600 animate-spin mb-3" />
              <p className="text-xs font-medium text-stone-500">Unveiling luxury products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="min-h-[380px] bg-white rounded-2xl border border-stone-200 p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-ivory-100 flex items-center justify-center mb-4 text-gold-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">No matching products found</h3>
              <p className="text-xs text-stone-500 max-w-sm mb-6">
                Try adjusting your filters, price range, or searching with another keyword.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-maroon-800 text-gold-100 text-xs font-semibold uppercase tracking-wider shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-4 px-1">
                <span>Showing <strong>{products.length}</strong> of <strong>{totalCount}</strong> luxury creations</span>
              </div>

              <div
                className={`grid gap-4 sm:gap-6 ${
                  gridCols === 4
                    ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        page === i + 1
                          ? 'bg-maroon-800 text-gold-100 shadow-md'
                          : 'bg-white border border-stone-200 text-stone-700 hover:border-gold-400'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
