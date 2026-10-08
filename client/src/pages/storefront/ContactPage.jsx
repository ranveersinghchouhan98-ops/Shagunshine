import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Consultation');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const { success } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    success('Thank you! Your inquiry has been dispatched to our beauty concierge.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800">
          Concierge & Support
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Connect with Shagun Shine
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Our beauty advisors and order concierge are delighted to assist you Monday through Saturday.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
              Direct Channels
            </h3>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blush-100 text-maroon-800 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-maroon-700" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block">Customer Hotline & WhatsApp</span>
                <span className="text-xs text-stone-600 font-semibold">+91 90984 39910</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blush-100 text-maroon-800 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-maroon-700" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block">Email Inquiries</span>
                <span className="text-xs text-stone-600">contact@shagunshine.com / care@shagunshine.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blush-100 text-maroon-800 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-maroon-700" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block">Boutique Hours</span>
                <span className="text-xs text-stone-600">Mon – Sat: 10:00 AM – 8:30 PM IST</span>
              </div>
            </div>
          </div>

          {/* Flagship Boutiques */}
          <div className="bg-white rounded-2xl border border-gold-200/60 p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-blush-100">
              Flagship Boutique
            </h3>

            <div className="flex items-start gap-3.5 text-xs text-stone-600">
              <MapPin className="w-4 h-4 text-maroon-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block font-serif">Shagune Shine Luxury Store • Indore</strong>
                <p className="mt-0.5">45, Aadharsh Maulik Nagar, near by Hira Nagar Police Station, Sukhliya, Indore</p>
                <p className="text-[11px] text-maroon-700 font-semibold mt-1">Makeup • Skincare • Fragrances • Luxury Brands</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-xs text-stone-600">
              <MapPin className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">New Delhi Luxury Pavilion</strong>
                <p>DLF Emporio, Vasant Kunj Mall Road, New Delhi - 110070</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gold-200/80 p-6 sm:p-8 shadow-soft">
          {isSent ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Message Dispatched!</h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                Thank you for contacting Shagun Shine. Our beauty consultant will reply within 2-4 business hours.
              </p>
              <button
                onClick={() => { setIsSent(false); setMessage(''); }}
                className="px-6 py-2.5 rounded-full bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="pb-2 border-b border-stone-100">
                <h3 className="font-serif text-xl font-bold text-stone-900">Send an Inquiry</h3>
                <p className="text-xs text-stone-500">Ask about custom bridal sets, product consultation, or order status.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Radhika Sen"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. radhika@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Subject / Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                >
                  <option value="Product Consultation">Product Consultation & Skin Match</option>
                  <option value="Bridal Gifting">Bespoke Bridal & Festive Gifting</option>
                  <option value="Order Tracking">Order & Delivery Inquiry</option>
                  <option value="Returns">Return or Replacement Request</option>
                  <option value="Wholesale">Corporate / Boutique Partnership</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="How may our beauty concierge assist you today?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-stone-50/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-maroon-800 via-maroon-900 to-maroon-800 hover:from-maroon-900 hover:to-stone-950 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-gold-400" />
                <span>Send Message to Concierge</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
