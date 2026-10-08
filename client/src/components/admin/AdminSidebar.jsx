import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  Boxes,
  Image,
  UserCheck,
  BarChart3,
  LogOut,
  Sparkles,
  Store,
  X,
  RotateCcw,
  ShieldAlert,
  Settings,
  Receipt
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Store Billing (POS)', path: '/admin/billing', icon: Receipt, badge: 'Retail' },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Returns & Refunds', path: '/admin/returns', icon: RotateCcw },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { name: 'Banners & Hero', path: '/admin/banners', icon: Image },
    { name: 'Staff & Roles', path: '/admin/staff', icon: UserCheck },
    { name: 'Analytics & Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Audit Trail', path: '/admin/audit-logs', icon: ShieldAlert },
    { name: 'Settings & Launch', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-stone-950 text-stone-300 flex flex-col border-r border-gold-500/20 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-800/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-maroon-900 to-maroon-800 border border-gold-400 text-gold-300 flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white tracking-tight block leading-tight">
                Shagun Shine
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold-400 font-bold block">
                Admin Console
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Role Pill */}
        <div className="px-6 py-3 bg-stone-900/60 border-b border-stone-800/50 flex items-center gap-3">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-8 h-8 rounded-full border border-gold-400 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
            <span className="inline-block text-[9px] bg-maroon-800 text-gold-200 font-bold uppercase tracking-wider px-1.5 py-0.2 rounded">
              {user?.role?.replace('_', ' ') || 'Admin'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-maroon-800 to-maroon-900 text-gold-100 font-bold border-l-4 border-gold-400 shadow-md'
                      : 'text-stone-400 hover:bg-stone-900 hover:text-stone-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-gold-400/20 text-gold-300 border border-gold-400/40">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-800/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-gold-300 text-xs font-semibold transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>View Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
