import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gift,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    totalAmount
  } = useCart();

  const [giftWrap, setGiftWrap] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-ivory-100 border border-gold-300 flex items-center justify-center mx-auto text-gold-600">
          <ShoppingBag className="w-12 h-12 opacity-60" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900">Your Luxury Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Explore our glowing serums, velvet lipsticks, royal perfumes, and artisanal bridal gift boxes.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
        >
          <span>Discover Beauty Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800">
            Shopping Bag ({cartItems.length})
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">Review Your Selections</h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-red-600 font-semibold underline self-start sm:self-auto"
        >
          Clear Entire Bag
        </button>
      </div>

      {/* Free Shipping Highlight */}
      <div className="bg-gradient-to-r from-emerald-50 via-gold-50/60 to-ivory-100 border border-gold-200/80 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span className="text-emerald-700 font-bold">✨ You have unlocked FREE Express Luxury Shipping on all orders!</span>
          </span>
          <span className="font-bold text-emerald-700 text-xs uppercase tracking-wider bg-emerald-100/70 px-3 py-1 rounded-full">Pan-India Free</span>
        </div>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm divide-y divide-stone-100 space-y-4">
          {cartItems.map((item) => (
            <div key={`${item.productId}-${item.selectedShade}`} className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gold-200/60 shrink-0 cursor-pointer"
                  onClick={() => navigate(`/product/${item.slug}`)}
                />
                <div>
                  <h3
                    onClick={() => navigate(`/product/${item.slug}`)}
                    className="font-serif text-sm sm:text-base font-bold text-stone-900 hover:text-maroon-800 cursor-pointer leading-snug"
                  >
                    {item.name}
                  </h3>
                  <div className="text-[11px] text-stone-400 font-mono mt-0.5">SKU: {item.sku}</div>

                  {item.selectedShade && (
                    <div className="flex items-center gap-1.5 mt-1">
                      {item.shadeHex && (
                        <span
                          className="w-3 h-3 rounded-full border border-stone-300"
                          style={{ backgroundColor: item.shadeHex }}
                        />
                      )}
                      <span className="text-xs text-stone-600 font-medium">
                        Shade: {item.selectedShade}
                      </span>
                    </div>
                  )}

                  <div className="text-xs font-bold text-stone-900 mt-1 sm:hidden">
                    ₹{item.price.toLocaleString()} each
                  </div>
                </div>
              </div>

              {/* Quantity & Item Total */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 rounded-xl px-2 py-1 bg-stone-50">
                  <button
                    onClick={() => updateQuantity(item.productId, item.selectedShade, -1)}
                    className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.selectedShade, 1)}
                    className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Total Price */}
                <div className="text-right min-w-[90px]">
                  <div className="font-serif text-base font-bold text-stone-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                  {item.originalPrice > item.price && (
                    <div className="text-[10px] text-stone-400 line-through">
                      ₹{(item.originalPrice * item.quantity).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeFromCart(item.productId, item.selectedShade)}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Complimentary Gift Wrap & Notes option */}
          <div className="pt-6 border-t border-stone-200 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="w-4 h-4 accent-maroon-800 rounded"
              />
              <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-gold-600" />
                Add complimentary luxury gold-ribbon gift box & handwritten message
              </span>
            </label>

            {giftWrap && (
              <textarea
                rows={2}
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Write your custom gift message (e.g. Happy Birthday Dearest Priya!)..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500 bg-stone-50"
              />
            )}
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gold-200/60 p-6 shadow-soft space-y-6 sticky top-24">
          <h3 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-200">
            Order Summary
          </h3>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
            <div className="flex justify-between">
              <span>Bag Subtotal</span>
              <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase tracking-wider">FREE</span>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
              <span>Total Payable</span>
              <span className="font-serif text-2xl text-maroon-900">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-maroon-800 via-maroon-900 to-maroon-800 hover:from-maroon-900 hover:to-stone-950 text-gold-100 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Luxury Checkout</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </button>

          <Link
            to="/shop"
            className="flex items-center justify-center gap-1.5 text-xs text-stone-500 hover:text-maroon-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>

          <div className="pt-2 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5 border-t border-stone-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit SSL Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
