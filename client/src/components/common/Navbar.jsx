import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  Shield,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { SearchModal } from './SearchModal';

const ANNOUNCEMENTS = [
  '✨ FESTIVE OFFER: FLAT 20% OFF WITH CODE: SHINE20',
  '🌸 FREE LUXURY SHIPPING ON ALL ORDERS ABOVE ₹999',
  '🎁 COMPLIMENTARY 24K GOLD ELIXIR SAMPLE ON EVERY ORDER'
];

export const Navbar = () => {
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const { totalItemsCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Rotate announcement bar every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Skincare', path: '/shop?category=skincare' },
    { name: 'Makeup', path: '/shop?category=makeup' },
    { name: 'Haircare', path: '/shop?category=haircare' },
    { name: 'Fragrances', path: '/shop?category=fragrances' },
    { name: 'Gift Sets', path: '/shop?category=combos-gift-sets' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full transition-all">
        {/* Announcement Bar */}
        <div className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-stone-950 text-gold-200 py-1.5 px-4 text-center text-xs tracking-wider font-medium flex items-center justify-center border-b border-gold-500/20">
          <div className="flex items-center gap-2 animate-in fade-in duration-500">
            <span>{ANNOUNCEMENTS[announcementIdx]}</span>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
            isScrolled ? 'border-gold-300/40 shadow-md py-3' : 'border-stone-100 py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-stone-700 hover:text-maroon-900 hover:bg-stone-100"
                aria-label="Open navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Brand Logo */}
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-maroon-900 via-maroon-800 to-stone-900 p-0.5 shadow-md flex items-center justify-center border border-gold-400 group-hover:rotate-6 transition-transform">
                  <Sparkles className="w-5 h-5 text-gold-300" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 leading-none group-hover:text-maroon-800 transition-colors">
                    Shagun Shine
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-gold-700 font-semibold mt-0.5">
                    Cosmetics
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center space-x-7">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-xs uppercase tracking-wider font-semibold transition-colors py-1 relative ${
                        isActive && (link.path === '/' ? location.pathname === '/' : location.pathname + location.search === link.path)
                          ? 'text-maroon-800 font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gold-500'
                          : 'text-stone-600 hover:text-maroon-800'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              {/* Header Right Icons */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search Bar Trigger */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory-100 hover:bg-gold-100/60 border border-gold-200/60 text-stone-600 hover:text-stone-900 transition-all text-xs"
                  aria-label="Open search"
                >
                  <Search className="w-4 h-4 text-gold-700" />
                  <span className="hidden md:inline font-medium text-stone-500">Search beauty...</span>
                </button>

                {/* Wishlist Link */}
                <Link
                  to="/wishlist"
                  className="relative p-2 text-stone-700 hover:text-maroon-800 hover:bg-stone-100 rounded-full transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-maroon-800 text-gold-200 text-[10px] font-bold flex items-center justify-center border border-white shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart Drawer Trigger */}
                <button
                  onClick={openCartDrawer}
                  className="relative p-2 text-stone-700 hover:text-maroon-800 hover:bg-stone-100 rounded-full transition-colors"
                  aria-label="Shopping bag"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalItemsCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-gold-600 text-stone-950 text-[10px] font-bold flex items-center justify-center border border-white shadow-sm animate-pulse">
                      {totalItemsCount}
                    </span>
                  )}
                </button>

                {/* Account / Login Dropdown */}
                <div className="relative">
                  {isAuthenticated ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-stone-100 border border-transparent hover:border-gold-300 transition-all"
                      >
                        <img
                          src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                          alt={user?.name}
                          className="w-7 h-7 rounded-full object-cover border border-gold-400"
                        />
                        <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
                      </button>

                      {/* Dropdown Menu */}
                      {isAccountDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                          <div className="px-4 py-2.5 border-b border-stone-100">
                            <p className="text-xs font-semibold text-stone-900 truncate">{user?.name}</p>
                            <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                            {isStaff && (
                              <span className="inline-block mt-1 bg-maroon-800 text-gold-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                {user?.role.replace('_', ' ')}
                              </span>
                            )}
                          </div>

                          <Link
                            to="/account"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-ivory-100 hover:text-maroon-800"
                          >
                            <User className="w-4 h-4 text-gold-600" />
                            <span>My Profile & Orders</span>
                          </Link>

                          <Link
                            to="/track"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-ivory-100 hover:text-maroon-800"
                          >
                            <Package className="w-4 h-4 text-gold-600" />
                            <span>Track Order</span>
                          </Link>

                          {isStaff && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-maroon-800 bg-blush-50 hover:bg-blush-100"
                            >
                              <Shield className="w-4 h-4 text-maroon-800" />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}

                          <button
                            onClick={logout}
                            className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-stone-100 mt-1"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-semibold tracking-wider transition-colors shadow-sm"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Sign In</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-stone-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
              <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-100">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="p-2 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-maroon-800 hover:bg-ivory-100 rounded-lg"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="pt-2 flex flex-col gap-2 text-xs font-medium text-stone-600">
                <Link to="/track" className="flex items-center gap-2 p-2 hover:bg-ivory-100 rounded-lg">
                  <Package className="w-4 h-4 text-gold-600" />
                  <span>Track Your Order</span>
                </Link>
                <Link to="/contact" className="flex items-center gap-2 p-2 hover:bg-ivory-100 rounded-lg">
                  <Phone className="w-4 h-4 text-gold-600" />
                  <span>Customer Support: +91 9876543210</span>
                </Link>
                {isStaff && (
                  <Link to="/admin" className="flex items-center gap-2 p-2 bg-blush-50 text-maroon-900 font-bold rounded-lg">
                    <Shield className="w-4 h-4 text-maroon-800" />
                    <span>Go to Admin Panel</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
