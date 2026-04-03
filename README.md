# DNC Creates — Complete Project Documentation

---

## 1. Project Title & Overview

### Project Name
**DNC Creates** — A Handcrafted Jewellery E-Commerce Platform

### What the Project Does
DNC Creates is a full-featured, cloud-connected e-commerce web application for a handcrafted jewellery brand. It allows customers to browse, search, wishlist, and purchase jewellery products online. The platform also includes a fully secured admin panel for the store owner to manage products, track customer messages, and handle inventory — all in real time.

### Problem It Solves
Small and independent jewellery brands often lack a dedicated, professional digital storefront that can compete with large platforms. DNC Creates solves this by providing:
- A branded, aesthetically premium online store for a sole-proprietor jewellery brand.
- A real-time inventory management system for the owner without needing third-party tools.
- A direct communication channel between the brand and its customers.

### Target Users
| User Type | Description |
|-----------|-------------|
| **Customers** | Women aged 18–40 looking for premium, handcrafted jewellery (rings, lockets, keychains, bracelets) |
| **Admin / Store Owner** | A single authorized administrator who manages products and customer enquiries |

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | Core UI library |
| Vite | 8.x | Build tool & dev server |
| Tailwind CSS | 4.x | Utility-first styling |
| Framer Motion | 12.x | Page & component animations |
| Lucide React | 0.479.x | Icon library |
| React Router DOM | 7.x | Client-side routing |

### Backend / BaaS (Backend-as-a-Service)
| Technology | Purpose |
|------------|---------|
| Firebase Authentication | User sign-in, registration, Google OAuth, password reset |
| Firebase Firestore | Real-time NoSQL database for products, orders, carts, wishlists, and messages |

### Database
**Firebase Firestore** — Cloud-hosted NoSQL document database.

**Collections:**
- `products` — Product catalog synced in real time
- `carts` — Per-user shopping cart (cloud-synced)
- `orders` — Order history per user
- `users` — User profiles and wishlist data
- `messages` — Customer contact form submissions

### APIs Used
| API | Purpose |
|-----|---------|
| **Cloudinary** | Cloud image hosting and delivery with on-the-fly optimization (product images) |
| **Firebase Auth REST API** | Authentication provider (email/password, Google Sign-In) |
| **Firebase Cloud Firestore** | Real-time data sync API |

### Authentication
- **Email & Password** login and registration
- **Google OAuth** via Firebase Sign-In with Popup
- **Password Reset** via Firebase's `sendPasswordResetEmail`
- **Role-based access control**: Admin identified by a single environment variable `VITE_ADMIN_EMAIL`

### Deployment Platforms
- **Netlify** — for hosting the production build with redirect rules (`_redirects` file for SPA routing)

### Other Tools & Libraries
- **Google Fonts** — Cormorant Garamond (display), Jost (body), Great Vibes (accent)
- **Vite Plugin React** — Fast refresh for development
- **ESLint** — Code quality
- **PostCSS / Autoprefixer** — CSS processing

---

## 3. System Architecture

### How the System Works (Step-by-Step)

```
User visits DNC Creates website
        ↓
React SPA loads (Vite-built, hosted on Netlify)
        ↓
Firebase Auth checks user session
        ↓
  ┌─────────────────────────────────────┐
  │  Unauthenticated User               │
  │  - Browse products (public)         │
  │  - Add to cart (localStorage)       │
  └─────────────────────────────────────┘
        ↓
  ┌─────────────────────────────────────┐
  │  Authenticated User                 │
  │  - Cart synced to Firestore         │
  │  - Wishlist stored in user doc      │
  │  - Can view order history           │
  └─────────────────────────────────────┘
        ↓
  ┌─────────────────────────────────────┐
  │  Admin User (VITE_ADMIN_EMAIL match)│
  │  - Admin Dashboard access           │
  │  - Product CRUD + Image Upload      │
  │  - View & manage contact messages   │
  └─────────────────────────────────────┘
```

### Data Flow

**Product Browsing:**
`Firestore (products collection)` → `useProducts hook (real-time listener)` → `Shop / Home pages`

**Cart Management:**
`User action (Add/Remove/Update)` → `CartContext` → `Firestore (carts/{uid})` *(if logged in)* or `localStorage` *(if guest)*

**Cart Merge on Login:**
`localStorage cart` + `Firestore cart` → `Merged cart` → `Firestore (carts/{uid})`

**Product Upload (Admin):**
`Admin selects image` → `Cloudinary API (direct upload with progress)` → `Secure URL returned` → `Saved to Firestore (products collection)`

**Contact Form:**
`Customer fills form` → `Firestore (messages collection)` → `mailto: link triggered for owner` → `Admin reads/deletes from Dashboard`

### External Integrations
| Integration | Direction | Purpose |
|-------------|-----------|---------|
| Firebase Auth | Frontend ↔ Firebase | User identity management |
| Firestore | Frontend ↔ Firebase | Real-time data |
| Cloudinary | Admin Frontend → Cloudinary | Product image uploads |
| Google Fonts CDN | Browser ← CDN | Typography |

---

## 4. Features (Detailed)

### Customer-Facing Features

| Feature | Description |
|---------|-------------|
| **Hero Landing Page** | Full-screen animated hero with brand monogram, sparkle animations, and CTA buttons |
| **Product Catalog** | Browse all handcrafted products. Supports filtering by category and keyword search |
| **Category Navigation** | Quick navigation strip for Rings, Lockets, Keychains, Bracelets |
| **Product Detail Page** | Multi-image product viewer, description, price, original price with strike-through, badge label, stock status |
| **Skeleton Loading** | Product card skeleton screens during Firestore data fetch — prevents layout shift |
| **Shopping Cart** | Add/remove/update quantity. Cart persists via `localStorage` for guests and Firestore for logged-in users |
| **Cart Merge** | On login, local guest cart is intelligently merged with cloud cart (taking the higher quantity per item) |
| **Wishlist** | Authenticated users can save products to a wishlist, synced to their Firestore user document |
| **User Authentication** | Email/password signup & login, Google OAuth sign-in |
| **Forgot Password** | Users can request a Firebase password reset email from the login page |
| **Order History** | Authenticated users can view all past orders with status, item details, and total |
| **Contact Form** | Categorized enquiry form (General, Custom Order, Return, etc.) saved to Firestore and triggers mailto for the owner |
| **About Page** | Brand story, mission, vision, and promise sections with animated cards |
| **Global Search** | Instant product search from the navbar, navigates to filtered shop results |
| **Responsive Design** | Fully responsive for mobile, tablet, and desktop. Mobile dropdown navigation included |

### Admin Features

| Feature | Description |
|---------|-------------|
| **Secured Admin Login** | Admin-only login restricted to the configured `VITE_ADMIN_EMAIL` environment variable |
| **Admin Dashboard** | Sidebar layout with tabs for Products and Messages |
| **Product Management Table** | Lists all products with image, category, price, stock status, edit/delete actions |
| **Add Product** | Modal form with drag-and-drop image upload, multi-image support, field validation |
| **Edit Product** | Pre-filled modal form, supports adding/removing images on existing products |
| **Delete Product** | Confirmation dialog before deleting a product from Firestore |
| **Image Upload (Cloudinary)** | Per-image real-time progress bars and overall upload progress indicator |
| **Featured Toggle** | Admin can mark products as "Featured" to display them on the homepage |
| **Stock Toggle** | Admin can set products in/out of stock |
| **Product Badges** | Admin can add text badges (e.g., "Bestseller", "New Arrival") |
| **Original Price** | Optional original price for showing discounts |
| **Messages Panel** | View all customer contact form submissions, mark as read/unread, delete messages |

---

## 5. Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| **Cart sync between guest and logged-in state** | Implemented a smart merge strategy in `CartContext` that fetches both localStorage and Firestore carts on login, and merges them by taking the maximum quantity for matching items |
| **Real-time product updates without page refreshes** | Used Firestore's `onSnapshot` listener in the `useProducts` hook to subscribe to live changes |
| **Admin access control without a backend** | Hardened admin auth by verifying the logged-in user's email against a server-side environment variable (`VITE_ADMIN_EMAIL`), with a secondary timeout check to handle edge cases |
| **Multiple product image uploads with progress** | Used `XMLHttpRequest` directly (instead of `fetch`) for each Cloudinary upload to track `upload.onprogress` events and display per-image progress bars |
| **Responsive navigation handling** | Implemented a separate mobile overlay menu with `AnimatePresence` and auto-close on route change |
| **Image performance** | Built a custom `optimizeImage` utility that automatically applies Cloudinary and Unsplash URL transformations (WebP format, width, quality) |
| **SEO on a SPA** | Added proper `<title>`, meta descriptions, and semantic HTML (`<h1>`, `<header>` tags) per page |

---

## 6. Performance & Optimization

| Optimization | Details |
|--------------|---------|
| **Image Format (WebP)** | `imgUtils.js` converts Cloudinary and Unsplash image URLs to WebP format with quality controls |
| **Cloudinary Auto-Format** | Images delivered in the optimal format for each browser via `f_auto` |
| **Font Preloading** | Google Fonts loaded with `rel="preload"` and `media="print" onload="this.media='all'"` for non-blocking font loading |
| **Hero Image Preloading** | Brand logo preloaded in `<head>` with `<link rel="preload" as="image">` |
| **Lazy Loading** | Non-critical images (e.g., CTA background) use `loading="lazy"` |
| **Skeleton Screens** | `ProductSkeleton` component shown during Firestore fetch to improve perceived performance |
| **Mobile Animation Reduction** | Heavy sparkle animations on the hero section are suppressed on mobile using CSS (`hidden sm:block`) to reduce CPU load |
| **Framer Motion Optimization** | Used `willChange: 'opacity'` hint on animating elements for GPU compositing |
| **Firestore Fallback** | If Firestore is unreachable or empty, the app falls back to static product arrays — ensuring the site still renders |
| **Real-Time Listeners** | Unsubscribed from Firestore listeners on component unmount to prevent memory leaks |

---

## 7. Security

| Security Measure | Implementation |
|-----------------|----------------|
| **Firebase Authentication** | All auth is handled by Firebase — passwords are never stored in the application or database |
| **Admin Route Guards** | `RequireAdmin` HOC redirects any non-admin user to `/admin/login`. Admin status verified against `VITE_ADMIN_EMAIL` env var |
| **Auth Route Guards** | `RequireAuth` HOC protects wishlist, order history, and other private routes from unauthenticated access |
| **Firestore Security Rules** | (Recommended) Firestore rules should be configured to allow writes from authenticated users only and admin operations from the admin email only |
| **Environment Variables** | All sensitive credentials (Firebase keys, Cloudinary keys, admin email) are stored in `.env` and never committed to version control (listed in `.gitignore`) |
| **No Plain-Text Passwords** | Password reset handled via Firebase's secure `sendPasswordResetEmail` — users never enter old passwords to reset |
| **Secure Image Uploads** | Cloudinary uses upload presets for unsigned uploads — the API secret is never exposed on the client side |

---

## 8. Deployment Details

### Hosting
| Platform | Purpose |
|----------|---------|
| **Netlify** | Hosts production React build. Auto-configured for SPA routing |

### SPA Routing
A `_redirects` file in `public/` handles client-side routing:
```
/*  /index.html   200
```
This ensures direct URL access (e.g., `/shop`) doesn't return a 404 from Netlify.

### Environment Setup
Environment variables for Firebase, Cloudinary, and Admin configuration must be added to the Netlify dashboard (or your hosting provider) under **Site Settings → Build & Deploy → Environment Variables**. These are kept private and are not included in the source code.


### Build Command
```bash
npm run build
```

### Dev Server
```bash
npm run dev
```

### CI/CD
Currently deployed manually via Netlify's drag-and-drop or CLI. No automated CI/CD pipeline is configured.

---

## 9. Future Improvements

| Feature | Description |
|---------|-------------|
| **Payment Integration** | Integrate Razorpay or Stripe for real-time online checkout and order placement |
| **Order Management (Admin)** | Allow admin to update order status (Pending → Shipped → Delivered) from the dashboard |
| **WhatsApp Integration** | "Order via WhatsApp" button on product pages for direct inquiries |
| **Product Reviews & Ratings** | Let customers leave reviews on individual products |
| **Stock Quantity Tracking** | Replace boolean inStock with numeric quantity and auto-update on purchase |
| **Promo Codes / Coupons** | Admin panel for creating and managing discount codes |
| **Push Notifications** | Notify admin of new orders or messages via Firebase Cloud Messaging |
| **PWA Support** | Convert to a Progressive Web App for offline browsing and mobile installation |
| **SEO Improvements** | Add dynamic `<meta>` tags per product page and a sitemap |
| **Analytics Dashboard** | Admin view for sales data, top products, and customer trends |
| **Multi-language Support** | Localization for a broader Indian audience (Hindi, Tamil, etc.) |

---

## 10. Learning Outcomes

### Skills Gained
- Building and structuring a full-stack-like React application with Firebase as a BaaS
- Implementing complex state management using React Context API (Auth, Cart, Wishlist)
- Real-time data synchronization using Firestore `onSnapshot` listeners
- Handling file uploads with progress tracking using raw `XMLHttpRequest`
- Designing and implementing role-based access control in a frontend application
- Applying performance optimization techniques (WebP, lazy loading, skeleton screens, animation gating)
- Responsive UI development with Tailwind CSS and Framer Motion
- Deploying a production application to Netlify with SPA routing configuration

### Technologies Learned
- **Firebase Suite**: Auth, Firestore, and password reset email workflow
- **Cloudinary**: Unsigned image upload presets, URL transformation API
- **Framer Motion**: Complex animation variants, `AnimatePresence`, scroll-based transforms
- **Vite**: Module bundling, env variable management, plugin ecosystem
- **React Router v7**: Nested routes, route guards, `useLocation`, `useNavigate`
- **Tailwind CSS v4**: Design tokens, responsive utilities, custom configuration

---

## 11. Short Summary (Resume / LinkedIn)

> **DNC Creates** is a full-stack e-commerce web application built for a handcrafted jewellery brand using **React, Firebase (Auth + Firestore), Cloudinary, and Tailwind CSS**. The platform features real-time product management, cloud-synced shopping cart with guest-to-user merge, Google OAuth and email authentication, a secured admin dashboard with multi-image Cloudinary uploads, and an order/contact management system — all deployed on Netlify.

---

*Documentation generated: April 2026*
*Project: DNC Creates | Developer: Paula*
