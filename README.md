# ✨ Shagun Shine Cosmetics - Full-Stack E-Commerce & Admin Platform

> **Shagun Shine Cosmetics** is a production-hardened, Indian-royal-inspired luxury cosmetics e-commerce platform featuring a customer-facing storefront and a complete administrative control console.

---

## 📋 Production Readiness & Launch Verification

| Subsystem | Readiness Status | Details |
| :--- | :---: | :--- |
| **Customer Storefront** | ✅ **READY** | Responsive UI (Mobile + Desktop), Category filters, Live search suggestions, Product detail, Wishlist, Bag, Dynamic SEO, and Static Policy pages. |
| **Admin Console & RBAC** | ✅ **READY** | Granular role-based permissions (`super_admin`, `product_manager`, `order_manager`, `inventory_manager`, `customer_support`, `marketing_manager`, `reports_viewer`). |
| **Indian GST Tax Engine** | ✅ **READY** | Automated B2C GST computation: Intra-state (CGST 9% + SGST 9%) vs Inter-state (IGST 18%), HSN `330499`, and sequential invoice number generator. |
| **Payment Gateway** | 🟡 **CONFIG** | Razorpay HMAC-SHA256 signature verification & Webhook idempotency implemented. Supports Mock Sandbox and Razorpay Live/Test modes. |
| **Shipping & Logistics** | 🟡 **CONFIG** | 6-digit Indian PIN serviceability engine, ₹999 free shipping threshold, and tracking workflow. Ready for Delhivery/Shiprocket API plug-in. |
| **Inventory & Concurrency** | ✅ **READY** | Atomic inventory transactions with `inventory_logs` ledger preventing negative stock and overselling. |
| **Returns & Refunds** | ✅ **READY** | Customer return request flow, admin moderation approval/rejection, and gateway refund triggers. |
| **Security & Auditing** | ✅ **READY** | `helmet` HTTP headers, `express-rate-limit`, bcrypt password hashing, sensitive cost price masking, and tamper-evident `audit_logs`. |
| **Demo Data Purge Tool** | ✅ **READY** | One-click safe purge mechanism in Admin Settings to wipe test orders and demo customers prior to official marketing launch. |

---

## 🌟 Brand & Design Aesthetic
- **Color Palette**: Royal Maroon (`#6B172E`, `#8B1E3B`), Shagun Gold (`#C5A049`, `#D8B45E`, `#F5EED9`), Blush Rose (`#FDF2F4`, `#F6E0E6`), and Ivory Cream (`#FAF7F2`).
- **Typography**: Playfair Display (Serif), Cormorant Garamond (Accent), and Inter (Modern Sans).
- **Design Experience**: Glassmorphism navigation, smooth micro-interactions, responsive mobile-first drawer, live magnifier image zoom, confetti checkout celebrations, and printable luxury invoices.

---

## 🚀 Key Features & Capabilities

### 🛍️ Customer-Facing Storefront
1. **Dynamic Homepage**:
   - Hero banner carousel with CTA links & promotion badges.
   - Brand trust guarantees (24K Pure Gold, 100% Cruelty-Free, Free Luxury Shipping, Dermatologist-Tested).
   - "Shop by Luxury Ritual" category highlights with live product counts.
   - Interactive Tabbed Showcase: Best Sellers, New Arrivals, Featured Collections.
   - Imperial Bridal Box promo spotlight with instant "Claim Trunk" CTA.
   - Customer Testimonials & Reviews carousel.
   - Community `#ShagunGlow` social gallery.
   - VIP newsletter subscription with instant discount codes.

2. **Catalog & Shop Listing (`/shop`)**:
   - Multi-attribute filter sidebar: Category & Subcategories, Price Slider (₹500 - ₹10,000), Skin Types (Oily, Dry, Sensitive, Combination), and Stock Availability.
   - Sort dropdown: Popularity, Top Rated, Newest, Price: Low to High, Price: High to Low.
   - Active filter chips with 1-click removal.
   - 3 / 4 column responsive grid view switcher.
   - Pagination controls.

3. **Product Detail Page (`/product/:slug`)**:
   - Responsive multi-image gallery with hover zoom magnifier lens.
   - Live discount calculation with percentage savings.
   - Shade selector swatches with real-time visual indicator.
   - Real-time stock status badge and Pincode delivery serviceability checker.
   - "Add to Luxury Bag" (drawer trigger) & "Buy Now" (direct to checkout).
   - Detailed tabbed accordions: Full Description, Complete Ingredients List, Ritual Guide, Clean Beauty Promise.
   - Customer Reviews breakdown: 5-star distribution chart, verified buyer reviews, and interactive "Write a Review" form with star selector.
   - "You May Also Adore" related formulations carousel.

4. **Interactive Luxury Cart Drawer & Page (`/cart`)**:
   - Slide-out cart drawer with live subtotal.
   - Free luxury shipping goal progress bar (Threshold: ₹999).
   - Promo coupon code validator with instant discount deduction & celebration confetti.
   - Complimentary luxury gold-ribbon gift box and custom handwritten note option.

5. **Multi-Step Luxury Checkout (`/checkout`)**:
   - Step 1: Contact details & Saved address picker (or new address form).
   - Step 2: Payment method simulator with Razorpay HMAC verification:
     - **UPI / QR**: Realistic live QR code + UPI apps (GPay, PhonePe, Paytm).
     - **Credit / Debit Card**: Interactive live luxury virtual card preview.
     - **Cash on Delivery (COD)**.
     - **Net Banking**: HDFC, ICICI, SBI, Axis, Kotak.
   - Step 3: Order placement & invoice generator with order number, tracking number, carrier assignment, and printable receipt.

6. **Customer Portal (`/account`)**:
   - Profile settings (name, email, phone) & password updates.
   - Order history with live milestone timeline.
   - Address book (Add, delete, default).
   - Saved Wishlist with 1-click "Move All to Bag".

7. **Order Tracking Radar (`/track`)**:
   - Search by Order # (e.g. `SS-2026-8901`) or Tracking ID.
   - 5-milestone step timeline: **Placed → Packed → Shipped → Out for Delivery → Delivered**.

8. **Informational & Policy Pages**:
   - About Us, Contact Concierge, FAQ Knowledge Base, Return & Refund Policy, Shipping Policy, Privacy Policy, Terms & Conditions.

---

### 👑 Protected Admin Panel (`/admin`)
Access via `/admin` or `/admin/login`. Protected by role-based authorization middleware (`verifyToken`, `isAdmin`, `isStaff`, `requirePermission`).

**Admin Modules:**
1. **Executive Dashboard (`/admin`)**: Metric cards, revenue chart, recent orders table, top SKUs.
2. **Product Catalog Manager (`/admin/products`)**: Full CRUD, cosmetic compliance (HSN, GST, ingredients, batch, mfg/exp), sensitive cost price protection.
3. **Category Management (`/admin/categories`)**: Categories, banner imagery, subcategory tags.
4. **Order Management (`/admin/orders`)**: Filter by status, update shipment status, carrier assignment, tracking numbers.
5. **Returns & Refunds (`/admin/returns`)**: Review customer return requests, inspect reasons, approve/reject, initiate gateway refunds.
6. **Customer Management (`/admin/customers`)**: View customer accounts, aggregate lifetime spend, 1-click block/unblock.
7. **Coupons & Discounts (`/admin/coupons`)**: Percentage or flat discounts, usage limits, user limits.
8. **Reviews Moderation (`/admin/reviews`)**: Approve, reject, delete reviews.
9. **Inventory Matrix (`/admin/inventory`)**: Stock control matrix, low-stock alerts, audit logging on adjustments.
10. **Hero Banners & Content (`/admin/banners`)**: Live hero carousel management.
11. **Staff & Roles (`/admin/staff`)**: Role assignments and access permissions.
12. **Analytics & Reports (`/admin/reports`)**: Sales reports, category breakdown, CSV export.
13. **Audit Trail (`/admin/audit-logs`)**: Filterable, searchable audit log of all administrative actions.
14. **Settings & Launch (`/admin/settings`)**: Store profile, GST configuration, Razorpay keys, shipping fees, SEO, and **Purge Demo Data** launcher.

---

## 🔑 Super Admin Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **👑 Super Admin** | `shagunshine887@gmail.com` | `@ShagunShinecosmetics887` | Full unrestricted access to all admin modules, settings & catalog |

---

## 🛠️ Tech Stack & Architecture

- **Backend**: Node.js, Express, SQLite (Universal adapter with built-in `node:sqlite` / `better-sqlite3`), JSON Web Tokens (JWT), Bcrypt.js, Helmet, Express Rate Limit, Multer.
- **Frontend**: React 18 / 19, Vite, Tailwind CSS with custom luxury theme extensions, Lucide React icons, Recharts, Canvas Confetti.
- **Database**: Embedded SQLite database (`server/data/shagun_shine.db`) with automatic table migration and pre-seeded realistic luxury cosmetics dataset.

---

## 💻 How to Run Locally

### 1. Installation
```bash
# Install dependencies
npm install --ignore-scripts
```

### 2. Run Automated Integration Tests
```bash
node server/tests/test_suite.js
```

### 3. Run Development Servers
Start both the backend API server and Vite client concurrently:
```bash
npm run dev
```

- **Storefront URL**: [http://localhost:5173](http://localhost:5173)
- **Admin Portal URL**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend API URL**: [http://localhost:5000/api](http://localhost:5000/api)
- **Sitemap XML**: [http://localhost:5000/sitemap.xml](http://localhost:5000/sitemap.xml)
- **Robots TXT**: [http://localhost:5000/robots.txt](http://localhost:5000/robots.txt)

---

## 📖 Client Handover Manual
Refer to [`CLIENT_HANDOVER.md`](./CLIENT_HANDOVER.md) for full operational, GST compliance, payment gateway setup, and live handover procedures.
