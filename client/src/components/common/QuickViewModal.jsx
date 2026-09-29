import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, Heart, ShoppingBag, Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedShade, setSelectedShade] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const images = Array.isArray(product.images)
    ? product.images
    : (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : []);

  const shades = Array.isArray(product.shades)
    ? product.shades
    : (typeof product.shades === 'string' ? JSON.parse(product.shades || '[]') : []);

  const benefits = Array.isArray(product.benefits)
    ? product.benefits
    : (typeof product.benefits === 'string' ? JSON.parse(product.benefits || '[]') : []);

  const currentShade = selectedShade || (shades.length > 0 ? shades[0] : null);
  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, currentShade, true);
    onClose();
  };

  const handleViewFullDetails = () => {
    onClose();
    navigate(`/product/${product.slug}`);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Gallery */}
        <div className="p-6 bg-ivory-50 flex flex-col justify-between border-r border-stone-100">
          <div className="relative aspect-square rounded-xl overflow-hidden border border-gold-200/50 bg-white mb-3">
            <img
              src={images[selectedImage] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-maroon-800 text-gold-200 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === idx ? 'border-maroon-800 shadow-sm' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-maroon-700">
                {product.subcategory || product.category_name || 'Luxury Beauty'}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-1.5 rounded-full transition-colors ${
                  inWishlist ? 'text-red-600 bg-red-50' : 'text-stone-400 hover:text-red-500 hover:bg-stone-100'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h3 className="font-serif text-xl font-bold text-stone-900 mt-1 leading-snug">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5) ? 'fill-current text-amber-400' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-800">{product.rating || '5.0'}</span>
              <span className="text-xs text-stone-400">({product.reviews_count || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-bold text-stone-900 font-serif">
                ₹{(product.discount_price || product.price).toLocaleString()}
              </span>
              {product.discount_price && (
                <span className="text-sm text-stone-400 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 leading-relaxed mt-2.5 line-clamp-3">
              {product.short_description || product.description}
            </p>

            {/* Shades selector if available */}
            {shades.length > 0 && (
              <div className="mt-3.5">
                <div className="text-xs font-semibold text-stone-700 mb-2">
                  Select Shade: <span className="font-normal text-maroon-800">{currentShade?.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {shades.map((shade) => (
                    <button
                      key={shade.name}
                      onClick={() => setSelectedShade(shade)}
                      className={`relative w-7 h-7 rounded-full border-2 transition-transform ${
                        currentShade?.name === shade.name
                          ? 'border-maroon-800 scale-110 shadow-md ring-2 ring-gold-400/50'
                          : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: shade.hex }}
                      title={shade.name}
                    >
                      {currentShade?.name === shade.name && (
                        <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key benefits pills */}
            {benefits.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {benefits.slice(0, 3).map((benefit, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] font-medium bg-ivory-100 text-stone-700 border border-gold-200/50 px-2 py-0.5 rounded-md"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-gold-600" />
                    {benefit}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-stone-300 rounded-xl px-2 py-1 bg-stone-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2 py-1 text-stone-600 hover:text-stone-900 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  className="px-2 py-1 text-stone-600 hover:text-stone-900 text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-maroon-800 to-maroon-900 hover:from-maroon-900 hover:to-stone-950 text-gold-100 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-gold-400" />
                <span>{product.stock_quantity > 0 ? 'Add to Luxury Bag' : 'Out of Stock'}</span>
              </button>
            </div>

            <button
              onClick={handleViewFullDetails}
              className="w-full text-center text-xs font-semibold text-stone-600 hover:text-maroon-800 flex items-center justify-center gap-1 py-1 transition-colors"
            >
              <span>View Full Ingredients & Routine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
