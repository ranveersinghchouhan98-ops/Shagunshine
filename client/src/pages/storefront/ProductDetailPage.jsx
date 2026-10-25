import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Check,
  Share2,
  MapPin,
  Clock,
  RotateCcw,
  Loader2,
  Send
} from 'lucide-react';
import api from '../../api/apiClient';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/common/ProductCard';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error, info } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedShade, setSelectedShade] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Accordion tabs
  const [openTab, setOpenTab] = useState('description');

  // Pincode checker simulation
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Image Zoom effect state
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const data = await api.get(`/products/${slug}`);
        if (data.success) {
          setProduct(data.product);
          setReviews(data.reviews || []);
          setRelatedProducts(data.relatedProducts || []);
          setSelectedImage(0);

          if (data.product.shades?.length > 0) {
            setSelectedShade(data.product.shades[0]);
          } else {
            setSelectedShade(null);
          }
        }
      } catch (err) {
        console.error('Fetch product detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
          Loading Formulation...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-3">Product Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">The luxury creation you are looking for is unavailable or has moved.</p>
        <Link to="/shop" className="px-6 py-2.5 rounded-full bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const shades = Array.isArray(product.shades) ? product.shades : [];
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];
  const inWishlist = isInWishlist(product.id);

  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  // Handle Zoom Mouse Move
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${images[selectedImage]})`,
      backgroundSize: '220%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const handleAddToCart = (openDrawer = true) => {
    addToCart(product, quantity, selectedShade, openDrawer);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedShade, false);
    navigate('/checkout');
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      error('Please enter a valid 6-digit PIN code.');
      return;
    }
    setPincodeStatus({
      available: true,
      message: 'Luxury delivery available in 3-4 business days! 100% Secure Prepaid (UPI, Cards, NetBanking).'
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      error('Please write a comment for your review.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const data = await api.post('/reviews', {
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        authorName: user ? user.name : reviewAuthor
      });

      if (data.success) {
        success('Your review has been submitted! Thank you.');
        setReviews([data.review, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      error(err.message || 'Error submitting review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Discover ${product.name} at Shagun Shine Cosmetics!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      info('Product link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-maroon-800">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
        <Link to="/shop" className="hover:text-maroon-800">Shop</Link>
        <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
        <Link to={`/shop?category=${product.category_slug}`} className="hover:text-maroon-800">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
        <span className="font-semibold text-stone-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Hero Section (Image Gallery + Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image with Magnifier Zoom */}
          <div
            className="relative aspect-square rounded-2xl overflow-hidden bg-ivory-50 border border-gold-200/60 shadow-soft cursor-crosshair group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={images[selectedImage] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Hover Magnifier Zoom Lens Overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl shadow-inner border border-gold-300 transition-opacity duration-150"
              style={zoomStyle}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
              {product.is_best_seller === 1 && (
                <span className="bg-maroon-900 text-gold-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Best Seller
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Wishlist and Share */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                  inWishlist ? 'bg-white text-red-600' : 'bg-white/90 hover:bg-white text-stone-700'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md transition-all"
                title="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thumbnail Carousel Selector */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-maroon-800 shadow-md scale-105 ring-2 ring-gold-400/40'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-maroon-800 mb-1">
              <span>{product.category_name}</span>
              {product.subcategory && <span>• {product.subcategory}</span>}
              <span className="text-stone-400 ml-auto font-mono text-[11px]">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-stone-900">{product.rating || '5.0'}</span>
              <a href="#reviews" className="text-xs text-stone-500 hover:text-maroon-800 underline">
                ({product.reviews_count || reviews.length} customer reviews)
              </a>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-ivory-100/70 border border-gold-200/50 flex items-baseline gap-4">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              ₹{(product.discount_price || product.price).toLocaleString()}
            </span>
            {product.discount_price && (
              <span className="text-lg text-stone-400 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                You save ₹{(product.price - product.discount_price).toLocaleString()} ({discountPercent}%)
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="text-sm text-stone-600 leading-relaxed">
            {product.short_description || product.description}
          </p>

          {/* Key Benefits Checklist */}
          {benefits.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-stone-800">
                  <div className="w-4 h-4 rounded-full bg-gold-200 text-maroon-900 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}

          {/* Shade Selector if available */}
          {shades.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Select Shade: <span className="font-semibold text-maroon-800">{selectedShade?.name}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {shades.map((shade) => (
                  <button
                    key={shade.name}
                    onClick={() => setSelectedShade(shade)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedShade?.name === shade.name
                        ? 'border-maroon-800 scale-110 ring-2 ring-gold-400 shadow-md'
                        : 'border-white hover:scale-105 shadow-sm'
                    }`}
                    style={{ backgroundColor: shade.hex }}
                    title={shade.name}
                  >
                    {selectedShade?.name === shade.name && (
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Indicator */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={product.stock_quantity > 10 ? 'text-emerald-700' : product.stock_quantity > 0 ? 'text-amber-700' : 'text-red-600'}>
                {product.stock_quantity > 10
                  ? '✨ In Stock — Ready to dispatch'
                  : product.stock_quantity > 0
                  ? `⚡ Low Stock: Only ${product.stock_quantity} left in stock!`
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Quantity & Add to Cart / Buy Now CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Adjuster */}
              <div className="flex items-center border border-stone-300 rounded-xl px-3 py-2 bg-stone-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={() => handleAddToCart(true)}
                disabled={product.stock_quantity <= 0}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-maroon-800 via-maroon-900 to-maroon-800 hover:from-maroon-900 hover:to-stone-950 text-gold-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-gold-400" />
                <span>{product.stock_quantity > 0 ? 'Add to Luxury Bag' : 'Out of Stock'}</span>
              </button>
            </div>

            {/* Buy Now Instant Checkout */}
            {product.stock_quantity > 0 && (
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-glow transition-all"
              >
                Buy Now — Instant Checkout
              </button>
            )}
          </div>

          {/* Pincode Delivery Estimator */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
              <MapPin className="w-4 h-4 text-gold-700" />
              <span>Estimate Delivery Date & Pincode Serviceability</span>
            </div>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode (e.g. 400001)"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500 bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold tracking-wide"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{pincodeStatus.message}</span>
              </p>
            )}
          </div>

          {/* Brand Assurance Strip */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[11px] text-stone-600">
            <div className="p-2.5 rounded-xl bg-ivory-50 border border-gold-200/40">
              <Truck className="w-4 h-4 text-maroon-800 mx-auto mb-1" />
              <span>Complimentary Express Delivery</span>
            </div>
            <div className="p-2.5 rounded-xl bg-ivory-50 border border-gold-200/40">
              <RotateCcw className="w-4 h-4 text-maroon-800 mx-auto mb-1" />
              <span>7-Day Return & Replacement</span>
            </div>
            <div className="p-2.5 rounded-xl bg-ivory-50 border border-gold-200/40">
              <ShieldCheck className="w-4 h-4 text-maroon-800 mx-auto mb-1" />
              <span>100% Certified Authentic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion / Detailed Tabs Section */}
      <div className="bg-white rounded-2xl border border-gold-200/60 p-6 sm:p-8 shadow-sm">
        <div className="flex border-b border-stone-200 overflow-x-auto gap-4 sm:gap-8 pb-3">
          {[
            { id: 'description', label: 'Detailed Description' },
            { id: 'ingredients', label: 'Full Ingredients' },
            { id: 'how_to_use', label: 'How to Use Ritual' },
            { id: 'promise', label: 'Our Clean Beauty Ethos' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setOpenTab(tab.id)}
              className={`font-serif text-sm sm:text-base font-bold pb-2 transition-all relative shrink-0 ${
                openTab === tab.id
                  ? 'text-maroon-800 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gold-500'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6 text-stone-700 text-sm leading-relaxed">
          {openTab === 'description' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200/50">
                  <h4 className="font-serif font-bold text-stone-900 mb-1">Recommended Skin Type</h4>
                  <p className="text-xs text-stone-600">{product.skin_type || 'Suitable for all skin types'}</p>
                </div>
                <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200/50">
                  <h4 className="font-serif font-bold text-stone-900 mb-1">Authentic Formulation</h4>
                  <p className="text-xs text-stone-600">Cruelty-free, sulfate-free, and dermatologically tested.</p>
                </div>
              </div>
            </div>
          )}

          {openTab === 'ingredients' && (
            <div className="space-y-3">
              <p className="font-medium text-stone-900">Complete Key Actives & Botanical List:</p>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 font-mono text-xs text-stone-600 leading-loose">
                {product.ingredients || 'Aqua, Kashmiri Saffron (Crocus Sativus), Hyaluronic Acid, Rose Extract, Botanical Glycerin, Tocopherol (Vitamin E).'}
              </div>
              <p className="text-xs text-stone-500 italic">
                * All our ingredients are ethically sourced and 100% free of harmful parabens, phthalates, and harsh chemicals.
              </p>
            </div>
          )}

          {openTab === 'how_to_use' && (
            <div className="space-y-3">
              <p className="font-medium text-stone-900">Recommended Beauty Ritual:</p>
              <p className="text-sm text-stone-600 leading-relaxed">
                {product.how_to_use || 'Cleanse face thoroughly. Take 2-3 pumps/drops onto palms and gently massage in upward strokes. Follow with moisturizer and sunscreen during the day.'}
              </p>
            </div>
          )}

          {openTab === 'promise' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200/50 space-y-1">
                <Sparkles className="w-5 h-5 text-gold-600" />
                <h5 className="font-bold text-stone-900 text-sm">Royal Ayurvedic Heritage</h5>
                <p className="text-xs text-stone-500">Centuries-old botanical wisdom backed by modern clinical efficacy.</p>
              </div>
              <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200/50 space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h5 className="font-bold text-stone-900 text-sm">Cruelty-Free Certified</h5>
                <p className="text-xs text-stone-500">Never tested on animals. 100% ethically sourced ingredients.</p>
              </div>
              <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200/50 space-y-1">
                <Star className="w-5 h-5 text-amber-600" />
                <h5 className="font-bold text-stone-900 text-sm">Pure Botanical Radiance</h5>
                <p className="text-xs text-stone-500">Rich antioxidant botanical extracts for luminous cellular rejuvenation.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews & Ratings Breakdown Section */}
      <section id="reviews" className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-10">
        <div className="border-b border-stone-200 pb-6">
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Customer Reviews & Ratings
          </h3>
          <p className="text-xs text-stone-500 mt-1">Real feedback from verified Shagun Shine buyers</p>
        </div>

        {/* Rating Breakdown Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-ivory-50 p-6 rounded-2xl border border-gold-200/50">
          <div className="text-center md:text-left">
            <div className="text-5xl font-serif font-bold text-maroon-900">{product.rating || '5.0'}</div>
            <div className="flex items-center justify-center md:justify-start text-amber-400 my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-500">Based on {reviews.length} approved reviews</p>
          </div>

          <div className="md:col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const percent = reviews.length > 0 ? (count / reviews.length) * 100 : star === 5 ? 90 : 10;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-stone-600 font-medium">{star} Star</span>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-500 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-8 text-stone-400 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write a Review Form */}
        <div className="p-6 rounded-2xl border border-gold-300/60 bg-ivory-100/60 space-y-4">
          <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span>Write a Product Review</span>
          </h4>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            {/* Star Rating Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                Your Overall Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating ? 'fill-current text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={user ? user.name : reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  disabled={!!user}
                  placeholder="e.g. Radhika Sharma"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Unbelievable golden glow & luxury feel!"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Detailed Feedback
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this formulation, texture, fragrance, and skin results..."
                required
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-6 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2"
            >
              {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Submit Review</span>
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4 divide-y divide-stone-100">
          {reviews.length === 0 ? (
            <p className="text-xs text-stone-500 italic text-center py-6">
              Be the first to review this royal formulation!
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{rev.author_name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      ✓ Verified Buyer
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-current' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>

                {rev.title && <h5 className="font-serif font-bold text-sm text-stone-900">{rev.title}</h5>}
                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800">
              Complete Your Ritual
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              You May Also Adore
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
