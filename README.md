# AutoParts Kenya - Frontend

A mobile-first, PWA-capable e-commerce web application for discovering and purchasing genuine automotive parts in Kenya. Built with Next.js 15, React 19, and TypeScript.

**Live at**: `http://localhost:3000` (development)

---

## 🎯 Quick Start

### Prerequisites
- Node.js ≥18.0.0
- npm or yarn
- Development backend running at `http://localhost:8000`

### Installation & Setup

```bash
# Clone the repository
cd autoparts_kenya_web

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router (pages)
│   ├── layout.tsx               # Root layout with TopAppBar, BottomNav, SideDrawer
│   ├── page.tsx                 # Home page with hero, vehicle selector, featured products
│   ├── search/page.tsx          # Search & filter with infinite scroll
│   ├── categories/page.tsx      # Category grid
│   ├── product/[id]/page.tsx    # Product detail with gallery, compatibility
│   ├── cart/page.tsx            # Shopping cart management
│   ├── checkout/page.tsx        # Multi-step checkout (guest/login/payment)
│   ├── profile/page.tsx         # User dashboard (orders, favorites, vehicles, settings)
│   ├── orders/[id]/page.tsx     # Order detail & tracking
│   ├── auth/
│   │   ├── login/page.tsx       # Login form
│   │   └── register/page.tsx    # 4-step registration stepper
│   └── admin/
│       ├── dashboard/page.tsx   # Owner stats & quick links
│       ├── products/page.tsx    # Product management table
│       └── orders/page.tsx      # Order management & status updates
├── components/
│   ├── layout/
│   │   ├── TopAppBar.tsx        # Sticky header (logo, search, cart, user menu)
│   │   ├── BottomNav.tsx        # Mobile bottom navigation (5 tabs)
│   │   └── SideDrawer.tsx       # Owner admin sidebar/drawer
│   ├── search/
│   │   ├── SearchInput.tsx      # Text + voice search
│   │   ├── FilterAccordion.tsx  # Reusable filter widget
│   │   └── SortingDropdown.tsx  # Sort options selector
│   ├── product/
│   │   ├── ProductCard.tsx      # Grid card with favorites & add-to-cart
│   │   ├── ProductGallery.tsx   # Image zoom, swipe, thumbnails
│   │   ├── CompatibilityTable.tsx # Vehicle compatibility
│   │   └── RelatedProductsCarousel.tsx # Similar products slider
│   └── common/
│       ├── Button.tsx           # 5 variants (primary, secondary, ghost, danger, success)
│       ├── Badge.tsx            # 7 types (genuine, secure, delivery, featured, etc.)
│       ├── Card.tsx             # 3 variants (default, elevated, outlined)
│       ├── LoadingSpinner.tsx   # Animated wheel spinner
│       └── EmptyState.tsx       # 6 types with bilingual support
├── stores/                       # Zustand state management (with persist)
│   ├── cartStore.ts            # Shopping cart (items, delivery, guest info)
│   ├── favoritesStore.ts       # Favorites list
│   ├── authStore.ts            # User auth & tokens (with refresh logic)
│   ├── appStore.ts             # UI state (menus, notifications, online status)
│   └── vehicleStore.ts         # Selected vehicle context
├── types/
│   ├── models.ts               # TypeScript models (Product, Order, User, etc.)
│   ├── api.ts                  # API request/response types
│   └── common.ts               # Enums & shared interfaces
├── lib/
│   ├── api.ts                  # Axios instance + typed API methods + interceptors
│   ├── constants.ts            # Colors, messages (EN/SW), delivery options, validation
│   ├── formatting.ts           # KSh currency, phone format, date/time utilities
│   └── utils.ts                # cn() classname utility
├── globals.css                  # Global styles, utilities, animations, accessibility
├── tailwind.config.ts           # Theme config (colors, fonts, animations, utilities)
└── next.config.mjs              # Image optimization, security headers
```

---

## 🏗️ Architecture Overview

### **Frontend Stack**
- **Framework**: Next.js 15 (App Router, Server Components)
- **UI Library**: React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4 + custom theme
- **Icons**: lucide-react (300+ icons)
- **State**: Zustand 4.4 (with localStorage persist)
- **HTTP**: Axios 1.6 (JWT interceptor, auto-refresh)
- **Animations**: framer-motion 10.16
- **Notifications**: react-hot-toast 2.4
- **Image**: next/image (optimized, lazy load)

### **Key Principles**

1. **Mobile-First**: Design prioritizes mobile (portrait), scales to tablet & desktop
2. **Guest-First**: No authentication required for browsing, searching, or adding to cart
3. **Offline Support**: Cart & favorites persist to localStorage, usable offline
4. **Type-Safe**: 100% TypeScript, strict mode, catches errors at compile-time
5. **Responsive**: Tailwind breakpoints (sm, md, lg) for flexible layouts
6. **Accessible**: ARIA labels, semantic HTML, keyboard navigation, high contrast
7. **Performant**: <2s initial load, code splitting, lazy images, infinite scroll

---

## 🎨 Design System

### **Color Palette**
```ts
// Tailwind config colors
reliable-red: #D32F2F        // CTAs, danger, discount badges
mechanic-blue: #1976D2       // Navigation, primary, links
trust-gold: #FBC02D          // Badges, certifications, featured
road-grey: 900/700/500/300/100  // Text, borders, backgrounds
success-green: #388E3C       // Confirmations, in-stock
warning-orange: #F57C00      // warnings, low stock
info-cyan: #0097A7           // info states
```

### **Typography**
```ts
// Montserrat Bold (headings)
H1: 28–32px / 32–36px
H2: 22px / 26px
H3: 18px / 22px
H4: 16px / 20px

// Open Sans Regular (body text)
body-lg: 16px / 24px
body-md: 14px / 20px  (default)
body-sm: 12px / 16px
badge: 11px / 16px
```

### **Spacing & Grid**
- **Baseline**: 8pt grid
- **Gutters**: 16px (mobile), 24px (tablet+)
- **Touch Targets**: ≥48×48dp
- **Card Padding**: 16px (mobile), 24px (desktop)

### **Animations**
```ts
spin-wheel: 360° continuous (loader)
scale-pop: 0→0.95→1.15 pop effect
fade-in: opacity 0→1
slide-up: translateY bounce
bounce-soft: subtle vertical
pulse-soft: opacity pulse
```

---

## 🔌 Backend Integration

### **API Configuration**

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### **API Methods** (in `lib/api.ts`)

```ts
// Auth
apiMethods.login(credentials)
apiMethods.register(userData)
apiMethods.refreshToken()

// Products
apiMethods.getProducts(filters)
apiMethods.getProductDetail(id)
apiMethods.getFeaturedProducts()
apiMethods.getCategories()

// Vehicles
apiMethods.getVehicleMakes()
apiMethods.getVehicleModels(make_id)

// Orders
apiMethods.getOrders()
apiMethods.getOrderDetail(id)
apiMethods.checkout(data)

// Payments
apiMethods.initiateSTKPush(phone, amount)
apiMethods.checkPaymentStatus(reference)

// Admin
apiMethods.adminGetDashboard()
apiMethods.adminGetOrders()
```

### **JWT Interceptor**

All requests automatically include `Authorization: Bearer {token}` header. On 401 response:
1. Attempts token refresh with `refresh_token`
2. Retries original request with new access token
3. Logs out user on refresh failure

See [API_INTEGRATION.md](./API_INTEGRATION.md) for full details.

---

## 🧠 State Management

### **Zustand Stores** (with localStorage persist)

```ts
// Cart
useCartStore()
  .items[]              // Product items with quantity
  .delivery             // Delivery method
  .subtotal, .total    // Calculated totals
  .addItem(), .removeItem(), .clearCart()

// Favorites
useFavoritesStore()
  .favorites[]
  .addFavorite(), .removeFavorite(), .toggleFavorite()

// Auth
useAuthStore()
  .user, .tokens
  .login(), .logout(), .getAccessToken(), .checkOwner()

// App (non-persisted, memory only)
useAppStore()
  .mobileMenuOpen, .sideDrawerOpen
  .notifications[], .isOnline
  .addNotification(), .setOnline()

// Vehicle
useVehicleStore()
  .selectedVehicle
  .setVehicle(), .getSelectedVehicleString()
```

---

## 📱 Key Pages

### **Public Pages**

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Hero, vehicle selector, featured products, categories |
| Search | `/search` | Advanced filters, infinite scroll, sorting |
| Categories | `/categories` | Category grid, browse by type |
| Product Detail | `/product/[id]` | Gallery, compatibility, reviews, related |
| Cart | `/cart` | Line items, delivery options, summary |
| Checkout | `/checkout` | Guest/login choice → address → payment → success |

### **Authenticated Pages**

| Page | Route | Purpose |
|------|-------|---------|
| Profile | `/profile` | Tabs: orders, favorites, vehicles, settings |
| Order Detail | `/orders/[id]` | Order tracking, items, delivery info |

### **Auth Pages**

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/auth/login` | Email + password form |
| Register | `/auth/register` | 4-step stepper (details → phone → password → vehicles) |

### **Admin Pages** (owner-only)

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/admin/dashboard` | Stats, quick links, recent orders |
| Products | `/admin/products` | Product table, search, edit/delete |
| Orders | `/admin/orders` | Order table, status filter, status updates |

---

## 🚀 Build & Deployment

### **Scripts**

```bash
npm run dev           # Start dev server (hot reload)
npm run build         # Production build
npm start             # Start production server
npm run lint          # ESLint + fix
npm run format        # Prettier format
npm run type-check    # TypeScript check
```

### **Environment Variables**

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### **Deployment Checklist**

- [ ] Set `NEXT_PUBLIC_API_URL` to production backend
- [ ] Review `next.config.mjs` security headers
- [ ] Test PWA (manifest, service worker, offline)
- [ ] Optimize images (remotePatterns, compression)
- [ ] Enable caching headers (static assets)
- [ ] Set up CDN for static content
- [ ] Monitor Core Web Vitals (Lighthouse)
- [ ] Test on actual devices (Android/iOS)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed steps.

---

## 📚 Documentation Files

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture, folder structure, patterns
- **[COMPONENTS.md](./COMPONENTS.md)** - Component library & usage examples
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Backend API integration, interceptors, error handling
- **[STYLING.md](./STYLING.md)** - Tailwind theme, colors, typography, custom utilities
- **[STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)** - Zustand stores, persistence, patterns
- **[ACCESSIBILITY.md](./ACCESSIBILITY.md)** - WCAG compliance, keyboard navigation, screen readers
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Build, hosting, PWA setup, performance optimization
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Code standards, conventions, pull request process

---

## 🔑 Key Features

✅ **Mobile-First**: Responsive design optimized for touch (48px+ targets)
✅ **Guest-First**: Browse, search, add to cart without login
✅ **Offline Cart**: Cart persists to localStorage, works offline
✅ **Voice Search**: Speak to search (Web Speech API)
✅ **Vehicle Selector**: Progressive make → model → year selection
✅ **M-Pesa Integration**: STK push, automatic payment prompts
✅ **Favorites**: Save products locally, sync when logged in
✅ **Order Tracking**: Real-time status updates
✅ **Admin Dashboard**: Owner analytics, product/order management
✅ **Accessible**: ARIA labels, keyboard nav, high contrast, Swahili

---

## 🐛 Troubleshooting

### Development Issues

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Styles not updating?**
```bash
rm -rf .next
npm run dev
```

**TypeScript errors?**
```bash
npm run type-check
```

### Common Problems

| Issue | Solution |
|-------|----------|
| API calls failing | Check `NEXT_PUBLIC_API_URL` in `.env.local` |
| Cart not persisting | Verify localStorage is enabled in browser |
| Images not loading | Check `next.config.mjs` remotePatterns |
| Mobile menu not working | Test on actual mobile device or DevTools device mode |

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more.

---

## 📞 Support

For issues or questions:
1. Check [CONTRIBUTING.md](./CONTRIBUTING.md) for code standards
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions
3. Check existing issues in GitHub
4. Create a new issue with details

---

## 📄 License

Proprietary - AutoParts Kenya

---

**Last Updated**: February 6, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
