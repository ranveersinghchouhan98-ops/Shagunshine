# 🚀 Shagun Shine Cosmetics — GoDaddy Deployment Guide

This guide covers how to deploy the Shagun Shine luxury e-commerce platform to GoDaddy in under 5 minutes.

---

## 📦 What Are the Two ZIP Files Provided?

We have generated **two deployment-ready ZIP archives** tailored for GoDaddy hosting plans:

| File Name | Purpose | Recommended GoDaddy Hosting |
| :--- | :--- | :--- |
| **`shagun-shine-godaddy-fullstack.zip`** | **Complete Full-Stack Application**<br>(Node.js API + SQLite Database + Pre-built React Frontend + Admin Console) | **GoDaddy cPanel Hosting with "Setup Node.js App"** or **GoDaddy VPS / Dedicated Server** |
| **`shagun-shine-godaddy-static-public_html.zip`** | **Instant Frontend Storefront**<br>(Pre-built React static files + `.htaccess` with SPA routing + offline catalog & cart) | **GoDaddy Standard Shared Hosting** (Starter, Economy, Deluxe) where you only upload to `public_html` |

---

## 🌟 METHOD 1: Full-Stack Deployment (Recommended)
*(For GoDaddy cPanel with "Setup Node.js App" or VPS)*

### Step 1: Upload & Extract the ZIP
1. Log in to your **GoDaddy Account** → Go to **My Products** → Click **Manage** next to your Web Hosting.
2. Click **cPanel Admin**.
3. Open **File Manager** from the cPanel dashboard.
4. In your root home directory (e.g. `/home/username/`), create a new folder named `shagun-shine` (or navigate to your application root).
5. Click **Upload** in the top menu and select **`shagun-shine-godaddy-fullstack.zip`**.
6. Once uploaded (progress bar turns 100% green), right-click the file and click **Extract**.

### Step 2: Configure Node.js Application in cPanel
1. In cPanel, search for and click **"Setup Node.js App"** (under Software section).
2. Click the blue **"Create Application"** button.
3. Fill in the following fields:
   - **Node.js version:** Select `20.x` or `18.x` (recommended `20.x`).
   - **Application mode:** Select `Production`.
   - **Application root:** Enter `shagun-shine` (the folder where you extracted the zip).
   - **Application URL:** Select your domain (e.g. `shagunshine.com` or your chosen domain/subdomain).
   - **Application startup file:** Enter `app.js` (or `server/server.js`).
4. Click **Create** in the top right.

### Step 3: Install Server Dependencies & Set Environment
1. After the app is created, you will see a button labeled **"Run NPM Install"**. Click it. cPanel will automatically install dependencies for Linux.
2. Under the **Environment variables** section in the Node.js App panel, you can add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (or leave default assigned by cPanel)
   - `JWT_SECRET` = `generate_any_strong_random_secret_string_here`
   - `ALLOW_MOCK_PAYMENTS` = `true`
3. Click **Save** and then click **Restart**.

### Step 4: Visit Your Live Website!
- Open your domain in the browser (e.g. `https://yourdomain.com`).
- The full luxury storefront and admin dashboard are live!

---

## ⚡ METHOD 2: Direct Upload to `public_html` (Static Web Hosting)
*(For basic GoDaddy shared hosting plans without terminal or Node.js)*

If your GoDaddy plan is standard shared hosting where you only have `public_html`:

1. Open **GoDaddy cPanel** → **File Manager**.
2. Navigate inside the **`public_html`** folder.
3. If there is a default GoDaddy placeholder file like `default.html` or `hostingstart.html`, delete it.
4. Click **Upload** in the top bar and select **`shagun-shine-godaddy-static-public_html.zip`**.
5. After upload completes, right-click the zip file in File Manager and select **Extract** directly into `public_html`.
6. Verify that `index.html` and `.htaccess` are directly inside `public_html` (not nested in an extra folder).
7. Visit your domain: `https://yourdomain.com`.
   - The `.htaccess` file ensures that all React Router links (`/shop`, `/product/...`, `/track-order`, `/checkout`, `/admin`) route without 404 errors.
   - The storefront uses high-speed cached assets with pre-loaded luxury catalogs and built-in mock/demo fallback.

---

## 👑 Admin Panel Access

To access your administrative control panel:
- **Admin URL:** `https://yourdomain.com/admin`
- Set your own administrator email and password in the cPanel environment variables (`INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD`), or configure directly upon first launch.
- No plain-text administrator credentials are stored in the deployment package for security.

---

## 🛠️ Need to Connect Live Razorpay Payments?
When you are ready to switch from Test to Live payments:
1. Log in to the Admin Console at `/admin`.
2. Go to **Settings & Launch** → **Payment Gateway** tab.
3. Paste your live **Razorpay Key ID** and **Razorpay Key Secret**.
4. Set **Active Payment Mode** to **Live**.
5. Click **Save Changes**.
