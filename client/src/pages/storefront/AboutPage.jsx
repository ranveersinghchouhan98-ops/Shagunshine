import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award, Leaf, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-16">
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-stone-950 via-maroon-950 to-stone-900 text-white p-8 sm:p-16 border border-gold-500/30 shadow-luxury text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/50 text-gold-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Our Royal Origin</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto leading-tight">
            Reviving Imperial Radiance for the Modern Queen
          </h1>

          <p className="text-stone-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Shagun Shine Cosmetics was born from a timeless vision: to fuse ancient Indian royal beauty rituals, Kashmiri saffron, and pure 24K gold dust with dermatologically proven clean cosmetic science.
          </p>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800">
              The Shagun Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              Pure Ingredients. Royal Efficacy. Zero Compromise.
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              In ancient Indian royal courts, beauty ceremonies were considered sacred acts of wellness. From golden petal infusions to steam-distilled Damask roses, queens and maharanis commanded bespoke beauty formulations that nurtured the spirit as well as the skin.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              At Shagun Shine, we honor that heritage by sourcing certified organic Kashmiri Mongra Saffron, pure 24K gold dust, and therapeutic cold-pressed essential oils. Every creation is 100% cruelty-free, sulfate-free, and formulated without harmful chemicals.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-ivory-100 border border-gold-300/60">
                <div className="font-serif text-2xl font-bold text-maroon-900">100%</div>
                <div className="text-xs text-stone-600 font-semibold mt-0.5">Cruelty-Free & Vegan Friendly</div>
              </div>
              <div className="p-4 rounded-xl bg-ivory-100 border border-gold-300/60">
                <div className="font-serif text-2xl font-bold text-maroon-900">24K</div>
                <div className="text-xs text-stone-600 font-semibold mt-0.5">Certified Pure Gold Dust</div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury border border-gold-300">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop&q=85"
              alt="Shagun Shine Laboratory & Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-ivory-100/70 py-16 border-y border-gold-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800">
              Our Pillars
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
              Crafted with Integrity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gold-200/60 shadow-soft space-y-3">
              <Sparkles className="w-8 h-8 text-gold-600" />
              <h3 className="font-serif text-lg font-bold text-stone-900">Ayurvedic Royalty</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Authentic Kumkumadi Tailam, sandalwood extracts, and saffron sourced directly from heritage farmers across India.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gold-200/60 shadow-soft space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <h3 className="font-serif text-lg font-bold text-stone-900">Clinical Efficacy</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Formulated alongside top cosmetic dermatologists for high bioavailability and visible glow within 14 days.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gold-200/60 shadow-soft space-y-3">
              <Heart className="w-8 h-8 text-rose-600" />
              <h3 className="font-serif text-lg font-bold text-stone-900">Sustainable Luxury</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Recyclable glass flacons, gold foiling, and plastic-neutral packaging practices for our planet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
