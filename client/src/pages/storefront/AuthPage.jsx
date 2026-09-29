import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthPage = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginTab) {
        await login(email, password);
        navigate(from, { replace: true });
      } else {
        await register({ name, email, password, phone });
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Toast notification handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gold-200/80 p-8 sm:p-10 shadow-luxury space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-maroon-900 to-stone-900 border border-gold-400 text-gold-300 flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {isLoginTab ? 'Welcome to Shagun Shine' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-stone-500">
            {isLoginTab ? 'Sign in to access your orders, wishlist, and rewards' : 'Join our royal circle for exclusive offers & gifts'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-ivory-100 rounded-2xl border border-gold-200/50">
          <button
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              isLoginTab ? 'bg-maroon-800 text-gold-100 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              !isLoginTab ? 'bg-maroon-800 text-gold-100 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Ananya Patel"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {!isLoginTab && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Password
              </label>
              {isLoginTab && (
                <span
                  onClick={() => info('Password reset instructions sent to your email!')}
                  className="text-[11px] text-maroon-800 hover:underline cursor-pointer font-semibold"
                >
                  Forgot password?
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-maroon-800 via-maroon-900 to-maroon-800 hover:from-maroon-900 hover:to-stone-950 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : isLoginTab ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </button>
        </form>

        <div className="text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5 pt-2 border-t border-stone-100">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted with 256-bit SSL Security</span>
        </div>
      </div>
    </div>
  );
};
