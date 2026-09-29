import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/apiClient';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shagun_token') || null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.warn('Session expired or invalid token:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('shagun_token', data.token);
        setToken(data.token);
        setUser(data.user);
        success(data.message || `Welcome back, ${data.user.name}!`);
        return data;
      }
    } catch (err) {
      error(err.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.post('/auth/register', userData);
      if (data.success) {
        localStorage.setItem('shagun_token', data.token);
        setToken(data.token);
        setUser(data.user);
        success('Registration successful! Welcome to Shagun Shine.');
        return data;
      }
    } catch (err) {
      error(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('shagun_token');
    setToken(null);
    setUser(null);
    setAddresses([]);
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await api.put('/auth/profile', profileData);
      if (data.success) {
        setUser(data.user);
        success('Profile updated successfully!');
      }
    } catch (err) {
      error(err.message || 'Error updating profile.');
      throw err;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const data = await api.put('/auth/change-password', { currentPassword, newPassword });
      if (data.success) {
        success('Password updated successfully!');
      }
    } catch (err) {
      error(err.message || 'Error changing password.');
      throw err;
    }
  };

  const addAddress = async (addressData) => {
    try {
      const data = await api.post('/auth/addresses', addressData);
      if (data.success) {
        setAddresses(data.addresses);
        success('Address saved successfully!');
      }
    } catch (err) {
      error(err.message || 'Failed to save address.');
      throw err;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const data = await api.delete(`/auth/addresses/${addressId}`);
      if (data.success) {
        setAddresses(data.addresses);
        success('Address deleted.');
      }
    } catch (err) {
      error(err.message || 'Failed to delete address.');
      throw err;
    }
  };

  const isAdmin = user && user.role === 'admin';
  const isStaff = user && ['admin', 'product_manager', 'order_manager'].includes(user.role);
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isStaff,
        addresses,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        addAddress,
        deleteAddress,
        refreshProfile: fetchCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
