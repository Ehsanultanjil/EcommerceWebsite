# BARAZ — E-Commerce Storefront (Supabase BaaS)

A full-stack e-commerce platform built directly on **Supabase as Backend-as-a-Service (BaaS)** — premium/minimal storefront, real authentication, instant checkout with atomic Postgres RPC, customer dashboard, and a working admin panel with Row Level Security (RLS).

---

## Architecture

```
Browser
  │  HTML5 / Vanilla CSS / Vanilla JS (no build step, instant load)
  ▼
Supabase BaaS (Postgres + Auth + Storage + RPC Functions + RLS)
```

The frontend communicates directly with Supabase via `@supabase/supabase-js`. Business logic, inventory management, price calculations, and data access control are secured at the database layer using **PostgreSQL Row Level Security (RLS)** and **Atomic Postgres RPC Functions**.

---

## Features

- **Storefront**: Responsive product catalog with category filtering, instant search, price ranges, and sorting.
- **Product Details**: Multi-tab interface (Description, Specifications, Reviews), image gallery, stock checking, and quantity stepper.
- **Cart Management**: Real-time cart synchronization directly in Postgres.
- **Atomic Checkout**: Server-side Postgres RPC (`checkout`) verifies stock, computes true totals, creates orders, decrements inventory, records payments, and empties the cart in a single transaction.
- **Customer Account**: Order history, live status tracking, order cancellation with stock restoration, wishlist, and saved addresses.
- **Admin Panel**: Role-based access control (`CUSTOMER` vs `ADMIN`), product management (Create, Read, Update, Delete), and order status management.

---

## Project Structure

```
frontend/             Static storefront pages, components, styles, and data clients
  assets/
    css/              Modular CSS design system
    js/
      components/     Reusable UI components (navbar, footer, toast, modal, product cards)
      pages/          Page controllers (shop, cart, checkout, account, admin)
      utils/          Supabase auth and BaaS client layer (api.js, auth.js)
supabase/
  migrations/         SQL migrations (schemas, RLS policies, RPC functions)
  seed.sql            Initial catalog and sample product data
server.mjs            Lightweight local dev server
```

---

## Running Locally

### 1. Prerequisites
- **Node.js** (v18+)

### 2. Configure Supabase Credentials
Ensure `frontend/assets/js/config.js` has your Supabase project URL and Anon (Publishable) key:
```javascript
const BARAZ_CONFIG = {
  SUPABASE_URL: 'https://<your-project-ref>.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_...',
};
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5500](http://localhost:5500) in your browser.

---

## Database Migrations & Administration

### Applying Migrations
Apply all SQL files in `supabase/migrations/` in chronological order to your Supabase Postgres database.

### Promoting a User to Admin
New user registrations default to the `CUSTOMER` role. To promote an account to `ADMIN`:
```sql
UPDATE public.profiles SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

---

## Deploying to Production

Since the application uses a pure static frontend and direct Supabase BaaS, you can deploy the `frontend/` folder to any static hosting service with zero server maintenance:
- **Vercel**: Deploy directory `frontend`
- **Netlify**: Publish directory `frontend`
- **GitHub Pages**: Serve from `frontend` or root
- **Cloudflare Pages**: Direct upload of `frontend`
