import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../../components/common/ProductCard';

export const WishlistPage = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, 1, item.shades?.length > 0 ? item.shades[0] : null, false);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800">
            Curated Favorites
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            My Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddAllToCart}
              className="px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag</span>
            </button>
            <button
              onClick={clearWishlist}
              className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-white text-xs font-semibold text-stone-600"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="w-20 h-20 rounded-full bg-ivory-100 border border-gold-300 flex items-center justify-center mx-auto text-maroon-800">
            <Heart className="w-10 h-10 opacity-60" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">Your Wishlist is Empty</h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            Save your beloved skincare serums, velvet lipsticks, and royal fragrances while exploring.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
