import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    totalAmount
  } = useCart();

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-end bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={closeCartDrawer} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-ivory-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-maroon-800 text-gold-300 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Your Luxury Bag</h3>
              <p className="text-xs text-stone-500">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCartDrawer}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Highlight */}
        <div className="px-6 py-3 bg-gradient-to-r from-emerald-50 via-gold-50/60 to-ivory-100 border-b border-gold-200/50">
          <div className="flex items-center justify-between text-xs font-medium text-stone-800">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span className="text-emerald-700 font-bold">✨ You have unlocked FREE Express Delivery!</span>
            </span>
            <span className="font-bold text-emerald-700 text-[11px] uppercase tracking-wider bg-emerald-100/60 px-2 py-0.5 rounded-full">Complimentary</span>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-ivory-100 border border-gold-200 flex items-center justify-center mb-4">
                <ShoppingBag className="w-9 h-9 text-gold-600 opacity-60" />
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-800 mb-1">Your bag is empty</h4>
              <p className="text-stone-500 text-xs max-w-xs mb-6">
                Discover our curated collection of radiant serums, velvet lipsticks, and royal fragrances.
              </p>
              <button
                onClick={() => {
                  closeCartDrawer();
                  navigate('/shop');
                }}
                className="px-6 py-2.5 rounded-full bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.productId}-${item.selectedShade}`} className="py-4 flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border border-gold-200/60 shrink-0 cursor-pointer"
                  onClick={() => {
                    closeCartDrawer();
                    navigate(`/product/${item.slug}`);
                  }}
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => {
                          closeCartDrawer();
                          navigate(`/product/${item.slug}`);
                        }}
                        className="text-sm font-medium text-stone-900 leading-snug hover:text-maroon-800 cursor-pointer line-clamp-2"
                      >
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.productId, item.selectedShade)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1 shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.selectedShade && (
                      <div className="flex items-center gap-1.5 mt-1">
                        {item.shadeHex && (
                          <span
                            className="w-3 h-3 rounded-full border border-stone-300"
                            style={{ backgroundColor: item.shadeHex }}
                          />
                        )}
                        <span className="text-[11px] text-stone-500 font-medium">
                          Shade: {item.selectedShade}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedShade, -1)}
                        className="p-1.5 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedShade, 1)}
                        className="p-1.5 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-sm font-bold text-stone-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                      {item.originalPrice > item.price && (
                        <div className="text-[10px] text-stone-400 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="px-6 py-4 border-t border-stone-100 bg-ivory-50/80 space-y-3">
            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-800">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Estimated Total</span>
                <span className="text-maroon-900 font-serif text-base">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-maroon-800 via-maroon-900 to-maroon-800 hover:from-maroon-900 hover:to-maroon-950 text-gold-100 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all tracking-wide"
              >
                <span>Proceed to Luxury Checkout</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </button>

              <button
                onClick={() => {
                  closeCartDrawer();
                  navigate('/cart');
                }}
                className="w-full py-2 text-center text-xs font-semibold text-stone-600 hover:text-maroon-800 underline transition-colors"
              >
                View Full Bag Details
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Authentic & Cruelty-Free • Secure Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
