import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { success } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      success('Thank you for subscribing to Shagun Shine! Welcome to our inner circle.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-8 border-t border-gold-500/20">
      {/* Brand Perks Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 mb-10 border-b border-stone-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-serif text-xs font-semibold text-stone-200 tracking-wide uppercase">Ayurvedic Actives</h4>
              <p className="text-[11px] text-stone-500 mt-0.5 font-light">Time-honored botanical alchemy</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-serif text-xs font-semibold text-stone-200 tracking-wide uppercase">Clean & Ethical</h4>
              <p className="text-[11px] text-stone-500 mt-0.5 font-light">Cruelty-free & dermatologist tested</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-serif text-xs font-semibold text-stone-200 tracking-wide uppercase">White-Glove Shipping</h4>
              <p className="text-[11px] text-stone-500 mt-0.5 font-light">Complimentary on all orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Heart className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <h4 className="font-serif text-xs font-semibold text-stone-200 tracking-wide uppercase">Maison Guarantee</h4>
              <p className="text-[11px] text-stone-500 mt-0.5 font-light">7-day seamless exchange care</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/brand-emblem.jpg"
                alt="Shagun Shine Cosmetics"
                className="w-11 h-11 rounded-full border-2 border-gold-400 object-cover shrink-0 shadow-md"
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-white tracking-tight">
                  Shagune Shine
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-semibold">
                  Cosmetics • Indore
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              Shagune Shine Cosmetics blends royal luxury beauty with clean botanicals. Crafted with pure saffron, rare floral actives, and velvet formulations for your eternal glow.
            </p>

            <div className="pt-1 space-y-1.5 text-xs text-stone-300">
              <div className="flex items-center gap-2 text-gold-300">
                <Phone className="w-3.5 h-3.5 text-maroon-400 shrink-0" />
                <span className="font-semibold">+91 90984 39910</span>
              </div>
              <div className="flex items-start gap-2 text-stone-400 text-[11px] leading-tight">
                <MapPin className="w-3.5 h-3.5 text-maroon-400 shrink-0 mt-0.5" />
                <span>45, Aadharsh Maulik Nagar, near by Hira Nagar Police Station, Sukhliya, Indore</span>
              </div>
            </div>

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
          </div>
        </div>

        {/* Copyright and Secure Badges */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 SHAGUN SHINE COSMETICS (Proprietor: Rajkumar Singh Chouhan). All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>🛡️ 256-Bit SSL Encryption</span>
            <span>💳 UPI • Debit/Credit Cards • Net Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
