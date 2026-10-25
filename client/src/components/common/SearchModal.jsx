import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../api/apiClient';

const TRENDING_SEARCHES = [
  'Radiant Saffron Youth Serum',
  'Royal Silk Lipstick',
  'Kumkumadi Night Cream',
  'Bridal Radiance Box',
  'Dewy Velvet SPF 50',
  'Noor-e-Gulab Perfume'
];

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSuggestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.get(`/products/search/suggestions?q=${encodeURIComponent(query)}`);
        if (data.success) {
          setSuggestions(data.suggestions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleSelectProduct = (slug) => {
    navigate(`/product/${slug}`);
    onClose();
  };

  const handleTrendingClick = (keyword) => {
    navigate(`/shop?search=${encodeURIComponent(keyword)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gold-200/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-stone-200 px-5 py-4">
          <Search className="w-5 h-5 text-gold-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search serums, lipsticks, perfumes, gift sets..."
            className="w-full px-4 text-base text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none"
          />
          {loading && <Loader2 className="w-5 h-5 text-gold-500 animate-spin shrink-0 mr-2" />}
          {query && !loading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-maroon-800 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-md transition-colors"
          >
            ESC
          </button>
        </form>

        {/* Modal Body */}
        <div className="max-h-[65vh] overflow-y-auto p-5">
          {/* Real-time Search Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-gold-700 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Matching Luxury Products
              </div>
              <div className="divide-y divide-stone-100">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectProduct(item.slug)}
                    className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-ivory-100 cursor-pointer transition-colors group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg border border-gold-200/60 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-medium text-maroon-700 uppercase tracking-wider">
                        {item.category_name}
                      </span>
                      <h4 className="text-sm font-medium text-stone-900 truncate group-hover:text-maroon-800 transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-bold text-stone-900">
                          ₹{(item.discount_price || item.price).toLocaleString()}
                        </span>
                        {item.discount_price && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{item.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-gold-600 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {query.trim() && !loading && suggestions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-stone-500 text-sm">No products found for "{query}".</p>
              <button
                onClick={handleSearchSubmit}
                className="mt-3 text-sm font-semibold text-maroon-800 hover:text-gold-700 underline"
              >
                Browse all products in store
              </button>
            </div>
          )}

          {/* Trending Searches when input is empty */}
          {!query.trim() && (
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-stone-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleTrendingClick(keyword)}
                    className="text-xs font-medium text-stone-700 bg-ivory-100 hover:bg-gold-100 hover:text-maroon-900 border border-gold-200/50 px-3 py-1.5 rounded-full transition-all"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
