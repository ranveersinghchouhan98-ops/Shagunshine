import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/apiClient';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shagun_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('shagun_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { success, error, info } = useToast();

  useEffect(() => {
    localStorage.setItem('shagun_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('shagun_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('shagun_coupon');
    }
  }, [coupon]);

  const addToCart = (product, quantity = 1, selectedShade = null, openDrawer = true) => {
    if (!product || product.stock_quantity <= 0) {
      error('Sorry, this product is currently out of stock.');
      return;
    }

    const price = product.discount_price || product.price;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === product.id && item.selectedShade === (selectedShade?.name || selectedShade || null)
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock_quantity) {
          error(`Only ${product.stock_quantity} units available in stock.`);
          return prevItems;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        const primaryImage = Array.isArray(product.images) ? product.images[0] : (typeof product.images === 'string' ? JSON.parse(product.images || '[]')[0] : '');
        return [
          ...prevItems,
          {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            price: price,
            originalPrice: product.price,
            image: primaryImage || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
            stockQuantity: product.stock_quantity,
            selectedShade: selectedShade?.name || selectedShade || null,
            shadeHex: selectedShade?.hex || null,
            quantity: Math.min(quantity, product.stock_quantity)
          }
        ];
      }
    });

    success(`Added ${product.name} to your luxury bag!`);
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const updateQuantity = (productId, selectedShade, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.productId === productId && item.selectedShade === (selectedShade || null)) {
            const newQty = item.quantity + delta;
            if (newQty > item.stockQuantity) {
              info(`Maximum available stock reached (${item.stockQuantity})`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId, selectedShade) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.productId === productId && item.selectedShade === (selectedShade || null))
      )
    );
    info('Item removed from bag.');
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.discountType === 'percentage') {
      let disc = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && disc > coupon.maxDiscount) {
        disc = coupon.maxDiscount;
      }
      discountAmount = disc;
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }
  }

  // Free shipping threshold ₹999
  const FREE_SHIPPING_THRESHOLD = 999;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingFee = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      error('Please enter a coupon code.');
      return false;
    }

    try {
      const data = await api.post('/coupons/validate', { code: code.trim(), cartTotal: subtotal });
      if (data.success) {
        setCoupon(data.coupon);
        success(data.message);
        // Fire celebration confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#8B1E3B', '#F5EED9']
        });
        return true;
      }
    } catch (err) {
      error(err.message || 'Invalid coupon code.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    info('Coupon removed.');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        freeShippingRemaining,
        FREE_SHIPPING_THRESHOLD,
        coupon,
        isCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
