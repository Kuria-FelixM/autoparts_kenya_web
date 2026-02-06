# Component Library

Complete documentation and usage examples for all frontend components.

---

## Layout Components

### TopAppBar

**Purpose**: Sticky header with logo, search, cart, user menu

**Location**: `src/components/layout/TopAppBar.tsx`

**Props**:
```ts
interface TopAppBarProps {
  onSearchClick?: () => void          // Mobile: opens search input
  onCartClick?: () => void            // Mobile: navigates to /cart
  onUserClick?: () => void            // Mobile: opens user menu
  cartItemCount?: number              // Badge on cart icon
}
```

**Features**:
- Responsive: Full search on desktop, icon button on mobile
- Sticky: Always visible at top (z-50, top-0)
- Cart badge: Shows number of items (red badge)
- User avatar: Click to open menu (Profile, Settings, Logout)
- Logo/brand: Click to go home

**Usage**:
```tsx
// In app/layout.tsx - renders automatically
<TopAppBar 
  cartItemCount={useCartStore().items.length}
  onCartClick={() => router.push('/cart')}
/>
```

**Mobile Responsive**:
- `<600px`: Logo + Search icon + Cart icon + User avatar (row)
- `≥600px`: Logo + Full search input + Cart icon + User avatar (row)

---

### BottomNav

**Purpose**: Mobile-only bottom navigation (5 tabs)

**Location**: `src/components/layout/BottomNav.tsx`

**Tabs**:
- Home (Home icon)
- Search (Search icon)
- Categories (Grid icon)
- Cart (Cart icon, with badge)
- Profile (User icon)

**Features**:
- Fixed at bottom (z-40)
- 5 equal-width tabs
- Active tab: mechanic-blue background + bold text
- Badge on Cart tab (red, shows count)
- Touch-friendly: 48px+ targets

**Usage**:
```tsx
// In app/layout.tsx - renders automatically
<BottomNav currentPath={pathname} />
```

**Styling**:
```css
/* Safe area padding for notches */
padding-bottom: max(1rem, env(safe-area-inset-bottom));
/* Hide on desktop */
@media (min-width: 768px) { display: none; }
```

---

### SideDrawer

**Purpose**: Admin navigation sidebar (owner-only)

**Location**: `src/components/layout/SideDrawer.tsx`

**Sections**:
- Admin Dashboard
- Products Management
- Orders Management
- Inventory Management
- Analytics

**Features**:
- Mobile: Slide-in drawer with overlay
- Desktop: Fixed sidebar (often hidden, toggle via Hamburger)
- Owner-only: Hidden if `isOwner === false`
- Logout confirmation: "Are you sure?" dialog
- Smooth animations: Framer-motion slide-in/out

**Usage**:
```tsx
// In app/layout.tsx
if (isOwner) {
  <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
}
```

---

## Search Components

### SearchInput

**Purpose**: Text + voice search with clear button

**Location**: `src/components/search/SearchInput.tsx`

**Props**:
```ts
interface SearchInputProps {
  value: string
  onChange: (text: string) => void
  onVoiceInput?: (text: string) => void
  placeholder?: string
  onClear?: () => void
}
```

**Features**:
- Text input: Type to filter
- Mic icon: Click to enable voice search (Web Speech API)
- Clear button: Appears when text entered
- Listening state: Disabled input, visual feedback
- Language: en-KE (Kenyan English)

**Usage**:
```tsx
const [searchText, setSearchText] = useState('')

<SearchInput
  value={searchText}
  onChange={setSearchText}
  onVoiceInput={(text) => setSearchText(text)}
  placeholder="Search parts, tires, batteries..."
  onClear={() => setSearchText('')}
/>
```

**Voice Search**:
```ts
// Uses Web Speech API
const recognition = new webkitSpeechRecognition()
recognition.lang = 'en-KE'
recognition.onresult = (event) => {
  const text = event.results[0][0].transcript
  onVoiceInput?.(text)
}
recognition.start()
```

---

### FilterAccordion

**Purpose**: Collapsible filter widget (checkbox, radio, range)

**Location**: `src/components/search/FilterAccordion.tsx`

**Props**:
```ts
interface FilterAccordionProps {
  title: string                         // "Price Range", "Stock Status", etc.
  type: 'checkbox' | 'radio' | 'range' // Filter type
  options?: FilterOption[]              // [{label, value, count}]
  minValue?: number                     // For range type
  maxValue?: number
  selectedValues?: string[] | string | [number, number]
  onSelectionChange?: (values: any) => void
}

interface FilterOption {
  label: string
  value: string | number
  count?: number
}
```

**Features**:
- Expand/collapse header with chevron
- Checkbox: Multi-select
- Radio: Single-select
- Range: Dual-thumb slider
- Option counts: Shows how many products match
- Clear button: Resets selected values
- Controlled component (parent manages state)

**Usage**:
```tsx
const [status, setStatus] = useState<string[]>([])

<FilterAccordion
  title="Stock Status"
  type="checkbox"
  options={[
    { label: 'In Stock', value: 'in_stock', count: 42 },
    { label: 'Low Stock', value: 'low_stock', count: 15 },
  ]}
  selectedValues={status}
  onSelectionChange={setStatus}
/>
```

---

### SortingDropdown

**Purpose**: Sort options selector

**Location**: `src/components/search/SortingDropdown.tsx`

**Options**:
1. Newest (default)
2. Price: Low to High
3. Price: High to Low
4. Most Popular
5. Highest Rated

**Props**:
```ts
interface SortingDropdownProps {
  selectedSort: string
  onSortChange: (sort: string) => void
}
```

**Features**:
- Dropdown (click to open, click-outside to close)
- Active option: mechanic-blue background
- Icon next to each option (indicating sort direction)
- Responsive: Full-width on mobile, inline on desktop

**Usage**:
```tsx
const [sort, setSort] = useState('newest')

<SortingDropdown
  selectedSort={sort}
  onSortChange={setSort}
/>
```

---

## Product Components

### ProductCard

**Purpose**: Grid card for product display

**Location**: `src/components/product/ProductCard.tsx`

**Props** (Dual Format Support):
```ts
// Legacy format (backward compatible)
interface ProductCardProps {
  id: string
  name: string
  price: number
  discounted_price?: number
  category?: string | { name: string }
  rating?: number
  reviewCount?: number
  stock?: number
  image?: string
  isFeatured?: boolean
  onAddToCart?: () => void
}

// OR New API format (full Product object)
interface ProductObject {
  id: string
  product_name: string
  unit_price: number
  discounted_price?: number
  category_ref?: { name: string }
  average_rating?: number
  reviews?: any[]
  stock_quantity?: number
  featured_image?: string
  is_featured?: boolean
}
```

**Features**:
- Image: 4:3 aspect ratio, object-cover
- Category badge: Top-left corner
- Product name: 2-line truncation
- SKU: Small grey text
- Price: Red bold, with struck original price if discounted
- Discount badge: Top-right (e.g., "-25%")
- Stock status: "In Stock" / "Low Stock" (2 left) / "Out of Stock"
- Rating: Stars (⭐⭐⭐⭐⭐) + count (e.g., "(47 reviews)")
- Favorites heart: Top-right, toggles favoritesStore
- Add to cart button: Primary button at bottom
- Hover effect: Scale (1.05), shadow elevation
- Responsive: Full-width on mobile, grid cell on desktop

**Usage**:
```tsx
// With API Product object
const product = await apiMethods.getProductDetail(id)
<ProductCard {...product} onAddToCart={() => handleAddCart(product)} />

// Or with legacy props
<ProductCard
  id="123"
  name="Engine Oil 5L"
  price={2500}
  discounted_price={2000}
  rating={4.8}
  reviewCount={47}
  image="/products/oil.jpg"
/>
```

---

### ProductGallery

**Purpose**: Product image gallery with zoom, swipe, thumbnails

**Location**: `src/components/product/ProductGallery.tsx`

**Props**:
```ts
interface ProductGalleryProps {
  images: string[]                    // Image URLs
  altText?: string
  onImageChange?: (index: number) => void
}
```

**Features**:
- Main image: Fill container, object-cover
- Click to zoom: Scale to 150%, pan with mouse/touch
- Navigation arrows: Prev/next buttons (chevrons)
- Image counter: Top-right (e.g., "3/8")
- Thumbnail strip: Below main image (16x16 thumbs)
- Active thumbnail: mechanic-blue border
- Smooth transitions: Framer-motion fade
- Touch support: Swipe left/right

**Usage**:
```tsx
const images = product.images || [product.featured_image]

<ProductGallery
  images={images}
  altText={product.product_name}
  onImageChange={(idx) => console.log(`Viewing image ${idx + 1}`)}
/>
```

---

### CompatibilityTable

**Purpose**: Show compatible vehicles for product

**Location**: `src/components/product/CompatibilityTable.tsx`

**Props**:
```ts
interface CompatibilityTableProps {
  vehicles: VehicleCompatibility[]    // [{make, model, year_from, year_to}, ...]
  expandedByDefault?: boolean
}

interface VehicleCompatibility {
  make: string                        // e.g., "Toyota"
  model: string                       // e.g., "Corolla"
  year_from: number                   // e.g., 2015
  year_to: number                     // e.g., 2020
}
```

**Features**:
- Table: Make | Model | Year columns
- Year display: "2015–2020" (range) or "2015" (single)
- Shows first 5 by default
- "Show All (N)" button: Expand/collapse full list
- Striped rows: Alternating background colors
- Header: mechanic-blue background

**Usage**:
```tsx
const vehicles = [
  { make: 'Toyota', model: 'Corolla', year_from: 2015, year_to: 2020 },
  { make: 'Honda', model: 'Civic', year_from: 2018, year_to: 2022 },
]

<CompatibilityTable vehicles={vehicles} />
```

---

### RelatedProductsCarousel

**Purpose**: Horizontal scrolling carousel of related products

**Location**: `src/components/product/RelatedProductsCarousel.tsx`

**Props**:
```ts
interface RelatedProductsCarouselProps {
  products: Product[]
  title?: string                      // Default: "Related Products"
  onProductClick?: (product: Product) => void
}
```

**Features**:
- Horizontal snap scroll (scroll-smooth, snap-x)
- Left/right chevron buttons: Manual scroll
- Buttons disabled at boundaries
- ProductCard[] as children
- Auto-scroll on button click: Smooth 0.3s animation
- Responsive width: 16rem (256px) per card on all screens
- Touch swipe support

**Usage**:
```tsx
const relatedProducts = await apiMethods.getRelatedProducts(id, 6)

<RelatedProductsCarousel
  products={relatedProducts}
  title="Customers Also Bought"
  onProductClick={(p) => router.push(`/product/${p.id}`)}
/>
```

---

## Common UI Components

### Button

**Purpose**: Reusable button with 5 variants

**Location**: `src/components/common/Button.tsx`

**Props**:
```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' // Default: primary
  size?: 'sm' | 'md' | 'lg'          // Default: md
  isLoading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}
```

**Variants**:

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| primary | Mechanic Blue | White | None | CTAs (Add to Cart, Checkout) |
| secondary | Grey 100 | Mechanic Blue | None | Alternative actions |
| ghost | Transparent | Mechanic Blue | Mechanic Blue | Minimal actions |
| danger | Reliable Red | White | None | Delete, logout confirmations |
| success | Success Green | White | None | Confirmation messages |

**Sizes**:
- `sm`: 8px/16px padding, 14px text
- `md`: 12px/20px padding, 16px text (default)
- `lg`: 16px/24px padding, 18px text

**Features**:
- Loading state: ShowsSpinner, disables click
- Disabled state: Opacity 50%, cursor not-allowed
- Full width: `fullWidth={true}` for modals/forms
- Touch-friendly: ≥48px height
- Hover/focus effects: Scale, shadow, outline

**Usage**:
```tsx
<Button variant="primary" size="lg" fullWidth>
  Checkout
</Button>

<Button variant="danger" onClick={handleDelete}>
  Delete Product
</Button>

<Button isLoading={isApplying} onClick={handleApply}>
  Apply Code
</Button>
```

---

### Badge

**Purpose**: Label for statuses, tags, certifications

**Location**: `src/components/common/Badge.tsx`

**Types**:
```ts
type BadgeType =
  | 'genuine'      // Green, checkmark (Genuine Parts)
  | 'secure'       // Blue, lock (Secure M-Pesa)
  | 'delivery'     // Gold, truck (Fast Delivery)
  | 'featured'     // Gold, star (Featured Item)
  | 'discount'     // Red (e.g., "-25%")
  | 'high-stock'   // Green (In Stock)
  | 'low-stock'    // Orange (Low Stock / 2 left)
  | 'out-of-stock' // Red (Out of Stock)
```

**Props**:
```ts
interface BadgeProps {
  type: BadgeType
  label: string
  size?: 'sm' | 'md'           // Default: md
  icon?: React.ReactNode       // Optional custom icon
}
```

**Sizes**:
- `sm`: 10px/8px padding, 11px text
- `md`: 12px/12px padding, 12px text (default)

**Usage**:
```tsx
<Badge type="genuine" label="Genuine Parts" icon={<Checkmark />} />
<Badge type="discount" label="-25%" size="sm" />
<Badge type="low-stock" label="2 left" />
```

---

### Card

**Purpose**: Container with consistent styling

**Location**: `src/components/common/Card.tsx`

**Variants**:
```ts
type CardVariant = 'default' | 'elevated' | 'outlined'
```

| Variant | Background | Border | Shadow |
|---------|-----------|--------|--------|
| default | White | None | None |
| elevated | White | None | md shadow |
| outlined | White | 1px grey border | None |

**Props**:
```ts
interface CardProps {
  children: React.ReactNode
  variant?: CardVariant
  className?: string            // Additional Tailwind classes
  onClick?: () => void
}
```

**Usage**:
```tsx
<Card variant="elevated">
  <h3>Order Summary</h3>
  <p>Subtotal: KSh 15,000</p>
</Card>

<Card variant="outlined" onClick={handleCardClick}>
  {/* Content */}
</Card>
```

---

### LoadingSpinner

**Purpose**: Animated wheel loader

**Location**: `src/components/common/LoadingSpinner.tsx`

**Props**:
```ts
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'    // Default: md
  color?: string               // CSS color (default: mechanic-blue)
}
```

**Sizes**:
- `sm`: 24px
- `md`: 48px (default)
- `lg`: 64px

**Features**:
- Animated rotation: 360° continuous
- Customizable color
- SVG icon: Wheel/gear design
- Framer-motion: Smooth 60fps animation

**Usage**:
```tsx
{isLoading && <LoadingSpinner size="lg" />}

<Button isLoading={isLoading}>
  {isLoading ? <LoadingSpinner size="sm" /> : 'Save'}
</Button>
```

---

### EmptyState

**Purpose**: Visual feedback when no data to display

**Location**: `src/components/common/EmptyState.tsx`

**Types**:
```ts
type EmptyStateType =
  | 'no-orders'
  | 'no-favorites'
  | 'no-vehicles'
  | 'no-products'
  | 'no-results'
  | 'error'
```

**Props**:
```ts
interface EmptyStateProps {
  type: EmptyStateType
  ctaLabel?: string             // Button text
  onCTA?: () => void
  customTitle?: string
  customDescription?: string
}
```

**Pre-configured Messages** (with bilingual support):

| Type | Title | Description |
|------|-------|-------------|
| no-orders | No Orders Yet | Browse our catalog and place your first order |
| no-favorites | No Favorites | Save products for quick access |
| no-vehicles | No Vehicles | Add your vehicle to see compatible parts |
| no-products | No Products Found | Try adjusting your filters |
| no-results | Nothing Found | Your search didn't return any results |
| error | Something Went Wrong | Please try again later |

**Usage**:
```tsx
{orders.length === 0 ? (
  <EmptyState
    type="no-orders"
    ctaLabel="Start Shopping"
    onCTA={() => router.push('/')}
  />
) : (
  <OrdersList orders={orders} />
)}
```

---

## Component Patterns

### **Controlled vs Uncontrolled**

```tsx
// Controlled: Parent manages state
const [filter, setFilter] = useState('')
<FilterAccordion
  selectedValues={filter}
  onSelectionChange={setFilter}
/>

// Uncontrolled: Component manages internal state
<SortingDropdown
  selectedSort="newest"
  onSortChange={console.log}
/>
```

### **Conditional Rendering**

```tsx
// Show spinner while loading
{isLoading ? (
  <LoadingSpinner size="lg" />
) : data.length > 0 ? (
  <ProductGrid products={data} />
) : (
  <EmptyState type="no-products" />
)}
```

### **Error States**

```tsx
// Show error badge/alert
{error && (
  <Badge type="danger" label={error.message} />
)}

// Or empty state with retry
{error && (
  <EmptyState
    type="error"
    ctaLabel="Try Again"
    onCTA={handleRetry}
  />
)}
```

---

## Accessibility

### **Button**
```tsx
<Button aria-label="Add to favorites">♥</Button>
<Button disabled aria-disabled="true">Checkout</Button>
```

### **Card**
```tsx
<Card role="region" aria-label="Order summary">
  {/* Content */}
</Card>
```

### **Badge**
```tsx
<Badge type="genuine" label="Genuine" aria-label="Certified genuine part" />
```

### **EmptyState**
```tsx
<EmptyState
  type="no-results"
  onCTA={handleSearch}
/>
{/* Component includes proper heading hierarchy */}
```

---

**Last Updated**: February 6, 2026
