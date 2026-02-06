# Frontend Architecture

## System Design

```
┌─────────────────────────────────────────────────────┐
│           Next.js 15 App Router                      │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  Layout (Top/Bottom Nav, Side Drawer)        │  │
│  │                                              │  │
│  │  ┌──────────────────────────────────────┐   │  │
│  │  │  Page Component                      │   │  │
│  │  │  (Home, Search, Product, etc.)       │   │  │
│  │  │                                      │   │  │
│  │  │  Uses Zustand Stores                 │   │  │
│  │  │  Calls API Methods (Axios)           │   │  │
│  │  │  Renders Common + Feature Components │   │  │
│  │  └──────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│  State Management (Zustand Stores)                  │
│  Auth | Cart | Favorites | Vehicle | App Stores    │
│  (Persisted to localStorage)                        │
└─────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│  HTTP Client (Axios Interceptor)                    │
│  - JWT Bearer Token                                  │
│  - Auto Token Refresh (401)                         │
│  - Error Handling                                    │
└─────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│  Django REST API (Backend)                          │
│  http://localhost:8000/api/v1                       │
└─────────────────────────────────────────────────────┘
```

---

## Folder Structure & Responsibilities

### `/app` - Pages & Routing

Next.js App Router structure. Each folder represents a route.

```
app/
├── layout.tsx                    # Root layout (80 lines)
│   ├── Renders TopAppBar (sticky header)
│   ├── Renders BottomNav (mobile navigation)
│   ├── Renders SideDrawer (admin + navigation)
│   ├── Renders Outlet (page content)
│   ├── Setup framer-motion provider
│   └── Setup Toaster for notifications
│
├── page.tsx                      # Home page (240 lines)
│   ├── Hero banner with tagline
│   ├── Vehicle make selector (3-column grid)
│   ├── Popular parts carousel
│   ├── Featured products section
│   ├── Category carousel/links
│   └── Calls getProducts(), getCategories() APIs
│
├── (public)/
│   ├── search/page.tsx           # Search page (280 lines)
│   ├── categories/page.tsx       # Category grid (150 lines)
│   ├── product/[id]/page.tsx     # Product detail (380 lines)
│   ├── cart/page.tsx             # Shopping cart (240 lines)
│   └── checkout/page.tsx         # Multi-step checkout (520 lines)
│
├── (auth)/
│   ├── auth/login/page.tsx       # Login form (220 lines)
│   └── auth/register/page.tsx    # Registration stepper (420 lines)
│
├── (protected)/
│   ├── profile/page.tsx          # User profile dashboard (480 lines)
│   └── orders/[id]/page.tsx      # Order detail (300 lines)
│
└── admin/
    ├── dashboard/page.tsx        # Admin stats (300 lines)
    ├── products/page.tsx         # Admin products list (250 lines)
    └── orders/page.tsx           # Admin orders list (320 lines)
```

**Design**: Each page imports its own components, calls APIs via `apiMethods`, and reads/writes state from Zustand stores.

---

### `/components` - Reusable UI Components

Organized by feature/layer.

#### **Layout Components**
```
components/layout/
├── TopAppBar.tsx (100 lines)
│   ├── Logo / brand
│   ├── Search input (mobile: icon, desktop: full input)
│   ├── Cart icon (badge count)
│   ├── User avatar (menu: Profile/Settings/Logout)
│   ├── Mobile: search icon toggles search input
│   └── Sticky, z-50, shadow
│
├── BottomNav.tsx (80 lines)
│   ├── 5 tabs: Home, Search, Categories, Cart, Profile
│   ├── Icons + labels
│   ├── Active tab highlight (mechanic blue)
│   ├── Fixed bottom, mobile-only
│   └── z-40, safe-area padding
│
└── SideDrawer.tsx (150 lines)
    ├── Admin navigation (if is_owner)
    ├── Settings menu
    ├── Logout confirmation
    ├── Hamburger menu toggle
    ├── Overlay + slide-in animation
    └── Mobile + tablet, hidden on desktop
```

#### **Search Components**
```
components/search/
├── SearchInput.tsx (100 lines)
│   ├── Text input field
│   ├── Mic icon (toggles voice search)
│   ├── Clear button (if text entered)
│   ├── Uses Web Speech API (en-KE)
│   └── Disabled state while listening
│
├── FilterAccordion.tsx (100 lines)
│   ├── Collapsible header + content
│   ├── 3 input types: checkbox, radio, range
│   ├── Count badges/options
│   ├── Clear button
│   └── Controlled component (parent manages state)
│
└── SortingDropdown.tsx (70 lines)
    ├── Dropdown selector
    ├── 5 sort options
    ├── Active state styling
    └── Click-outside auto-close
```

#### **Product Components**
```
components/product/
├── ProductCard.tsx (280 lines)
│   ├── Product image (4:3 aspect, object-cover)
│   ├── Category badge
│   ├── Product name, SKU
│   ├── Price section (original/discounted)
│   ├── Discount badge (if discounted)
│   ├── Stock status (In Stock / Low Stock / Out of Stock)
│   ├── Rating (stars + review count)
│   ├── Favorites heart button (toggles favoritesStore)
│   ├── Add to cart button
│   ├── Supports both legacy props AND full Product API object
│   └── Hover effect (scale, shadow)
│
├── ProductGallery.tsx (130 lines)
│   ├── Main image (click to zoom toggle)
│   ├── Next/prev navigation arrows
│   ├── Image counter "3/8"
│   ├── Thumbnail strip (click to select)
│   ├── Zoom scale effect (150%)
│   └── Cursor changes on hover
│
├── CompatibilityTable.tsx (100 lines)
│   ├── Table: Make | Model | Year
│   ├── Shows first 5, expandable
│   ├── Year range or single year
│   └── Styling: mechanic-blue header, striped rows
│
└── RelatedProductsCarousel.tsx (120 lines)
    ├── Horizontal snap scroll
    ├── Left/right chevron buttons
    ├── Smooth scroll animation
    ├── ProductCard[] as children
    └── Disabled buttons at boundaries
```

#### **Common UI Components**
```
components/common/
├── Button.tsx (60 lines)
│   ├── 5 variants: primary, secondary, ghost, danger, success
│   ├── Sizes: sm, md, lg
│   ├── States: normal, loading, disabled
│   ├── Responsive: full-width on mobile, auto on desktop
│   └── Uses cn() for conditional classes
│
├── Badge.tsx (50 lines)
│   ├── 7 types: genuine, secure, delivery, featured, discount, high-stock, low-stock
│   ├── Sizes: sm, md
│   ├── Colors: red, blue, gold, green, orange
│   └── Optional icon
│
├── Card.tsx (40 lines)
│   ├── 3 variants: default (white), elevated (shadow), outlined (border)
│   ├── Padding: 16px/24px
│   ├── Border-radius: 8px
│   └── Used for layout sections
│
├── LoadingSpinner.tsx (30 lines)
│   ├── Animated wheel icon
│   ├── Customizable size (sm/md/lg)
│   ├── Customizable color
│   └── Framer-motion rotation animation
│
└── EmptyState.tsx (80 lines)
    ├── 6 types: no-orders, no-favorites, no-vehicles, no-products, no-results, error
    ├── Icon + title + description (bilingual)
    ├── Optional CTA button
    └── Centered layout
```

---

### `/stores` - Zustand State Management

Each store handles a specific domain and persists to localStorage.

```
stores/
├── cartStore.ts (70 lines)
│   ├── State: items[], delivery, guestEmail, guestPhone, subtotal, total
│   ├── Actions: addItem, removeItem, updateQuantity, clearCart, setDelivery
│   ├── Computed: getTotal(), hasItems
│   ├── Persist: localStorage.cartStore
│   └── Used by: Cart page, ProductCard, Checkout, TopAppBar
│
├── favoritesStore.ts (50 lines)
│   ├── State: favorites[] (product IDs)
│   ├── Actions: addFavorite, removeFavorite, toggleFavorite, isFavorite
│   ├── Persist: localStorage.favoritesStore
│   └── Used by: ProductCard, Profile favorites tab
│
├── authStore.ts (100 lines)
│   ├── State: user {id, email, phone, is_owner}, tokens {access, refresh}
│   ├── Actions: login, logout, refreshToken, setToken
│   ├── Methods: getAccessToken (with auto-refresh), checkOwner
│   ├── Non-persist: Tokens auto-cleared on logout (security)
│   └── Used by: Protected pages, API interceptor, Admin routes
│
├── appStore.ts (60 lines)
│   ├── State: mobileMenuOpen, sideDrawerOpen, notifications[], isOnline
│   ├── Actions: toggleMenu, addNotification, removeNotification, setOnline
│   ├── Non-persist: UI state resets on page reload
│   └── Used by: Toaster, Layout, API error handling
│
└── vehicleStore.ts (40 lines)
    ├── State: selectedVehicle {make, model, year}
    ├── Actions: setVehicle, getSelectedVehicleString
    ├── Persist: localStorage.vehicleStore
    └── Used by: Search filters, Product compatibility, Home selector
```

**Pattern**: Create via `create((set) => ({ state, actions }))`, export custom hooks (`useCartStore()`), use in components via `const { state } = useStore()`.

---

### `/types` - TypeScript Definitions

```
types/
├── models.ts                     # Domain models
│   ├── Product { id, name, description, unit_price, discount_percentage, ... }
│   ├── Category { id, name, count, ... }
│   ├── User { id, email, is_owner, phone_number, ... }
│   ├── Order { id, order_status, total, items[], ... }
│   ├── Vehicle { id, make, model, year, ... }
│   ├── SavedVehicle { id, make, model, year, notes, ... }
│   └── Enums: OrderStatus, PaymentStatus
│
├── api.ts                        # API request/response types
│   ├── LoginRequest { username, password }
│   ├── LoginResponse { user, tokens }
│   ├── ProductsResponse { results[], count, next, previous }
│   ├── CheckoutRequest { order_items[], delivery_method, ... }
│   ├── CheckoutResponse { id, reference, ... }
│   └── Error types (APIError, ValidationError)
│
└── common.ts                     # Shared types
    ├── FilterState { category, make, model, priceRange, ... }
    ├── NotificationPayload { type, title, message, ... }
    ├── DeliveryOption { method, cost, days, ... }
    └── Theme, Layout, UI state types
```

---

### `/lib` - Utilities & Configuration

```
lib/
├── api.ts (200 lines)                # Axios instance + methods
│   ├── axiosInstance = axios.create({ baseURL, interceptors })
│   ├── Request interceptor: Add JWT token
│   ├── Response interceptor: Handle 401 (refresh token)
│   ├── API methods exported:
│   │   ├── Auth: login, register, logout, refreshToken
│   │   ├── Products: getProducts, getProductDetail, getCategories
│   │   ├── Orders: getOrders, getOrderDetail, checkout
│   │   ├── Admin: adminGetOrders, adminUpdateOrder
│   │   └── Vehicles: getVehicleMakes, getVehicleModels
│   └── Automatic retry on token refresh
│
├── constants.ts (300 lines)           # Hard-coded data
│   ├── Color palette mappings
│   ├── Status → Icon, Color, Label mappings
│   ├── Bilingual messages (EN/SW)
│   │   ├── Error messages
│   │   ├── Success messages
│   │   ├── Button labels
│   │   ├── Placeholder text
│   │   └── Empty state copy
│   ├── Validation rules (phone regex, password rules)
│   ├── Delivery options (3 tiers with costs/days)
│   ├── Sorting options (5 choices)
│   └── Categories (with icons)
│
├── formatting.ts (80 lines)           # Data formatting utilities
│   ├── formatKsh(number) → "KSh 15,000.00"
│   ├── normalizePhoneNumber(input) → "254722xxx"
│   ├── formatPhoneNumber(phone) → "0722 xxx xxxx"
│   ├── formatDate(date) → "Feb 6, 2026"
│   ├── formatTime(date) → "11:30 AM"
│   ├── calculateDiscount(original, discounted) → 25%
│   └── getDeliveryEstimate(method) → "2-3 days"
│
└── utils.ts (13 lines)                # Helper functions
    ├── cn(...classNames) → merged class string (clsx + tailwind-merge)
    └── Prevents Tailwind class conflicts (e.g., px-2 px-4 → px-4)
```

---

## Data Flow

### **Navigation Flow**

```
User opens app
↓ app/layout.tsx
↓ Renders TopAppBar, BottomNav, SideDrawer
↓ Next.js renders requested page (/product/[id], /search, etc.)
↓ Page component mounts
↓ useEffect calls API methods (getProducts, getProductDetail, etc.)
↓ API response updates Zustand store
↓ Component re-renders with fresh data
```

### **State Management Flow**

```
User action (add to cart)
↓ onClick handler
↓ useCartStore().addItem(product)
↓ Zustand updates state in memory
↓ localStorage automatically syncs (persist middleware)
↓ Component re-renders with new cartStore
↓ TopAppBar shows updated cart badge
```

### **API Integration Flow**

```
Component calls apiMethods.getProducts()
↓ HTTP GET request (via Axios)
↓ Axios interceptor adds JWT token header
↓ Backend returns 200 with products[]
↓ Component sets state with response data
↓ Component renders product grid

OR

Backend returns 401 (token expired)
↓ Response interceptor catches error
↓ Calls apiMethods.refreshToken()
↓ Stores new access token in authStore
↓ Retries original request with new token
↓ Success: returns response
```

### **Form Submission Flow**

```
User fills checkout form (Step 2: Address)
↓ onChange handlers update local useState fields
↓ Field validation (real-time, red border on error)
↓ Next button disabled if errors exist
↓ User clicks Next
↓ Moves to Step 3 (Payment)
↓ User enters M-Pesa phone, clicks Pay
↓ onClick calls apiMethods.checkout(formData)
↓ Loading spinner shows
↓ Backend processes payment, returns order#
↓ CartStore clears
↓ Redirects to Step 4 (Success)
```

---

## Performance Optimizations

### **Code Splitting**
- Pages auto-split by Next.js
- `dynamic(() => import(...), { loading: () => <Spinner /> })` for heavy components

### **Image Optimization**
- `next/image` for automatic optimization, AVIF format, lazy loading
- `remotePatterns` in `next.config.mjs` for backend images
- Responsive `srcSet` for different screen sizes

### **Data Fetching**
- Infinite scroll with IntersectionObserver (load on demand, not all at once)
- Zustand stores cache data in memory
- localStorage persist reduces API calls on refresh

### **Rendering**
- Framer-motion animations use `requestAnimationFrame` (60fps)
- Intersecting elements load progressively
- Fixed DOM elements (TopAppBar, BottomNav) don't re-render unnecessarily

---

## Error Handling

### **API Errors**
```ts
// In API interceptor
if (response.status === 401) {
  // Token expired, refresh
}
if (response.status === 400 || 422) {
  // Validation error, show toast with details
}
if (response.status >= 500) {
  // Server error, show "Try again later" toast
}
```

### **Component Errors**
```ts
// In catch blocks
try {
  await apiMethods.checkout(data)
} catch (error) {
  // Show error toast with user-friendly message
  toast.error(MESSAGES[user.language].checkout_failed)
  // Optionally log to error tracking service
}
```

### **Notification System**
```ts
// Uses react-hot-toast
toast.success("Added to cart!")
toast.error("Something went wrong. Please try again.")
toast.promise(apiCall, {
  loading: "Processing...",
  success: "Completed!",
  error: "Failed to process"
})
```

---

## Accessibility (WCAG 2.1)

### **Semantic HTML**
- `<button>` for interactive elements
- `<nav>` for navigation
- `<main>` for main content
- `<article>` for product cards
- `<section>` for layout sections

### **ARIA Labels**
```tsx
<button aria-label="Add to favorites">♥</button>
<nav aria-label="Main navigation">...</nav>
<input aria-describedby="phone-error" />
<span id="phone-error" role="alert">Invalid format</span>
```

### **Keyboard Navigation**
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys in carousels
- Esc to close modals

### **Color Contrast**
- Text: 4.5:1 (normal), 3:1 (large text)
- Components verified with axe Accessibility Checker

---

## Testing

### **Manual Testing Checklist**
- [ ] Mobile layout (iPhone 12, Android)
- [ ] Tablet layout (iPad)
- [ ] Desktop layout (1920px+)
- [ ] Touch interactions (add to cart, favorites, scroll)
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Screen reader (VoiceOver on Mac, TalkBack on Android)
- [ ] API failures (mock 401, 500, network timeout)
- [ ] Offline state (toggle DevTools offline)
- [ ] LocalStorage persistence (add to cart, reload page)

### **Automated Testing** (Future)
- Unit tests (Jest): Components, utilities
- Integration tests (Vitest): Page flows
- E2E tests (Playwright/Cypress): User journeys
- Accessibility tests (axe, pa11y)

---

## Security

### **Privacy**
- User tokens stored in memory (authStore, not secure localStorage)
- Sensitive data (passwords) never logged
- API errors sanitized before display (no stack traces)

### **HTTPS**
- All API calls via HTTPS (next.config.mjs enforces)
- Content Security Policy (CSP) headers in next.config.mjs

### **Input Validation**
- Client-side validation (email, phone, password)
- Server-side validation enforced (user can bypass client-side)

### **CORS**
- Backend configured to accept requests from frontend origin
- Credentials (cookies) not included in CORS requests (stateless JWT)

---

## Deployment

### **Build Process**
```bash
npm run build
# - TypeScript check
# - Next.js optimization
# - Static asset generation
# - CSS purging
```

### **Environment Variables**
```bash
NEXT_PUBLIC_API_URL=https://api.autopartskenya.com/api/v1
```

### **Hosting**
- Vercel (recommended, zero-config Next.js hosting)
- Or: Docker container + load balancer + CDN
- Service Worker for PWA offline support (optional)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full details.

---

**Last Updated**: February 6, 2026
