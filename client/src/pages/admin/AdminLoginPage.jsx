import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      if (['admin', 'super_admin', 'product_manager', 'order_manager'].includes(data.user.role)) {
        navigate(from, { replace: true });
      } else {
        navigate('/');
      }
    } catch (err) {
      // Toast notification handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-maroon-900/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-maroon-900 to-maroon-800 border border-gold-400 text-gold-300 flex items-center justify-center mx-auto shadow-luxury">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-400 block">
            Administrative Portal
          </span>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
            Shagun Shine Console
          </h1>
          <p className="text-xs text-stone-400">
            Sign in with your Super Administrator credentials to manage your store.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-stone-900/90 backdrop-blur-md rounded-3xl border border-gold-500/30 p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-300 block mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your admin email"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-gold-500"
                />
                <Mail className="w-4 h-4 text-gold-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-gold-500"
                />
                <Lock className="w-4 h-4 text-gold-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-stone-400 hover:text-gold-300 transition-colors">
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
