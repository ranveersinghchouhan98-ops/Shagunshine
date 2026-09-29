import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/apiClient';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const { success, info, error } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('shagun_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync wishlist from backend when authenticated
  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then((data) => {
          if (data.success && data.wishlist) {
            setWishlist(data.wishlist);
            localStorage.setItem('shagun_wishlist', JSON.stringify(data.wishlist));
          }
        })
        .catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('shagun_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = async (product) => {
    if (!product) return;

    const alreadyIn = isInWishlist(product.id);

    if (token) {
      try {
        const data = await api.post('/auth/wishlist/toggle', { productId: product.id });
        if (data.success) {
          setWishlist(data.wishlist);
          if (data.inWishlist) {
            success(`Added ${product.name} to Wishlist! ❤️`);
          } else {
            info(`Removed from Wishlist.`);
          }
        }
      } catch (err) {
        error(err.message || 'Error updating wishlist.');
      }
    } else {
      // Local storage mode for guest
      if (alreadyIn) {
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        info('Removed from Wishlist.');
      } else {
        setWishlist((prev) => [...prev, product]);
        success(`Added ${product.name} to Wishlist! ❤️`);
      }
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
