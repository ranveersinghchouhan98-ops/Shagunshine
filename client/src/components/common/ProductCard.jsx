import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!product) return null;

  const images = Array.isArray(product.images)
    ? product.images
    : (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : []);

  const shades = Array.isArray(product.shades)
    ? product.shades
    : (typeof product.shades === 'string' ? JSON.parse(product.shades || '[]') : []);

  const primaryImage = images[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600';
  const secondaryImage = images[1] || primaryImage;

  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, shades.length > 0 ? shades[0] : null, true);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-2xl border border-stone-200/70 hover:border-gold-300 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Badges & Hover Actions */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory-100">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_best_seller === 1 && (
            <span className="inline-flex items-center gap-1 bg-maroon-900 text-gold-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
              <Sparkles className="w-2.5 h-2.5" />
              Best Seller
            </span>
          )}
          {product.is_new_arrival === 1 && (
            <span className="bg-gold-500 text-stone-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
            inWishlist
              ? 'bg-white text-red-600'
              : 'bg-white/80 hover:bg-white text-stone-600 hover:text-red-500 backdrop-blur-sm'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button (desktop hover) */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:flex gap-2">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/95 hover:bg-white text-stone-900 text-xs font-semibold tracking-wider uppercase shadow-lg flex items-center justify-center gap-1.5 backdrop-blur-sm border border-stone-200 hover:border-gold-400 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-gold-700" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category / Subcategory */}
          <div className="text-[11px] font-medium tracking-wider uppercase text-maroon-700 mb-1">
            {product.subcategory || product.category_name || 'Cosmetics'}
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-serif text-sm sm:text-base font-semibold text-stone-900 hover:text-maroon-800 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-stone-800">{product.rating || '5.0'}</span>
            <span className="text-[11px] text-stone-400">({product.reviews_count || 0})</span>
          </div>

          {/* Shade previews if available */}
          {shades.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {shades.slice(0, 4).map((shade, idx) => (
                <span
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-sm ring-1 ring-stone-200"
                  style={{ backgroundColor: shade.hex }}
                  title={shade.name}
                />
              ))}
              {shades.length > 4 && (
                <span className="text-[10px] font-medium text-stone-400">
                  +{shades.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                ₹{(product.discount_price || product.price).toLocaleString()}
              </span>
              {product.discount_price && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock_quantity <= 0}
            className="p-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-200 hover:text-white transition-all shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed group/btn"
            title={product.stock_quantity > 0 ? 'Add to bag' : 'Out of stock'}
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
