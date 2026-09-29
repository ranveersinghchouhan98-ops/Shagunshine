import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, ShieldCheck, Heart, ArrowRight, Share2, Globe, MessageCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { success } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      success('Thank you for subscribing! Check your inbox for exclusive 20% OFF coupon.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-8 border-t border-gold-500/20">
      {/* Brand Perks Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-stone-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-maroon-900/60 border border-gold-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">24K Gold & Ayurvedic Actives</h4>
              <p className="text-xs text-stone-400 mt-0.5">Time-tested royal formulations</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-maroon-900/60 border border-gold-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">100% Clean & Cruelty Free</h4>
              <p className="text-xs text-stone-400 mt-0.5">Dermatologically tested & certified</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-maroon-900/60 border border-gold-500/40 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">Complimentary Shipping</h4>
              <p className="text-xs text-stone-400 mt-0.5">Free luxury delivery above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-maroon-900/60 border border-gold-500/40 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">Effortless Returns</h4>
              <p className="text-xs text-stone-400 mt-0.5">7-day hassle free return promise</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-maroon-800 text-gold-300 flex items-center justify-center border border-gold-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Shagun Shine
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Shagun Shine Cosmetics blends timeless royal Indian botanicals with cutting-edge clean skincare science. Crafted with 24K pure gold, Kashmiri saffron, and cold-pressed botanical essences for your eternal glow.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">
                Join The Royal Beauty Circle
              </h5>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-gold-500"
                />
                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h5 className="font-serif text-white font-bold text-sm mb-4 tracking-wide">
              Beauty Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/shop?category=skincare" className="hover:text-gold-300 transition-colors">
                  Radiant Skincare & Serums
                </Link>
              </li>
              <li>
                <Link to="/shop?category=makeup" className="hover:text-gold-300 transition-colors">
                  Velvet Lipsticks & Highlighters
                </Link>
              </li>
              <li>
                <Link to="/shop?category=haircare" className="hover:text-gold-300 transition-colors">
                  Botanical Haircare Rituals
                </Link>
              </li>
              <li>
                <Link to="/shop?category=fragrances" className="hover:text-gold-300 transition-colors">
                  Artisanal Perfumes & Attars
                </Link>
              </li>
              <li>
                <Link to="/shop?category=combos-gift-sets" className="hover:text-gold-300 transition-colors">
                  Bridal & Festive Gift Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h5 className="font-serif text-white font-bold text-sm mb-4 tracking-wide">
              Customer Experience
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/track" className="hover:text-gold-300 transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-gold-300 transition-colors">
                  My Account & Orders
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-300 transition-colors">
                  Contact & Concierge
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gold-400/80 hover:text-gold-300 transition-colors font-medium">
                  Staff & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies & Contact */}
          <div>
            <h5 className="font-serif text-white font-bold text-sm mb-4 tracking-wide">
              Policies & Legal
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400 mb-4">
              <li>
                <Link to="/return-policy" className="hover:text-gold-300 transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-gold-300 transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-gold-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-gold-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>

            <div className="flex gap-2 text-stone-400 pt-2">
              <a href="#" className="hover:text-gold-400 transition-colors p-2 bg-stone-900 rounded-lg" aria-label="Social">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold-400 transition-colors p-2 bg-stone-900 rounded-lg" aria-label="Global">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold-400 transition-colors p-2 bg-stone-900 rounded-lg" aria-label="Chat">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright and Secure Badges */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Shagun Shine Cosmetics Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>🛡️ 256-Bit SSL Encryption</span>
            <span>💳 UPI • Cards • Net Banking • COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
