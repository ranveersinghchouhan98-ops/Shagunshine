import React from 'react';
import { ShieldCheck, Truck, RotateCcw, FileText, AlertCircle, CheckCircle2, UserCheck, HelpCircle } from 'lucide-react';

export const ReturnPolicyPage = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
    <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
      <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-800 flex items-center justify-center border border-maroon-100">
        <RotateCcw className="w-5 h-5" />
      </div>
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Return, Replacement & Refund Policy</h1>
        <p className="text-xs text-stone-500 mt-0.5">Compliant with Consumer Protection (E-Commerce) Rules, 2020 & CDSCO Hygiene Guidelines</p>
      </div>
    </div>

    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          1. Strict Return & Refund Eligibility: Wrong or Broken Products Only
        </h2>
        <p>
          At <strong>Shagun Shine Cosmetics</strong>, all sales are final. We maintain a strict policy: <strong>no returns or refunds are accepted unless the product delivered is a wrong product (incorrect shade, variant, or item) or a broken/damaged product (physically damaged, leaking, or broken during transit)</strong>. No returns or refunds are provided for change of mind, personal preference, or opened items.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          2. Cosmetic Hygiene & Strict Non-Returnable Policy
        </h2>
        <p>
          Due to strict cosmetic safety and hygiene regulations (CDSCO & Drugs and Cosmetics Rules), cosmetic products once delivered cannot be returned or refunded unless proven to be the wrong item or received in broken/damaged condition.
        </p>
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs space-y-2">
          <p className="font-semibold text-stone-800">Conditions for Return / Replacement Acceptance:</p>
          <ul className="list-disc list-inside space-y-1 text-stone-600">
            <li>Item must be in its original packaging with safety seals, holographic labels, batch tags, and MRP stickers intact.</li>
            <li>For transit damages or missing units, clear photographs and unboxing video footage must be provided.</li>
            <li>Products received as free promotional gifts or samples cannot be redeemed for cash or returns.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          3. How to Request a Return or Replacement
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-stone-600">
          <li>Go to your <strong>My Account &rarr; Orders</strong> section or email our Concierge at <span className="font-semibold text-maroon-800">care@shagunshine.com</span>.</li>
          <li>Provide your <strong>Order ID (e.g., ORD-2026-XXXX)</strong>, description of the issue, and attaching images/video of the outer carton, batch code, and product.</li>
          <li>Our quality inspection team evaluates and approves valid requests within <strong>24 to 48 hours</strong>.</li>
          <li>Once approved, a complimentary courier pickup is scheduled from your delivery address.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          4. Refund Modes & Timelines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="border border-stone-200 bg-stone-50/50 p-4 rounded-xl">
            <h4 className="font-bold text-stone-900 mb-1">Prepaid Orders (Cards, UPI, NetBanking)</h4>
            <p className="text-xs text-stone-600">Refund is initiated immediately upon return pickup inspection and credited back to the original source bank/wallet within <strong>3 to 5 business days</strong>.</p>
          </div>
          <div className="border border-stone-200 bg-stone-50/50 p-4 rounded-xl">
            <h4 className="font-bold text-stone-900 mb-1">Cash on Delivery (COD) Orders</h4>
            <p className="text-xs text-stone-600">Refund is transferred directly via verified <strong>UPI ID or NEFT/IMPS Direct Bank Transfer</strong> upon receipt of beneficiary account details within <strong>2 to 4 business days</strong>.</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          5. Order Cancellations
        </h2>
        <p>
          Orders can be cancelled free of charge at any moment prior to dispatch from our fulfillment centers. Once an order is dispatched and assigned an AWB tracking number, it can be refused at the doorstep upon courier arrival.
        </p>
      </section>
    </div>
  </div>
);

export const ShippingPolicyPage = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
    <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
      <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-800 flex items-center justify-center border border-maroon-100">
        <Truck className="w-5 h-5" />
      </div>
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Shipping & Delivery Policy</h1>
        <p className="text-xs text-stone-500 mt-0.5">Compliant with Legal Metrology Act & Indian Logistics Standards</p>
      </div>
    </div>

    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          1. Pan-India Delivery Network
        </h2>
        <p>
          Shagun Shine Cosmetics delivers luxury beauty products across all <strong>28 States and 8 Union Territories</strong> covering over 26,000+ Indian postal PIN codes via leading secure courier partners including BlueDart, Delhivery, Xpressbees, and DTDC.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          2. Shipping Charges & Free Delivery Threshold
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-stone-200 text-xs">
            <thead>
              <tr className="bg-stone-100 text-stone-900 font-semibold">
                <th className="border border-stone-200 p-2.5">Order Cart Total</th>
                <th className="border border-stone-200 p-2.5">Payment Method</th>
                <th className="border border-stone-200 p-2.5">Shipping Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-stone-200 p-2.5 font-medium text-maroon-800">₹999 and above</td>
                <td className="border border-stone-200 p-2.5">Prepaid (UPI, Card, NetBanking)</td>
                <td className="border border-stone-200 p-2.5 text-emerald-700 font-bold">FREE (Complimentary Express)</td>
              </tr>
              <tr>
                <td className="border border-stone-200 p-2.5">Below ₹999</td>
                <td className="border border-stone-200 p-2.5">Prepaid</td>
                <td className="border border-stone-200 p-2.5">₹99 (Standard Express)</td>
              </tr>
              <tr>
                <td className="border border-stone-200 p-2.5">Any Value</td>
                <td className="border border-stone-200 p-2.5">Cash on Delivery (COD)</td>
                <td className="border border-stone-200 p-2.5">Standard Fee + ₹50 Handling Fee</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          3. Processing & Delivery Timelines
        </h2>
        <ul className="list-disc list-inside space-y-1.5 text-stone-600">
          <li><strong>Order Processing:</strong> All orders placed before 2:00 PM IST are verified and packaged on the same business day (excluding Sundays & National Gazetted Holidays).</li>
          <li><strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 2 to 4 business days.</li>
          <li><strong>Tier 2 & Tier 3 Cities / Rest of India:</strong> 3 to 6 business days.</li>
          <li><strong>Special Logistics Zones (J&K, North East, Remote Islands):</strong> 5 to 8 business days.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          4. Real-Time Tracking & Proof of Delivery (POD)
        </h2>
        <p>
          Once your parcel is dispatched, you will receive an SMS and email containing the Air Waybill (AWB) number and direct tracking URL. Customers can also track parcels 24/7 on our live <a href="/track" className="text-maroon-800 underline font-semibold">Track Shipment Portal</a>. High-value parcels require OTP verification at the time of delivery.
        </p>
      </section>
    </div>
  </div>
);

export const PrivacyPolicyPage = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
    <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
      <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-800 flex items-center justify-center border border-maroon-100">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Privacy & Data Protection Policy</h1>
        <p className="text-xs text-stone-500 mt-0.5">Compliant with DPDP Act, 2023 & Information Technology (SPDI) Rules, 2011</p>
      </div>
    </div>

    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          1. Data Fiduciary Commitment
        </h2>
        <p>
          <strong>Shagun Shine Cosmetics Private Limited</strong> acts as a Data Fiduciary under the <em>Digital Personal Data Protection (DPDP) Act, 2023</em> and the <em>Information Technology Act, 2000</em>. We are strictly committed to safeguarding your personal data, ensuring transparency, privacy, and military-grade encryption in all interactions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          2. Information We Collect
        </h2>
        <ul className="list-disc list-inside space-y-1.5 text-stone-600">
          <li><strong>Identity & Contact Details:</strong> Full name, email address, mobile phone number, billing and shipping addresses.</li>
          <li><strong>Transaction & Order History:</strong> Products ordered, payment status, invoice details, order timestamps (We do <em>not</em> store full Credit/Debit Card numbers or CVVs; these are encrypted by RBI-regulated payment gateways like Razorpay).</li>
          <li><strong>Device & Usage Data:</strong> IP address, browser type, device identifiers, session cookies solely used for maintaining shopping cart sessions.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          3. Lawful Purpose & Usage of Data
        </h2>
        <p>Your data is processed strictly for legitimate operational purposes:</p>
        <ul className="list-disc list-inside space-y-1 text-stone-600">
          <li>Fulfilling orders, preparing GST tax invoices, and shipping consignments.</li>
          <li>Delivering automated SMS, WhatsApp, and email shipping updates.</li>
          <li>Preventing fraud, bot traffic, and unauthorized chargebacks.</li>
          <li>Complying with statutory Indian audit, tax (GST/TDS), and legal obligations.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          4. No Sale or Unauthorized Sharing of Data
        </h2>
        <p>
          We maintain a zero-compromise policy: <strong>We never sell, rent, or trade your personal information</strong> to third-party telemarketers or advertisers. Data is shared only with verified logistics partners (couriers) and certified payment processors under strict non-disclosure obligations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          5. Customer Rights under DPDP Act 2023
        </h2>
        <p>As a data principal, you hold statutory rights:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs">
            <span className="font-bold text-stone-800">Right to Access & Rectify:</span> You may view and modify your saved profiles, addresses, and details at any time from your account panel.
          </div>
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs">
            <span className="font-bold text-stone-800">Right to Erasure / Deletion:</span> You may request complete erasure of your profile and data by emailing our designated Grievance Officer.
          </div>
        </div>
      </section>

      {/* Statutory Grievance Redressal Mechanism */}
      <section className="mt-8 pt-6 border-t border-stone-200 bg-maroon-50/50 p-5 rounded-2xl border border-maroon-100">
        <h2 className="font-serif font-bold text-maroon-900 text-base flex items-center gap-2 mb-2">
          <UserCheck className="w-5 h-5 text-maroon-800" />
          Statutory Grievance Redressal Officer
        </h2>
        <p className="text-xs text-stone-600 mb-3">
          In accordance with the <em>Information Technology Act, 2000</em> and <em>Consumer Protection (E-Commerce) Rules, 2020</em>, the contact details of the Grievance Officer are published below:
        </p>
        <div className="text-xs space-y-1 text-stone-700">
          <p><strong>Designation:</strong> Chief Grievance & Compliance Officer</p>
          <p><strong>Company:</strong> Shagun Shine Cosmetics Private Limited</p>
          <p><strong>Official Email:</strong> <a href="mailto:care@shagunshine.com" className="text-maroon-800 font-semibold underline">care@shagunshine.com</a> / <a href="mailto:shagunshine887@gmail.com" className="text-maroon-800 font-semibold underline">shagunshine887@gmail.com</a></p>
          <p><strong>Response Turnaround:</strong> Acknowledgment within <strong>48 hours</strong>; complete resolution within <strong>30 days</strong>.</p>
        </div>
      </section>
    </div>
  </div>
);

export const TermsConditionsPage = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
    <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
      <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-800 flex items-center justify-center border border-maroon-100">
        <FileText className="w-5 h-5" />
      </div>
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Terms of Service & Conditions</h1>
        <p className="text-xs text-stone-500 mt-0.5">Governed by the Indian Contract Act, 1872 & Consumer Protection Act, 2019</p>
      </div>
    </div>

    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          1. Acceptance of Terms
        </h2>
        <p>
          Welcome to the official digital platform of <strong>Shagun Shine Cosmetics Private Limited</strong> (&quot;Shagun Shine&quot;, &quot;we&quot;, &quot;us&quot;). By browsing, creating an account, or purchasing from this website, you acknowledge that you are at least 18 years of age and agree to be bound by these legally enforceable Terms & Conditions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          2. Product Authenticity & Legal Metrology Disclosures
        </h2>
        <p>
          All cosmetics, skin solutions, and perfumes sold on this portal are 100% genuine, cruelty-free, and manufactured in certified state-of-the-art facilities compliant with the <em>Drugs and Cosmetics Act, 1940</em>.
        </p>
        <ul className="list-disc list-inside space-y-1 text-stone-600">
          <li><strong>Pricing & MRP:</strong> All prices displayed are Maximum Retail Prices (MRP) in Indian Rupees (₹ INR) inclusive of applicable CGST/SGST/IGST taxes.</li>
          <li><strong>Net Quantity & Shelf Life:</strong> Every package explicitly lists net contents, manufacturing date, expiration date, and batch code.</li>
          <li><strong>Country of Origin:</strong> Proudly Made in India.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          3. Cosmetic Safety & Patch Test Advisory
        </h2>
        <p>
          Our formulations incorporate natural Ayurvedic botanicals, 24K gold foil, and active ingredients. Because individual skin types react differently to natural botanicals:
        </p>
        <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-amber-900 text-xs">
          <strong>Mandatory Patch Test:</strong> Customers are advised to conduct a small patch test on the inner wrist or forearm prior to full facial or skin application. In the rare event of irritation or allergic redness, discontinue use immediately. Shagun Shine products are cosmetic beauty formulations and are not intended to diagnose, treat, or cure clinical medical diseases.
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          4. Intellectual Property Rights
        </h2>
        <p>
          All trademarks, royal trade dress, product names, formulations, graphics, design assets, and logos appearing on this website are the proprietary intellectual property of Shagun Shine Cosmetics Private Limited. Reproduction or commercial exploitation without prior written consent is strictly prohibited under the <em>Trade Marks Act, 1999</em> and <em>Copyright Act, 1957</em>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          5. Governing Law & Dispute Resolution
        </h2>
        <p>
          These Terms of Service are governed by and construed in accordance with the substantive laws of the Republic of India. Any legal dispute, controversy, or claim arising out of or relating to this platform shall be subject to the exclusive jurisdiction of the competent civil courts situated at <strong>Gurugram / New Delhi, India</strong>.
        </p>
      </section>
    </div>
  </div>
);
