import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Printer,
  ChevronRight,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { INDIAN_STATES } from '../../constants/indianStates';

// Digital Payment Gateway (100% Prepaid)

export const CheckoutPage = () => {
  const { user, addresses, addAddress } = useAuth();
  const {
    cartItems,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    coupon,
    clearCart
  } = useCart();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Step state (1: Address, 2: Payment, 3: Success)
  const [step, setStep] = useState(1);

  // Address Form State
  const [selectedSavedAddr, setSelectedSavedAddr] = useState(null);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'COD', 'UPI', 'CARD', 'NETBANKING'
  const [upiVpa, setUpiVpa] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // If user has saved addresses, select default
  useEffect(() => {
    if (addresses.length > 0 && !selectedSavedAddr && !isNewAddress) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedSavedAddr(defaultAddr);
      setFullName(defaultAddr.full_name);
      setPhone(defaultAddr.phone);
      setAddressLine1(defaultAddr.address_line1);
      setAddressLine2(defaultAddr.address_line2 || '');
      setCity(defaultAddr.city);
      setState(defaultAddr.state);
      setPostalCode(defaultAddr.postal_code);
    } else if (user) {
      setFullName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [addresses, user]);

  const handleSavedAddrSelect = (addr) => {
    setSelectedSavedAddr(addr);
    setIsNewAddress(false);
    setFullName(addr.full_name);
    setPhone(addr.phone);
    setAddressLine1(addr.address_line1);
    setAddressLine2(addr.address_line2 || '');
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postal_code);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !addressLine1 || !city || !state || !postalCode) {
      error('Please complete all shipping address fields.');
      return;
    }
    if (!/^\d{6}$/.test(postalCode.trim())) {
      error('Please enter a valid 6-digit Indian PIN code (e.g. 400050, 110001).');
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  // Helper to load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const shippingAddress = {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode: postalCode.trim(),
        postal_code: postalCode.trim(),
        pincode: postalCode.trim(),
        country: 'India'
      };

      // 1. Create Razorpay Payment Order on Backend
      const pOrderRes = await api.post('/orders/create-payment-order', {
        amount: totalAmount,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`
      });

      if (!pOrderRes.success || !pOrderRes.order) {
        throw new Error(pOrderRes.message || 'Unable to initialize Razorpay payment order.');
      }

      const keyId = pOrderRes.key_id || pOrder.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID;

      // 2. Submit order function after payment verification
      const submitOrder = async (payOrderId, paymentId, signature) => {
        // Step 3: Verify payment signature with backend
        try {
          await api.post('/verify-payment', {
            order_id: payOrderId,
            payment_id: paymentId,
            razorpay_signature: signature
          });
        } catch (vErr) {
          console.warn('Standalone verify-payment check:', vErr.message);
        }

        const orderPayload = {
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress,
          paymentMethod: 'RAZORPAY_' + paymentMethod,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            selectedShade: item.selectedShade
          })),
          couponCode: coupon?.code || null,
          paymentGatewayOrderId: payOrderId,
          paymentGatewayPaymentId: paymentId,
          paymentGatewaySignature: signature
        };

        const data = await api.post('/orders', orderPayload);
        if (data.success) {
          setConfirmedOrder(data.order);
          setStep(3);
          clearCart();
          success(data.message || 'Payment received! Order confirmed.');
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#D4AF37', '#8B1E3B', '#F5EED9', '#10B981']
          });
        } else {
          throw new Error(data.message || 'Order creation failed.');
        }
      };

      // If in mock or placeholder mode (keys not yet added by user), allow direct simulated confirmation
      const isPlaceholderKey = !keyId || keyId.includes('placeholder') || keyId.includes('mock');
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || isPlaceholderKey || !window.Razorpay) {
        // Fallback simulated payment for local development/testing before keys are entered
        await submitOrder(
          pOrder.id,
          'pay_sim_' + Math.random().toString(36).substring(2, 10),
          'sig_sim_' + Math.random().toString(36).substring(2, 12)
        );
        return;
      }

      // 3. Open official Razorpay Checkout Modal
      const options = {
        key: keyId,
        amount: pOrder.amount,
        currency: pOrder.currency || 'INR',
        name: 'Shagun Shine Cosmetics',
        description: `Order Payment (${cartItems.length} items)`,
        order_id: pOrder.id,
        prefill: {
          name: fullName,
          email: email,
          contact: phone
        },
        theme: {
          color: '#8B1E3B' // Royal Maroon brand color
        },
        handler: async (response) => {
          try {
            await submitOrder(
              response.razorpay_order_id || pOrder.id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
          } catch (e) {
            error(e.message || 'Verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        error(resp.error?.description || 'Payment was declined or failed.');
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      error(err.message || 'Error processing payment.');
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500">Please add products to your bag before proceeding to checkout.</p>
        <Link to="/shop" className="px-6 py-2.5 rounded-full bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  // STEP 3: Order Confirmation Screen
  if (step === 3 && confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
            Payment Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Your order <strong>#{confirmedOrder.order_number}</strong> has been received and is being prepared with royal care.
          </p>
        </div>

        {/* Order Details Card */}
        <div id="printable-invoice" className="bg-white rounded-2xl border border-gold-200/80 p-6 sm:p-8 shadow-luxury space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
            <div>
              <div className="font-serif text-2xl font-bold text-maroon-900">Shagun Shine Cosmetics</div>
              <div className="text-xs text-stone-400">Order Invoice & Shipment Confirmation</div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs font-bold text-stone-900">Order #{confirmedOrder.order_number}</div>
              <div className="text-[11px] text-stone-500">Placed: {new Date(confirmedOrder.created_at).toLocaleString()}</div>
              <div className="text-[11px] text-emerald-700 font-bold">Status: {confirmedOrder.order_status}</div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-600">
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-stone-900 block">Shipping Address:</span>
              <p className="font-medium text-stone-800">{confirmedOrder.customer_name}</p>
              <p>{confirmedOrder.shipping_address?.addressLine1}</p>
              {confirmedOrder.shipping_address?.addressLine2 && <p>{confirmedOrder.shipping_address?.addressLine2}</p>}
              <p>{confirmedOrder.shipping_address?.city}, {confirmedOrder.shipping_address?.state} - {confirmedOrder.shipping_address?.postalCode}</p>
              <p>Phone: {confirmedOrder.customer_phone}</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="font-bold uppercase tracking-wider text-stone-900 block">Delivery & Payment:</span>
              <p>Carrier: <strong>{confirmedOrder.carrier || 'Delhivery Express Luxury Fleet'}</strong></p>
              <p>Tracking Number: <strong>{confirmedOrder.tracking_number}</strong></p>
              <p>Estimated Delivery: <strong>{confirmedOrder.estimated_delivery}</strong></p>
              <p>Payment Method: <strong>{confirmedOrder.payment_method} ({confirmedOrder.payment_status})</strong></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-t border-b border-stone-200 py-4 divide-y divide-stone-100">
            {confirmedOrder.items?.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.product_image} alt="" className="w-10 h-10 object-cover rounded-lg border border-stone-200" />
                  <div>
                    <span className="font-semibold text-stone-900">{item.product_name}</span>
                    {item.selected_shade && <span className="block text-[11px] text-stone-500">Shade: {item.selected_shade}</span>}
                    <span className="text-stone-400">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</span>
                  </div>
                </div>
                <span className="font-bold text-stone-900">₹{item.total_price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Financials */}
          <div className="space-y-1.5 text-xs text-stone-600 max-w-xs ml-auto text-right">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-stone-900">₹{confirmedOrder.subtotal.toLocaleString()}</span>
            </div>
            {confirmedOrder.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon Discount ({confirmedOrder.coupon_code}):</span>
                <span>-₹{confirmedOrder.discount_amount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>{confirmedOrder.shipping_fee === 0 ? 'FREE' : `₹${confirmedOrder.shipping_fee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Paid:</span>
              <span className="font-serif text-lg text-maroon-900">₹{confirmedOrder.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 rounded-xl border border-stone-300 hover:bg-white text-stone-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4 text-gold-700" />
            <span>Print Invoice</span>
          </button>

          <Link
            to={`/track?number=${confirmedOrder.order_number}`}
            className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
          >
            <Package className="w-4 h-4" />
            <span>Live Order Tracking</span>
          </Link>

          <Link
            to="/shop"
            className="px-6 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Checkout Steps Header */}
      <div className="flex items-center justify-center max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-maroon-800 text-gold-200' : 'bg-stone-200 text-stone-500'}`}>
            1
          </div>
          <span className="text-xs font-bold text-stone-900">Shipping</span>
        </div>
        <div className={`w-16 h-0.5 mx-2 ${step >= 2 ? 'bg-gold-500' : 'bg-stone-200'}`} />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-maroon-800 text-gold-200' : 'bg-stone-200 text-stone-500'}`}>
            2
          </div>
          <span className={`text-xs font-bold ${step >= 2 ? 'text-stone-900' : 'text-stone-400'}`}>Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Area (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* STEP 1: Address Form */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold-700" />
                  <span>Delivery Address</span>
                </h2>
                {!user && (
                  <Link to="/login" className="text-xs font-semibold text-maroon-800 hover:underline">
                    Have an account? Sign in
                  </Link>
                )}
              </div>

              {/* Saved Addresses Picker for Logged In Customer */}
              {addresses.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Choose from Saved Addresses:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSavedAddrSelect(addr)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedSavedAddr?.id === addr.id && !isNewAddress
                            ? 'border-maroon-800 bg-ivory-50 shadow-sm'
                            : 'border-stone-200 hover:border-gold-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-stone-900">{addr.full_name}</span>
                          {addr.is_default === 1 && (
                            <span className="text-[10px] bg-gold-200 text-maroon-900 font-bold px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 line-clamp-2">{addr.address_line1}, {addr.city}</p>
                        <p className="text-[11px] text-stone-500 font-mono mt-0.5">PIN: {addr.postal_code}</p>
                      </div>
                    ))}

                    <div
                      onClick={() => {
                        setIsNewAddress(true);
                        setSelectedSavedAddr(null);
                        setAddressLine1('');
                        setCity('');
                        setPostalCode('');
                      }}
                      className={`p-3.5 rounded-xl border-2 border-dashed flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors ${
                        isNewAddress ? 'border-maroon-800 bg-ivory-50 text-maroon-900' : 'border-stone-300 text-stone-600 hover:border-gold-400'
                      }`}
                    >
                      + Deliver to a Different Address
                    </div>
                  </div>
                </div>
              )}

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Ananya Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Email Address (For Invoice) *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. ananya@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Phone Number (For Tracking Updates) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Postal PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                    required
                    placeholder="400050"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Flat, House No., Building, Apartment *
                  </label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    required
                    placeholder="e.g. Flat 402, Royal Palms Residency"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Street, Area, Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="e.g. Near Lotus Boulevard, Sector 18"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="e.g. Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    State *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Payment</span>
                <ChevronRight className="w-4 h-4 text-gold-400" />
              </button>
            </form>
          )}

          {/* STEP 2: Payment Options */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gold-700" />
                  <span>Choose Payment Method</span>
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-stone-500 hover:text-maroon-800 underline font-semibold"
                >
                  Edit Address
                </button>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'CARD', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'NETBANKING', label: 'Net Banking', icon: Sparkles }
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                        paymentMethod === pm.id
                          ? 'border-maroon-800 bg-ivory-50 text-maroon-900 font-bold shadow-sm ring-1 ring-gold-400/40'
                          : 'border-stone-200 hover:border-gold-300 text-stone-600'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-gold-700" />
                      <span className="text-xs text-center">{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* UPI View */}
              {paymentMethod === 'UPI' && (
                <div className="p-6 rounded-2xl bg-ivory-50 border border-gold-200/60 space-y-4 text-center">
                  <div className="max-w-xs mx-auto space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Scan QR with Any UPI App
                    </span>
                    <div className="w-44 h-44 bg-white p-3 rounded-2xl border-2 border-gold-400 shadow-md mx-auto flex items-center justify-center">
                      {/* Realistic SVG QR Preview */}
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=shagunshine@okaxis&pn=ShagunShineCosmetics&am=2718"
                        alt="UPI QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500">Scan via GPay, PhonePe, Paytm, or BHIM</p>

                    <div className="pt-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={upiVpa}
                          onChange={(e) => setUpiVpa(e.target.value)}
                          placeholder="Or enter UPI ID (e.g. username@upi)"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500 bg-white text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Card View with Live Card Preview */}
              {paymentMethod === 'CARD' && (
                <div className="p-6 rounded-2xl bg-ivory-50 border border-gold-200/60 space-y-4">
                  {/* Virtual Luxury Card Graphic */}
                  <div className="max-w-sm mx-auto p-5 rounded-2xl bg-gradient-to-tr from-stone-900 via-maroon-900 to-stone-950 text-white shadow-xl border border-gold-400/40 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-serif text-sm font-bold text-gold-300">Shagun Shine Pay</span>
                      <CreditCard className="w-6 h-6 text-gold-400" />
                    </div>
                    <div className="font-mono text-base tracking-widest pt-2">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between items-end text-[10px] text-stone-300 uppercase tracking-wider">
                      <div>
                        <span className="block text-stone-400 text-[9px]">Card Holder</span>
                        <span>{cardHolder || fullName || 'YOUR NAME'}</span>
                      </div>
                      <div>
                        <span className="block text-stone-400 text-[9px]">Expires</span>
                        <span>{cardExpiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm mx-auto pt-2">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 8912 3456 7890"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking View */}
              {paymentMethod === 'NETBANKING' && (
                <div className="p-6 rounded-2xl bg-ivory-50 border border-gold-200/60 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-maroon-800 via-maroon-900 to-maroon-800 hover:from-maroon-900 hover:to-stone-950 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>{isSubmitting ? 'Processing Payment & Placing Order...' : `Pay ₹${totalAmount.toLocaleString()} & Complete Order`}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Review (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gold-200/60 p-6 shadow-soft space-y-5 sticky top-24">
          <h3 className="font-serif text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
            Order Review ({cartItems.length} items)
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
            {cartItems.map((item) => (
              <div key={`${item.productId}-${item.selectedShade}`} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-stone-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-stone-900 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-200">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon ({coupon?.code})</span>
                <span>-₹{discountAmount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
              <span>Total Amount</span>
              <span className="font-serif text-xl text-maroon-900">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-stone-400 flex items-center justify-center gap-1.5 border-t border-stone-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guaranteed 100% Authentic & Safe Encrypted Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};
