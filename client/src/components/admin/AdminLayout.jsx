import React, { useState } from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { Menu, Bell, Store, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout = () => {
  const { user, isStaff, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-gold-400 text-sm">
        Verifying Administrative Credentials...
      </div>
    );
  }

  // Restrict access to admin and staff only
  if (!isStaff) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Generate simple breadcrumbs from path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium capitalize">
              <span>Admin</span>
              {pathSegments.slice(1).map((seg) => (
                <React.Fragment key={seg}>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-bold text-stone-900">{seg.replace('-', ' ')}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ivory-100 hover:bg-gold-100/70 border border-gold-300 text-maroon-900 text-xs font-semibold transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-gold-700" />
              <span>Live Store</span>
            </Link>

            <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                alt=""
                className="w-8 h-8 rounded-full border border-gold-400 object-cover"
              />
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-stone-900 block leading-tight">{user?.name}</span>
                <span className="text-[10px] text-maroon-800 font-bold uppercase tracking-wider block">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
