# 🛍️ BARAZ — Modern E-Commerce Platform

BARAZ is a fast, full-featured e-commerce website built with modern **HTML5, Vanilla CSS, and JavaScript**, powered directly by **Supabase** as a Backend-as-a-Service (BaaS).

No complicated backend setup, Java, or servers to configure — everything runs smoothly and securely right out of the box!

---

## 🚀 Quick Start (Run in 2 Minutes)

### Step 1: Clone the Repository & Install Dependencies
Open your terminal and run:
```bash
git clone https://github.com/Ehsanultanjil/EcommerceWebsite.git
cd EcommerceWebsite
npm install
```

### Step 2: Start the Local Development Server
```bash
npm run dev
```

### Step 3: Open in Your Browser
Open your browser and visit:
👉 **[http://localhost:5500](http://localhost:5500)**

That's it! Your store is live locally. 🎉

---

## ⚙️ Supabase Configuration

The project is already pre-configured to connect to Supabase. If you are using your own Supabase project:

1. Open [`frontend/assets/js/config.js`](file:///frontend/assets/js/config.js)
2. Put your **Supabase URL** and **Anon (Publishable) Key**:
   ```javascript
   const BARAZ_CONFIG = {
     SUPABASE_URL: 'https://your-project-ref.supabase.co',
     SUPABASE_ANON_KEY: 'your-publishable-anon-key',
   };
   ```

### 💡 Tip: Instant Sign-Up Without Waiting for Emails
To let users and admins sign up and log in immediately without confirmation emails:
1. Go to your **Supabase Dashboard** → **Authentication** → **Providers** → **Email**.
2. Turn **OFF** the toggle for **"Confirm email"** and click **Save**.

---

## 👑 Admin Setup

By default, every new user registers as a **CUSTOMER**. To create or promote an **ADMIN**:

1. Register an account on the website (or create a user in **Supabase Dashboard** → **Authentication** → **Users**).
2. Go to your **Supabase Dashboard** → **SQL Editor** and run:
   ```sql
   UPDATE public.profiles SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```
3. Log in at **`http://localhost:5500/login.html`**.
4. The system will automatically recognize your role and redirect you straight to the **Admin Dashboard** (`/admin/dashboard.html`).

---

## 🌟 Key Features

- **🛒 Product Storefront**: Responsive catalog with category filters, instant keyword search, price range filtering, and sort options.
- **🔍 Product Details**: Tabbed interface (Description, Specifications, Customer Reviews), image previews, and live stock tracking.
- **🛍️ Cart & Atomic Checkout**: Real-time cart synchronization directly in the database. When ordering, PostgreSQL RPC automatically checks inventory, computes true prices, decrements stock, records the payment, and empties the cart in a single secure transaction.
- **📦 Customer Dashboard**: Track live order statuses (`Confirmed`, `Processing`, `Shipped`, `Delivered`), view itemized receipts, cancel pending orders with automatic stock restoration, and manage wishlists.
- **📊 Admin Panel**: Manage products (Add new products, edit details, update stock, delete) and update order statuses in real-time.
- **🔒 Secure by Design**: Powered by PostgreSQL Row Level Security (RLS) policies and role protections.

---

## 📁 Project Structure

```
├── frontend/             # All website pages, styles, and scripts
│   ├── index.html        # Store homepage
│   ├── shop.html         # Product catalog & search
│   ├── product.html      # Product detail page
│   ├── cart.html         # Shopping cart
│   ├── checkout.html     # Secure checkout
│   ├── account.html      # Customer dashboard
│   ├── login.html        # Sign in & role redirect
│   ├── register.html     # Customer registration
│   ├── admin/            # Admin portal (Products, Orders, Dashboard)
│   └── assets/
│       ├── css/          # Modular styling (variables, base, navbar, etc.)
│       └── js/
│           ├── utils/    # Supabase BaaS connection & auth handlers
│           ├── pages/    # Page-specific business logic
│           └── components/ # Navbar, footer, modal, and toast components
├── supabase/
│   ├── migrations/       # Database tables, triggers, RPCs, & RLS policies
│   └── seed.sql          # Sample categories & products
├── server.mjs            # Lightweight local dev server
└── package.json          # Project scripts and dependencies
```

---

## 🌐 Deploying to Production (Free & 1-Click)

Because BARAZ uses a clean static frontend + Supabase BaaS, you can deploy the `frontend/` folder to any static host in seconds for free:

- **[Vercel](https://vercel.com)**: Import repository and set the Root Directory to `frontend`.
- **[Netlify](https://netlify.com)**: Import repository and set the Publish Directory to `frontend`.
- **[GitHub Pages](https://pages.github.com)**: Enable GitHub Pages from repository settings.
- **[Cloudflare Pages](https://pages.cloudflare.com)**: Connect your repo and set build output directory to `frontend`.
