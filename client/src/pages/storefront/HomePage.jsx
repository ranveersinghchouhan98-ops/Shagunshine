import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Award,
  Leaf,
  Heart,
  Truck,
  CheckCircle2,
  Camera
} from 'lucide-react';
import api from '../../api/apiClient';
import { ProductCard } from '../../components/common/ProductCard';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { useToast } from '../../context/ToastContext';

export const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('bestsellers');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { success } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, catRes, featuredRes, bestRes, newRes] = await Promise.all([
          api.get('/banners'),
          api.get('/categories'),
          api.get('/products?featured=true&limit=8'),
          api.get('/products?bestSeller=true&limit=8'),
          api.get('/products?newArrival=true&limit=8')
        ]);

        if (bannerRes.success) setBanners(bannerRes.banners);
        if (catRes.success) setCategories(catRes.categories);
        if (featuredRes.success) setFeaturedProducts(featuredRes.products);
        if (bestRes.success) setBestSellers(bestRes.products);
        if (newRes.success) setNewArrivals(newRes.products);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-advance banner
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const testimonials = [
    {
      name: 'Dr. Radhika Sen',
      role: 'Dermatologist & Skincare Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment:
        'The Radiant Youth Serum has transformed my daily skincare routine. It provides an ethereal glow without any greasy feeling. True luxury craftsmanship!'
    },
    {
      name: 'Natasha Singhania',
      role: 'Fashion & Bridal Stylist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment:
        'I recommend Shagun Shine’s Sindoor Red Lipstick and Maharani Eyeshadow to all my brides. The pigments are exceptionally vibrant and stay immaculate all evening!'
    },
    {
      name: 'Simran Kaur',
      role: 'Verified Buyer, Delhi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment:
        'Noor-e-Gulab perfume is pure romance in a bottle. The packaging feels like opening an imperial jewelry box. Fast delivery and pristine presentation.'
    }
  ];

  return (
    <div className="space-y-10 sm:space-y-14 pb-16">
      {/* 1. Hero Banner Carousel */}
      {banners.length > 0 && (
        <section className="relative overflow-hidden bg-stone-900">
          <div className="relative min-h-[500px] sm:min-h-[620px] flex items-center">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center ${
                  currentBanner === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image with luxury dark gradient */}
                <div className="absolute inset-0">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.75]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-maroon-950/70 to-transparent" />
                </div>

                {/* Banner Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                  <div className="max-w-xl space-y-4 sm:space-y-6 text-white animate-in fade-in slide-in-from-left duration-700">
                    {banner.badge && (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/50 text-gold-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                        <span>{banner.badge}</span>
                      </div>
                    )}

                    {banner.tagline && (
                      <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-gold-400">
                        {banner.tagline}
                      </p>
                    )}

                    <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white drop-shadow-md">
                      {banner.title}
                    </h1>

                    <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-md">
                      {banner.subtitle}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-4">
                      <Link
                        to={banner.cta_link || '/shop'}
                        className="px-7 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-glow transition-all flex items-center gap-2"
                      >
                        <span>{banner.cta_text || 'Explore Collection'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        to="/shop"
                        className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider backdrop-blur-sm border border-white/20 transition-colors"
                      >
                        View Catalog
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Navigation Arrows */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-4 z-20 p-2.5 rounded-full bg-stone-900/50 hover:bg-stone-900/80 text-white backdrop-blur-sm border border-white/20 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                  className="absolute right-4 z-20 p-2.5 rounded-full bg-stone-900/50 hover:bg-stone-900/80 text-white backdrop-blur-sm border border-white/20 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentBanner(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentBanner === idx ? 'w-8 bg-gold-400' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* 2. Brand Assurance Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-soft">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y lg:divide-y-0 lg:divide-x divide-stone-200/70 text-center">
            <div className="flex items-center justify-center gap-3 px-3 py-1">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-semibold tracking-wide text-stone-900 uppercase">Botanical Actives</h4>
                <p className="text-[11px] text-stone-500 font-light">Ayurvedic radiance serums</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 px-3 py-1 pt-3 lg:pt-1">
              <Leaf className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-semibold tracking-wide text-stone-900 uppercase">Clean & Ethical</h4>
                <p className="text-[11px] text-stone-500 font-light">100% cruelty & paraben free</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 px-3 py-1 pt-3 lg:pt-1">
              <Truck className="w-4 h-4 text-stone-700 shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-semibold tracking-wide text-stone-900 uppercase">White Glove Delivery</h4>
                <p className="text-[11px] text-stone-500 font-light">Complimentary on all orders</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 px-3 py-1 pt-3 lg:pt-1">
              <Award className="w-4 h-4 text-amber-700 shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-semibold tracking-wide text-stone-900 uppercase">Dermatologist Tested</h4>
                <p className="text-[11px] text-stone-500 font-light">Formulated for sensitive skin</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800">
            Curated Formulations
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">
            Shop By Luxury Ritual
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gold-200/40 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-ivory-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-3 inset-x-3 text-center">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-gold-200/90 font-medium">
                    {cat.product_count} Creations
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Best Sellers & New Arrivals Tabbed Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800">
              Most Adored
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Treasured By Thousands
            </h2>
          </div>

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-ivory-100 rounded-full border border-gold-200/60">
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'bestsellers'
                  ? 'bg-maroon-800 text-gold-100 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('newarrivals')}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'newarrivals'
                  ? 'bg-maroon-800 text-gold-100 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'featured'
                  ? 'bg-maroon-800 text-gold-100 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Featured
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(activeTab === 'bestsellers'
            ? bestSellers
            : activeTab === 'newarrivals'
            ? newArrivals
            : featuredProducts
          ).map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-maroon-800 hover:bg-maroon-800 text-maroon-800 hover:text-gold-100 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <span>Explore All 20+ Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. Imperial Bridal & Festive Collection Feature (Split Promo) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-950 via-maroon-950 to-stone-900 text-white border border-gold-500/30 shadow-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-12 lg:p-16 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800/80 border border-stone-700 text-amber-200 text-[10px] font-semibold uppercase tracking-[0.25em]">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>The Imperial Bridal Trunk</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-stone-100">
                Gift The Eternal Glow of Royalty
              </h2>

              <p className="text-stone-300 text-sm leading-relaxed font-light">
                Encased in a hand-crafted velvet keepsake trunk adorned with gold foiling. Includes our signature Radiant Saffron Serum, Kumkumadi Miracle Night Cream, Royal Velvet Sindoor Lipstick, and Noor-e-Gulab Perfume.
              </p>

              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl sm:text-4xl font-serif text-amber-200">₹5,499</span>
                <span className="text-base text-stone-400 line-through font-light">₹6,999</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-stone-800 border border-stone-700 text-amber-300">Save ₹1,500</span>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <Link
                  to="/product/the-imperial-bridal-radiance-box"
                  className="px-7 py-3 rounded-full bg-stone-100 hover:bg-white text-stone-900 font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2 group"
                >
                  <span>Claim Bridal Trunk</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/shop?category=combos-gift-sets"
                  className="px-6 py-3 rounded-full bg-transparent hover:bg-white/10 text-stone-300 hover:text-white text-xs font-semibold uppercase tracking-[0.2em] border border-stone-700 transition-colors"
                >
                  All Gift Sets
                </Link>
              </div>
            </div>

            <div className="relative h-72 sm:h-96 lg:h-full min-h-[420px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1000&auto=format&fit=crop&q=85"
                alt="Imperial Bridal Box"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 Flagship Boutique & Store Experience */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
        <div className="relative rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft bg-[#FAF7F5] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-stone-200 text-[10px] font-semibold uppercase tracking-[0.25em]">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Indore Flagship Boutique</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal leading-tight">
                Experience Royal Beauty in Person
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Step into our sensory beauty lounge to explore our signature formulations. Discover our bespoke finishes in <span className="font-semibold text-stone-900">Velvet Matte</span>, <span className="font-semibold text-stone-900">Satin Glow</span>, and <span className="font-semibold text-stone-900">Shimmer Dust</span> crafted for royal radiance.
              </p>

              <div className="pt-2 space-y-2.5 text-xs text-stone-700 font-light">
                <div className="flex items-center gap-2.5 font-medium text-stone-900">
                  <span className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700">📞</span>
                  <span>Customer Care & Concierge: +91 90984 39910</span>
                </div>
                <div className="flex items-start gap-2.5 text-stone-600">
                  <span className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">📍</span>
                  <span className="pt-0.5">45, Aadharsh Maulik Nagar, near by Hira Nagar Police Station, Sukhliya, Indore</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-[0.2em] shadow-sm transition-all"
                >
                  <span>Explore Atelier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-md border border-stone-200">
              <img
                src="/brand-signboard.jpg"
                alt="Shagune Shine Cosmetics Flagship Store"
                className="w-full h-auto object-cover transform hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="bg-stone-50/60 py-16 sm:py-20 border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">
              Patron Reviews
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 mt-1">
              Loved by Connoisseurs & Experts
            </h2>
            <div className="w-12 h-px bg-stone-300 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center text-amber-600 mb-4 gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-stone-700 text-sm leading-relaxed italic font-light">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-stone-100">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">{t.name}</h4>
                    <p className="text-[10px] text-stone-400 font-light">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Community Glow Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800 flex items-center justify-center gap-1">
            <Camera className="w-3.5 h-3.5" />
            #ShagunGlow
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Glow With Our Community
          </h2>
          <p className="text-stone-500 text-xs mt-1">Tag #ShagunGlow on social media to be featured</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80'
          ].map((imgUrl, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden group border border-gold-200/40"
            >
              <img
                src={imgUrl}
                alt="Community Post"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-maroon-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-6 h-6 text-gold-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
