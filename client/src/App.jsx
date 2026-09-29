import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Storefront Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';

// Storefront Pages
import { HomePage } from './pages/storefront/HomePage';
import { ShopPage } from './pages/storefront/ShopPage';
import { ProductDetailPage } from './pages/storefront/ProductDetailPage';
import { CartPage } from './pages/storefront/CartPage';
import { CheckoutPage } from './pages/storefront/CheckoutPage';
import { MyAccountPage } from './pages/storefront/MyAccountPage';
import { OrderTrackingPage } from './pages/storefront/OrderTrackingPage';
import { WishlistPage } from './pages/storefront/WishlistPage';
import { AuthPage } from './pages/storefront/AuthPage';
import { AboutPage } from './pages/storefront/AboutPage';
import { ContactPage } from './pages/storefront/ContactPage';
import { FAQPage } from './pages/storefront/FAQPage';
import {
  ReturnPolicyPage,
  ShippingPolicyPage,
  PrivacyPolicyPage,
  TermsConditionsPage
} from './pages/storefront/PolicyPages';
import { NotFoundPage } from './pages/storefront/NotFoundPage';

// Admin Components & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminReturnsPage } from './pages/admin/AdminReturnsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminStaffPage } from './pages/admin/AdminStaffPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Storefront Layout Wrapper
const StorefrontLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                {/* Storefront Routes */}
                <Route element={<StorefrontLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/account" element={<MyAccountPage />} />
                  <Route path="/track" element={<OrderTrackingPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/return-policy" element={<ReturnPolicyPage />} />
                  <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-conditions" element={<TermsConditionsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Admin Authentication Route */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Protected Admin Console Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="returns" element={<AdminReturnsPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="inventory" element={<AdminInventoryPage />} />
                  <Route path="banners" element={<AdminBannersPage />} />
                  <Route path="staff" element={<AdminStaffPage />} />
                  <Route path="reports" element={<AdminReportsPage />} />
                  <Route path="audit-logs" element={<AdminAuditLogsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>
              </Routes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
