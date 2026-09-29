import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle, Search } from 'lucide-react';

const FAQS = [
  {
    category: 'Formulation & Authenticity',
    q: 'Are Shagun Shine formulations safe for sensitive skin?',
    a: 'Yes, absolutely. All our skincare and makeup products are 100% cruelty-free, dermatologically tested, paraben-free, and formulated with gentle Ayurvedic botanicals suitable for sensitive and all skin types.'
  },
  {
    category: 'Formulation & Authenticity',
    q: 'Do you use genuine 24K pure gold in the Youth Elixir?',
    a: 'Yes! Our 24K Gold Radiant Youth Elixir and bridal kits are infused with certified 99.9% pure cosmetic grade 24K gold dust and genuine Kashmiri Saffron.'
  },
  {
    category: 'Orders & Shipping',
    q: 'What are the delivery timelines and shipping charges?',
    a: 'We offer complimentary luxury delivery on all orders above ₹999 across India. Standard orders are dispatched within 24 hours and delivered in 3-5 business days via our express courier partners.'
  },
  {
    category: 'Orders & Shipping',
    q: 'How do I track my order once placed?',
    a: 'You can track your order anytime using our Live Tracking page by entering your Order Number (e.g. SS-2026-8901) or carrier tracking number.'
  },
  {
    category: 'Payments & Offers',
    q: 'What payment options do you support?',
    a: 'We accept Cash on Delivery (COD), UPI (GPay, PhonePe, Paytm, BHIM, QR code), all major Credit/Debit cards (Visa, Mastercard, RuPay, Amex), and Net Banking across all major Indian banks.'
  },
  {
    category: 'Returns & Replacements',
    q: 'What is your return & refund policy?',
    a: 'We offer a 7-day hassle-free replacement or refund guarantee if you receive a damaged, defective, or incorrect product. Simply contact concierge@shagunshine.com or WhatsApp +91 9876543210.'
  }
];

export const FAQPage = () => {
  const [openIdx, setOpenIdx] = useState(0);
  const [search, setSearch] = useState('');

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-ivory-100 border border-gold-300 text-maroon-800 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6 text-gold-600" />
        </div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-800">
          Knowledge Base
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Find instant answers to common questions regarding ingredients, shipping, payments, and returns.
        </p>
      </div>

      {/* Search Filter */}
      <div className="max-w-md mx-auto relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search question or keyword..."
          className="w-full px-4 py-3 pl-11 rounded-2xl border border-stone-300 text-xs focus:outline-none focus:border-gold-500 bg-white shadow-sm"
        />
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all shadow-sm"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-bold text-stone-900 hover:text-maroon-800 transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-gold-700 shrink-0 transition-transform duration-200 ${
                  openIdx === idx ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openIdx === idx && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3 bg-ivory-50/50 animate-in fade-in">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
