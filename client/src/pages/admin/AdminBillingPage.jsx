import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Printer,
  CreditCard,
  Banknote,
  QrCode,
  RotateCcw,
  Pause,
  Play,
  CheckCircle2,
  AlertCircle,
  Tag,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Receipt,
  Clock,
  ArrowRight,
  Boxes,
  X,
  FileText,
  DollarSign
} from 'lucide-react';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const AdminBillingPage = () => {
  const { user } = useAuth();
  const { success, error, info } = useToast();

  // Catalog & Products state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Active Bill Cart state
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerState, setCustomerState] = useState('Madhya Pradesh');
  const [customerCity, setCustomerCity] = useState('Indore');
  const [orderNotes, setOrderNotes] = useState('');

  // Discount & Financials
  const [discountType, setDiscountType] = useState('fixed'); // 'fixed' | 'percent'
  const [discountValue, setDiscountValue] = useState(0);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // 'Cash' | 'UPI' | 'Card'
  const [cashTendered, setCashTendered] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [upiRefNumber, setUpiRefNumber] = useState('');

  // Held Bills
  const [heldBills, setHeldBills] = useState([]);

  // Invoice & Print Modal state
  const [completedInvoice, setCompletedInvoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active View Tab: 'pos' or 'history'
  const [activeTab, setActiveTab] = useState('pos');
  const [recentPosOrders, setRecentPosOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const searchInputRef = useRef(null);

  // 1. Fetch products & categories
  const fetchData = async () => {
    setLoadingProducts(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=200'),
        api.get('/categories')
      ]);

      if (prodRes && prodRes.products) {
        setProducts(prodRes.products);
      }
      if (catRes && catRes.categories) {
        setCategories(catRes.categories);
      }
    } catch (err) {
      console.error('Error loading POS catalog:', err);
      error('Failed to load product catalog for POS.');
    } finally {
      setLoadingProducts(false);
    }
  };

  // 2. Fetch Recent POS Orders for History Tab
  const fetchRecentOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/orders?limit=30');
      if (res && res.orders) {
        // Filter POS orders or all orders
        const posOrders = res.orders.filter(
          (o) => o.order_number?.startsWith('SS-POS') || o.carrier?.includes('Store') || o.carrier?.includes('Counter') || o.notes?.includes('POS')
        );
        setRecentPosOrders(posOrders.length ? posOrders : res.orders.slice(0, 15));
      }
    } catch (err) {
      console.error('Error fetching POS orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRecentOrders();
  }, []);

  // Filter products by search & category
  const filteredProducts = products.filter((prod) => {
    const matchesCat =
      selectedCategory === 'All' ||
      prod.category_id === selectedCategory ||
      prod.category_name?.toLowerCase() === selectedCategory.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      prod.name?.toLowerCase().includes(q) ||
      prod.sku?.toLowerCase().includes(q) ||
      prod.description?.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  // Cart operations
  const addToCart = (product) => {
    if (product.stock_quantity <= 0) {
      error(`"${product.name}" is currently out of stock.`);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          error(`Cannot add more. Available store stock: ${product.stock_quantity}`);
          return prev;
        }
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const unitPrice = product.discount_price || product.price || 0;
        const img = Array.isArray(product.images) ? product.images[0] : (product.images || '');
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            sku: product.sku,
            price: unitPrice,
            mrp: product.mrp || product.price || unitPrice,
            stock_quantity: product.stock_quantity,
            quantity: 1,
            image: img,
            gst_rate: product.gst_rate || 18,
            hsn_code: product.hsn_code || '330499'
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          if (newQty > item.stock_quantity) {
            error(`Max available stock is ${item.stock_quantity}`);
            return { ...item, quantity: item.stock_quantity };
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    if (cartItems.length > 0 && !window.confirm('Are you sure you want to clear the active bill?')) {
      return;
    }
    setCartItems([]);
    setCustomerName('Walk-in Customer');
    setCustomerPhone('');
    setCustomerEmail('');
    setDiscountValue(0);
    setCashTendered('');
    setCardLast4('');
    setUpiRefNumber('');
  };

  // Hold current bill
  const holdBill = () => {
    if (cartItems.length === 0) {
      error('Cart is empty. Nothing to hold.');
      return;
    }

    const held = {
      id: 'held_' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName,
      customerPhone,
      items: cartItems,
      discountType,
      discountValue
    };

    setHeldBills((prev) => [...prev, held]);
    setCartItems([]);
    setCustomerName('Walk-in Customer');
    setCustomerPhone('');
    setDiscountValue(0);
    info('Bill held successfully. You can resume it anytime.');
  };

  // Resume held bill
  const resumeBill = (heldId) => {
    const bill = heldBills.find((b) => b.id === heldId);
    if (!bill) return;

    if (cartItems.length > 0) {
      if (!window.confirm('Current cart has items. Replacing with held bill?')) {
        return;
      }
    }

    setCartItems(bill.items);
    setCustomerName(bill.customerName);
    setCustomerPhone(bill.customerPhone);
    setDiscountType(bill.discountType);
    setDiscountValue(bill.discountValue);
    setHeldBills((prev) => prev.filter((b) => b.id !== heldId));
    success('Held bill restored to active counter.');
  };

  // Financial calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  let discountAmount = 0;
  if (discountType === 'percent') {
    discountAmount = Math.round(((subtotal * (parseFloat(discountValue) || 0)) / 100) * 100) / 100;
  } else {
    discountAmount = Math.min(subtotal, parseFloat(discountValue) || 0);
  }

  const netPayable = Math.max(0, subtotal - discountAmount);

  // Inclusive GST computation (Indian Cosmetics standard 18% HSN 330499)
  const isInterState = customerState && !['madhya pradesh', 'mp'].includes(customerState.trim().toLowerCase());
  const taxableBase = Math.round((netPayable / 1.18) * 100) / 100;
  const totalTax = Math.round((netPayable - taxableBase) * 100) / 100;
  const cgstAmount = !isInterState ? Math.round((totalTax / 2) * 100) / 100 : 0;
  const sgstAmount = !isInterState ? Math.round((totalTax - cgstAmount) * 100) / 100 : 0;
  const igstAmount = isInterState ? totalTax : 0;

  // Change due calculator for cash
  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, tenderedNum - netPayable);

  // Complete Sale & Generate GST Invoice
  const handleCompleteSale = async () => {
    if (cartItems.length === 0) {
      error('Please select at least one product to bill.');
      return;
    }

    if (paymentMethod === 'Cash' && tenderedNum > 0 && tenderedNum < netPayable) {
      error(`Tendered cash (₹${tenderedNum}) is less than payable amount (₹${netPayable}).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: customerName.trim() || 'Walk-in Retail Customer',
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        customerState,
        customerCity,
        paymentMethod,
        cashTendered: paymentMethod === 'Cash' ? (tenderedNum || netPayable) : netPayable,
        changeReturned: paymentMethod === 'Cash' ? changeDue : 0,
        discountAmount,
        notes: `POS In-Store Sale [${paymentMethod}] ${orderNotes ? `| Note: ${orderNotes}` : ''}`,
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          gstRate: item.gst_rate || 18,
          hsnCode: item.hsn_code || '330499'
        }))
      };

      const res = await api.post('/orders/pos-sale', payload);

      if (res && res.success) {
        success('Sale completed! Tax invoice generated.');

        // Build invoice object for modal and print
        const invoiceData = {
          order: res.order,
          invoiceNumber: res.invoice?.invoiceNumber || res.order?.invoice_number || `INV-${Date.now()}`,
          orderNumber: res.order?.order_number,
          date: new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
          }),
          cashier: user?.name || 'Admin Cashier',
          customerName: payload.customerName,
          customerPhone: payload.customerPhone,
          customerState,
          paymentMethod,
          cashTendered: payload.cashTendered,
          changeReturned: payload.changeReturned,
          items: cartItems,
          subtotal,
          discountAmount,
          netPayable,
          taxableBase,
          cgstAmount,
          sgstAmount,
          igstAmount,
          totalTax
        };

        setCompletedInvoice(invoiceData);

        // Update local catalog stock immediately
        setProducts((prev) =>
          prev.map((p) => {
            const purchased = cartItems.find((ci) => ci.productId === p.id);
            if (purchased) {
              return { ...p, stock_quantity: Math.max(0, p.stock_quantity - purchased.quantity) };
            }
            return p;
          })
        );

        // Reset cart
        setCartItems([]);
        setCustomerName('Walk-in Customer');
        setCustomerPhone('');
        setCustomerEmail('');
        setDiscountValue(0);
        setCashTendered('');
        setCardLast4('');
        setUpiRefNumber('');
        setOrderNotes('');

        fetchRecentOrders();
      } else {
        error(res?.message || 'Failed to complete POS sale.');
      }
    } catch (err) {
      console.error('POS Sale error:', err);
      error(err.message || 'Error processing retail sale.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Print Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-maroon-900 to-maroon-700 flex items-center justify-center text-gold-300 shadow-md">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-stone-900">Retail Billing Counter (POS)</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                LIVE COUNTER
              </span>
            </div>
            <p className="text-xs text-stone-500">
              In-Store GST billing, walk-in customer checkout, and instant tax invoice printing
            </p>
          </div>
        </div>

        {/* Tab switcher & Counter Status */}
        <div className="flex items-center gap-3">
          <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <button
              onClick={() => setActiveTab('pos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pos'
                  ? 'bg-white text-maroon-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Billing Counter
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                fetchRecentOrders();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-maroon-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bill History</span>
              {recentPosOrders.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-maroon-100 text-maroon-800">
                  {recentPosOrders.length}
                </span>
              )}
            </button>
          </div>

          {/* Held Bills Counter Button */}
          {heldBills.length > 0 && (
            <div className="relative group">
              <button className="px-3 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Pause className="w-3.5 h-3.5" />
                <span>Held ({heldBills.length})</span>
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 hidden group-hover:block z-30 space-y-2">
                <div className="text-xs font-bold text-stone-700 pb-1 border-b border-stone-100">
                  Held Bills on Standby
                </div>
                {heldBills.map((hb) => (
                  <div key={hb.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 border border-stone-100 text-xs">
                    <div>
                      <div className="font-semibold text-stone-900">{hb.customerName}</div>
                      <div className="text-[10px] text-stone-400">{hb.timestamp} • {hb.items.length} items</div>
                    </div>
                    <button
                      onClick={() => resumeBill(hb.id)}
                      className="px-2.5 py-1 bg-maroon-800 text-white rounded-lg text-[10px] font-bold hover:bg-maroon-900"
                    >
                      Resume
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'pos' ? (
        /* Main POS Two-Column Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Product Catalog & Rapid Search (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Scan barcode, or search by Product Name, SKU (e.g. SS-FK-001)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-maroon-800 focus:bg-white transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    selectedCategory === 'All'
                      ? 'bg-maroon-900 text-gold-200 font-bold shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All Items ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-maroon-900 text-gold-200 font-bold shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3 text-xs text-stone-500">
                <span>Available Products ({filteredProducts.length})</span>
                <span className="text-[11px] text-stone-400">Click any card to add to bill</span>
              </div>

              {loadingProducts ? (
                <div className="py-16 text-center text-stone-400 text-xs flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-maroon-800 border-t-transparent rounded-full animate-spin" />
                  <span>Loading product catalog...</span>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-16 text-center text-stone-400 text-xs">
                  <Boxes className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p>No products match your search or filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto pr-1">
                  {filteredProducts.map((prod) => {
                    const inCart = cartItems.find((it) => it.productId === prod.id);
                    const isOutOfStock = prod.stock_quantity <= 0;
                    const price = prod.discount_price || prod.price;
                    const img = Array.isArray(prod.images) ? prod.images[0] : (prod.images || '');

                    return (
                      <div
                        key={prod.id}
                        onClick={() => !isOutOfStock && addToCart(prod)}
                        className={`group relative flex flex-col justify-between p-3 rounded-2xl border transition-all text-left ${
                          isOutOfStock
                            ? 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed'
                            : inCart
                            ? 'bg-maroon-50/40 border-maroon-300 shadow-sm cursor-pointer hover:border-maroon-500 hover:shadow-md'
                            : 'bg-white border-stone-200 hover:border-gold-300 hover:shadow-md cursor-pointer'
                        }`}
                      >
                        {/* Cart count badge */}
                        {inCart && (
                          <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-maroon-800 text-gold-200 text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                            {inCart.quantity}
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="w-full h-24 rounded-xl bg-stone-100 overflow-hidden flex items-center justify-center relative">
                            {img ? (
                              <img
                                src={img}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Sparkles className="w-6 h-6 text-stone-300" />
                            )}
                            {isOutOfStock && (
                              <span className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-white">
                                Out of Stock
                              </span>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] font-mono font-semibold text-stone-400 block truncate">
                              {prod.sku || 'SS-PROD'}
                            </span>
                            <h4 className="text-xs font-semibold text-stone-900 line-clamp-2 leading-tight">
                              {prod.name}
                            </h4>
                          </div>
                        </div>

                        <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-maroon-900 font-serif">₹{price}</span>
                            {prod.mrp && prod.mrp > price && (
                              <span className="text-[10px] text-stone-400 line-through ml-1">₹{prod.mrp}</span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                              prod.stock_quantity < 5
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            Stock: {prod.stock_quantity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Bill & Checkout (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-md p-5 space-y-5">
              {/* Customer Details Header */}
              <div className="space-y-3 pb-4 border-b border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-maroon-800" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Customer Details
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCustomerName('Walk-in Customer');
                      setCustomerPhone('');
                    }}
                    className="text-[10px] text-maroon-800 hover:underline font-bold"
                  >
                    Reset Walk-in
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-maroon-800"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Mobile (10 digits)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-maroon-800"
                    />
                  </div>
                </div>

                {/* State selector for GST */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-stone-500 whitespace-nowrap">Place of Supply:</span>
                  <select
                    value={customerState}
                    onChange={(e) => setCustomerState(e.target.value)}
                    className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="Madhya Pradesh">Madhya Pradesh (CGST 9% + SGST 9%) - Intra-State</option>
                    <option value="Maharashtra">Maharashtra (IGST 18%) - Inter-State</option>
                    <option value="Rajasthan">Rajasthan (IGST 18%) - Inter-State</option>
                    <option value="Gujarat">Gujarat (IGST 18%) - Inter-State</option>
                    <option value="Uttar Pradesh">Uttar Pradesh (IGST 18%) - Inter-State</option>
                    <option value="Delhi">Delhi (IGST 18%) - Inter-State</option>
                    <option value="Chhattisgarh">Chhattisgarh (IGST 18%) - Inter-State</option>
                    <option value="Haryana">Haryana (IGST 18%) - Inter-State</option>
                    <option value="Other">Other State (IGST 18%)</option>
                  </select>
                </div>
              </div>

              {/* Items List in Current Cart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                    Current Bill Items ({cartItems.length})
                  </span>
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 font-semibold text-[11px] flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                {cartItems.length === 0 ? (
                  <div className="py-10 border-2 border-dashed border-stone-200 rounded-2xl text-center text-stone-400 space-y-1">
                    <ShoppingCart className="w-7 h-7 mx-auto text-stone-300" />
                    <p className="text-xs font-medium">Cart is currently empty</p>
                    <p className="text-[10px] text-stone-400">Scan or tap products from catalog to start billing</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 divide-y divide-stone-100">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {item.image && (
                            <img
                              src={item.image}
                              alt=""
                              className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <h5 className="font-medium text-stone-900 truncate leading-tight">{item.name}</h5>
                            <span className="text-[10px] text-stone-400 font-mono">
                              ₹{item.price} • HSN {item.hsn_code}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-stone-900 text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="w-16 text-right shrink-0">
                          <span className="font-bold text-stone-900 font-serif">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1 text-stone-300 hover:text-red-600 transition-colors shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Discount Section */}
              {cartItems.length > 0 && (
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-gold-700" />
                      <span>Order Discount</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDiscountType('fixed')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          discountType === 'fixed'
                            ? 'bg-maroon-900 text-white'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        ₹
                      </button>
                      <button
                        onClick={() => setDiscountType('percent')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          discountType === 'percent'
                            ? 'bg-maroon-900 text-white'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        %
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={discountValue || ''}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                      placeholder={discountType === 'percent' ? 'Discount %' : 'Discount ₹'}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                    />
                    {/* Quick discount chips */}
                    <div className="flex items-center gap-1 shrink-0">
                      {[50, 100, 200].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => {
                            setDiscountType('fixed');
                            setDiscountValue(amt);
                          }}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] font-semibold text-stone-700"
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bill Totals Summary */}
              {cartItems.length > 0 && (
                <div className="pt-3 border-t border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Items Total ({totalUnits} units):</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount Applied:</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* GST Breakdown */}
                  <div className="p-2.5 rounded-xl bg-ivory-50 border border-stone-200/60 text-[11px] text-stone-600 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span>Taxable Value:</span>
                      <span>₹{taxableBase.toLocaleString()}</span>
                    </div>
                    {!isInterState ? (
                      <>
                        <div className="flex justify-between">
                          <span>CGST (9%):</span>
                          <span>₹{cgstAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SGST (9%):</span>
                          <span>₹{sgstAmount.toLocaleString()}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span>IGST (18%):</span>
                        <span>₹{igstAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="text-[10px] text-stone-400 italic pt-0.5">
                      Prices are inclusive of Indian GST (HSN: 330499)
                    </div>
                  </div>

                  {/* Net Payable in Large Gold/Maroon */}
                  <div className="flex justify-between items-baseline pt-2 border-t border-stone-200">
                    <span className="font-bold text-stone-900 text-sm">Net Payable:</span>
                    <span className="font-serif text-2xl font-black text-maroon-900">
                      ₹{netPayable.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Mode Selector */}
              {cartItems.length > 0 && (
                <div className="pt-3 border-t border-stone-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
                    Payment Method
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod('Cash')}
                      className={`p-2.5 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'Cash'
                          ? 'border-maroon-800 bg-maroon-50 text-maroon-900 font-bold shadow-sm'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Banknote className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                      <span className="text-xs block">Cash</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'UPI'
                          ? 'border-maroon-800 bg-maroon-50 text-maroon-900 font-bold shadow-sm'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <QrCode className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                      <span className="text-xs block">UPI / QR</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('Card')}
                      className={`p-2.5 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'Card'
                          ? 'border-maroon-800 bg-maroon-50 text-maroon-900 font-bold shadow-sm'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1 text-gold-700" />
                      <span className="text-xs block">Card / POS</span>
                    </button>
                  </div>

                  {/* Cash Tendered Calculator */}
                  {paymentMethod === 'Cash' && (
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600 font-medium">Cash Tendered by Customer:</span>
                        <input
                          type="number"
                          value={cashTendered}
                          onChange={(e) => setCashTendered(e.target.value)}
                          placeholder={`₹${netPayable}`}
                          className="w-28 px-2 py-1 text-right font-bold bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none"
                        />
                      </div>
                      {/* Currency quick buttons */}
                      <div className="flex items-center justify-end gap-1.5 pt-1">
                        <span className="text-[10px] text-stone-400">Quick:</span>
                        {[100, 200, 500, 1000, 2000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setCashTendered(amt)}
                            className="px-2 py-0.5 rounded text-[10px] bg-white border border-stone-200 hover:bg-stone-100 font-mono text-stone-700"
                          >
                            ₹{amt}
                          </button>
                        ))}
                        <button
                          onClick={() => setCashTendered(netPayable)}
                          className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200"
                        >
                          Exact
                        </button>
                      </div>

                      {tenderedNum > 0 && (
                        <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
                          <span className="font-bold text-stone-700">Change Due to Customer:</span>
                          <span className="font-serif text-base font-bold text-emerald-700">
                            ₹{changeDue.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* UPI QR Guidance */}
                  {paymentMethod === 'UPI' && (
                    <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-950">Store UPI ID:</span>
                        <span className="font-mono text-indigo-800 font-semibold">shagunshine@okaxis</span>
                      </div>
                      <p className="text-[11px] text-indigo-700">
                        Scan store counter QR code with GPay, PhonePe, or Paytm for ₹{netPayable.toLocaleString()}
                      </p>
                      <input
                        type="text"
                        placeholder="UPI UTR / Reference No. (optional)"
                        value={upiRefNumber}
                        onChange={(e) => setUpiRefNumber(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-indigo-200 rounded-lg text-stone-800"
                      />
                    </div>
                  )}

                  {/* Card Reference */}
                  {paymentMethod === 'Card' && (
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                      <span className="text-stone-600 block">Swipe or tap card on retail POS machine.</span>
                      <input
                        type="text"
                        placeholder="Last 4 digits / Approval code (optional)"
                        value={cardLast4}
                        onChange={(e) => setCardLast4(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-stone-200 rounded-lg text-stone-800"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons: Complete Sale & Hold Bill */}
              <div className="pt-2 space-y-2">
                <button
                  disabled={cartItems.length === 0 || isSubmitting}
                  onClick={handleCompleteSale}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                    cartItems.length === 0 || isSubmitting
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-maroon-900 to-maroon-800 text-gold-200 hover:from-maroon-950 hover:to-maroon-900 hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gold-200 border-t-transparent rounded-full animate-spin" />
                      <span>Processing Sale...</span>
                    </>
                  ) : (
                    <>
                      <Receipt className="w-4 h-4" />
                      <span>Complete Sale & Print Tax Invoice (₹{netPayable.toLocaleString()})</span>
                    </>
                  )}
                </button>

                {cartItems.length > 0 && (
                  <button
                    onClick={holdBill}
                    className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Pause className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hold Current Bill</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Bill History Tab */
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">In-Store Retail Sales Ledger</h3>
              <p className="text-xs text-stone-500">Recent walk-in retail transactions and reprints</p>
            </div>
            <button
              onClick={fetchRecentOrders}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loadingOrders ? (
            <div className="py-16 text-center text-xs text-stone-400">Loading ledger...</div>
          ) : recentPosOrders.length === 0 ? (
            <div className="py-16 text-center text-xs text-stone-400">No POS orders recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentPosOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-maroon-900">
                        {ord.invoice_number || ord.order_number}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500">
                        {new Date(ord.created_at).toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-stone-900 font-medium">
                        {ord.customer_name || 'Walk-in Customer'}
                        {ord.customer_phone && (
                          <span className="block text-[10px] text-stone-400 font-mono">
                            {ord.customer_phone}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                          {ord.payment_method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                        ₹{ord.total_amount?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            // Prepare invoice view
                            setCompletedInvoice({
                              order: ord,
                              invoiceNumber: ord.invoice_number || `INV-${ord.order_number}`,
                              orderNumber: ord.order_number,
                              date: new Date(ord.created_at).toLocaleString('en-IN'),
                              cashier: 'Store Cashier',
                              customerName: ord.customer_name,
                              customerPhone: ord.customer_phone,
                              customerState: ord.shipping_address?.state || 'Haryana',
                              paymentMethod: ord.payment_method,
                              items: ord.items || [],
                              subtotal: ord.subtotal || ord.total_amount,
                              discountAmount: ord.discount_amount || 0,
                              netPayable: ord.total_amount,
                              taxableBase: ord.taxable_amount || Math.round((ord.total_amount / 1.18) * 100) / 100,
                              cgstAmount: ord.cgst_amount || 0,
                              sgstAmount: ord.sgst_amount || 0,
                              igstAmount: ord.igst_amount || 0,
                              totalTax: (ord.cgst_amount || 0) + (ord.sgst_amount || 0) + (ord.igst_amount || 0)
                            });
                          }}
                          className="px-3 py-1 rounded-xl border border-stone-200 hover:bg-maroon-50 hover:text-maroon-800 text-[11px] font-semibold text-stone-600 inline-flex items-center gap-1 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Reprint Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tax Invoice Modal / Printable Receipt View */}
      {completedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in no-print-backdrop">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gold-200/80 p-6 sm:p-8 space-y-6">
            {/* Modal Controls (No print) */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 no-print">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Tax Invoice #{completedInvoice.invoiceNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-maroon-900 text-gold-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-maroon-950"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setCompletedInvoice(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Tax Invoice Content */}
            <div id="printable-invoice" className="space-y-6 text-stone-800 text-xs">
              {/* Header with store details */}
              <div className="text-center space-y-1 pb-4 border-b border-stone-300">
                <h2 className="font-serif text-2xl font-black tracking-wide text-maroon-950 uppercase">
                  SHAGUN SHINE COSMETICS
                </h2>
                <p className="text-[11px] text-stone-600 font-medium tracking-wider uppercase">
                  Premium Luxury Cosmetics & Fragrances
                </p>
                <p className="text-[10px] text-stone-500">
                  45, Adarsh Maulik Nagar Road, Sukhliya (Near Surabhi Shoe Mart), Indore, MP - 452003 | Phone: +91 99265 39866
                </p>
                <div className="flex items-center justify-center gap-4 text-[10px] font-mono font-semibold pt-1">
                  <span>GSTIN: 23BBVPC0623C1Z8</span>
                  <span>•</span>
                  <span>UDYAM: UDYAM-MP-23-0310066</span>
                </div>
              </div>

              {/* Invoice Meta Grid */}
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-stone-200 text-[11px]">
                <div>
                  <p><strong>Invoice No:</strong> {completedInvoice.invoiceNumber}</p>
                  <p><strong>Order Ref:</strong> {completedInvoice.orderNumber}</p>
                  <p><strong>Date & Time:</strong> {completedInvoice.date}</p>
                  <p><strong>Cashier:</strong> {completedInvoice.cashier}</p>
                </div>
                <div className="text-right">
                  <p><strong>Billed To:</strong> {completedInvoice.customerName || 'Walk-in Retail Customer'}</p>
                  {completedInvoice.customerPhone && <p><strong>Phone:</strong> {completedInvoice.customerPhone}</p>}
                  <p><strong>Place of Supply:</strong> {completedInvoice.customerState}</p>
                  <p><strong>Payment Mode:</strong> {completedInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-stone-800 text-[10px] font-bold uppercase tracking-wider text-stone-900">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center">HSN</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {completedInvoice.items.map((it, idx) => (
                      <tr key={idx} className="py-1.5">
                        <td className="py-2 font-medium text-stone-900">
                          {it.name || it.product_name}
                          {it.sku && <span className="block text-[10px] text-stone-400 font-mono">{it.sku}</span>}
                        </td>
                        <td className="py-2 text-center font-mono text-[11px] text-stone-600">
                          {it.hsn_code || '330499'}
                        </td>
                        <td className="py-2 text-center font-bold">{it.quantity}</td>
                        <td className="py-2 text-right">₹{it.price}</td>
                        <td className="py-2 text-right font-bold">
                          ₹{(it.price * it.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Breakdown & GST Analysis */}
              <div className="pt-3 border-t-2 border-stone-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{completedInvoice.subtotal.toLocaleString()}</span>
                </div>

                {completedInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount:</span>
                    <span>-₹{completedInvoice.discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600 text-[11px]">
                  <span>Taxable Base Value:</span>
                  <span>₹{completedInvoice.taxableBase.toLocaleString()}</span>
                </div>

                {['madhya pradesh', 'mp'].includes(completedInvoice.customerState?.toLowerCase()) ? (
                  <>
                    <div className="flex justify-between text-stone-600 text-[11px]">
                      <span>CGST (9%):</span>
                      <span>₹{completedInvoice.cgstAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-stone-600 text-[11px]">
                      <span>SGST (9%):</span>
                      <span>₹{completedInvoice.sgstAmount.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-stone-600 text-[11px]">
                    <span>IGST (18%):</span>
                    <span>₹{completedInvoice.igstAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-300">
                  <span className="uppercase tracking-wider">Grand Total:</span>
                  <span className="font-serif text-lg text-maroon-950 font-black">
                    ₹{completedInvoice.netPayable.toLocaleString()}
                  </span>
                </div>

                {completedInvoice.paymentMethod === 'Cash' && completedInvoice.cashTendered && (
                  <div className="pt-1 text-[11px] text-stone-600 flex justify-between">
                    <span>Cash Tendered: ₹{completedInvoice.cashTendered}</span>
                    <span>Change Returned: ₹{completedInvoice.changeReturned || 0}</span>
                  </div>
                )}
              </div>

              {/* Terms & Footer */}
              <div className="pt-4 border-t border-dashed border-stone-300 text-center space-y-1 text-[10px] text-stone-500">
                <p className="font-semibold text-stone-700">Thank you for visiting Shagun Shine Cosmetics!</p>
                <p>Goods once sold can be exchanged within 7 days in unsealed condition along with this original bill.</p>
                <p className="font-mono pt-1 text-[9px] uppercase tracking-widest text-stone-400">
                  *** COMPUTER GENERATED TAX INVOICE ***
                </p>
              </div>
            </div>

            {/* Modal Bottom Close */}
            <div className="flex justify-end pt-4 border-t border-stone-200 no-print">
              <button
                onClick={() => setCompletedInvoice(null)}
                className="px-6 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700"
              >
                Close & Next Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminBillingPage;
