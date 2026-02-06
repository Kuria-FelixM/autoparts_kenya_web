# Styling & Theme

Complete guide to the design system, Tailwind CSS customization, and styling patterns.

---

## Design System Overview

The AutoParts Kenya frontend follows a cohesive design system with:
- **5-color palette**: Red (reliable), Blue (mechanic), Gold (trust), Grey (neutral), Green/Orange (status)
- **2-font system**: Montserrat (headings), Open Sans (body)
- **Mobile-first responsive**: 4 breakpoints (default, sm, md, lg)
- **8pt grid**: Consistent spacing throughout
- **Accessibility**: WCAG 2.1 AA compliance

---

## Color Palette

### **Tailwind Configuration**

```ts
// tailwind.config.ts
const theme = {
  colors: {
    // Semantic colors
    'reliable-red': '#D32F2F',      // Primary CTA, danger
    'mechanic-blue': '#1976D2',     // Primary, navigation
    'trust-gold': '#FBC02D',        // Featured, badges, premium
    'success-green': '#388E3C',     // Confirmations, in-stock
    'warning-orange': '#F57C00',    // Warnings, low-stock
    'info-cyan': '#0097A7',         // Info states, tags
    
    // Grey scale (10 shades)
    'road-grey': {
      900: '#212121',  // Text primary, very dark
      800: '#424242',  // Text secondary, dark
      700: '#616161',  // Text tertiary
      600: '#757575',  // Text placeholder
      500: '#9E9E9E',  // Dividers, borders
      300: '#E0E0E0',  // Light borders, disabled
      200: '#EEEEEE',  // Light background
      100: '#F5F5F5',  // Very light background
      50: '#FAFAFA',   // Almost white
    },
    
    // Bootstrap colors (for compatibility)
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  }
}
```

### **Color Usage Guide**

| Use Case | Color | Hex |
|----------|-------|-----|
| Primary buttons, CTAs | Mechanic Blue | #1976D2 |
| Danger, delete confirmations | Reliable Red | #D32F2F |
| Featured products, premium | Trust Gold | #FBC02D |
| Success messages, in-stock | Success Green | #388E3C |
| Warnings, low stock | Warning Orange | #F57C00 |
| Info states, tags | Info Cyan | #0097A7 |
| Disabled, secondary | Road Grey 300 | #E0E0E0 |
| Borders | Road Grey 500 | #9E9E9E |
| Text primary | Road Grey 900 | #212121 |
| Text secondary | Road Grey 700 | #616161 |
| Backgrounds | White / Road Grey 50 | #FFFFFF / #FAFAFA |

### **Usage Examples**

```tsx
// Text colors
<p className="text-road-grey-900">Primary text</p>
<p className="text-road-grey-600">Placeholder text</p>

// Background colors
<div className="bg-white">Default background</div>
<div className="bg-road-grey-50">Light background</div>

// Button colors
<button className="bg-mechanic-blue text-white">Primary CTA</button>
<button className="border border-reliable-red text-reliable-red">Danger outline</button>

// Status colors
<span className="text-success-green">In Stock</span>
<span className="text-warning-orange">Low Stock</span>
<span className="text-reliable-red">Out of Stock</span>

// Product badge
<div className="bg-trust-gold text-black px-2 py-1 rounded">Featured</div>
```

---

## Typography

### **Font Families**

```ts
// tailwind.config.ts
fonts: {
  serif: ['Merriweather', 'serif'],
  sans: ['Open Sans', 'ui-sans-serif', 'sans-serif'],
  mono: ['Fira Code', 'monospace'],
  heading: ['Montserrat', 'sans-serif'],  // Custom for <h1-h6>
}
```

### **Font Sizes & Line Heights**

```ts
fontSize: {
  // xs: [12px, 16px]    (small badge text, labels)
  // sm: [14px, 20px]    (small body text, help text)
  // base: [16px, 24px]  (default body text)
  // lg: [18px, 28px]    (large body text, section intro)
  // xl: [20px, 28px]    (section heading)
  // 2xl: [24px, 32px]   (card heading)
  // 3xl: [28px, 36px]   (page section)
  // 4xl: [32px, 40px]   (page heading)
}
```

### **Font Weight Mapping**

```ts
// Open Sans
fontWeight: {
  300: 'Light',    // Rarely used
  400: 'Regular',  // Default body text
  500: 'Medium',   // Slightly bold, emphasis
  600: 'Semibold', // Strong emphasis, labels
  700: 'Bold',     // Rare, use Montserrat instead
}

// Montserrat (headings)
fontWeight: {
  600: 'Semibold',  // Small headings (<h4)
  700: 'Bold',      // Standard headings
  900: 'Black',     // Hero, page title
}
```

### **Usage Examples**

```tsx
// Headings (use Montserrat Bold)
<h1 className="text-4xl font-bold font-heading">Page Title</h1>
<h2 className="text-3xl font-bold font-heading">Section Title</h2>
<h3 className="text-2xl font-semibold font-heading">Card Title</h3>
<h4 className="text-xl font-semibold font-heading">Subtitle</h4>

// Body text (use Open Sans)
<p className="text-base">Default paragraph text</p>
<p className="text-sm text-road-grey-600">Secondary text</p>
<span className="text-xs">Small label text</span>

// Emphasis
<p className="font-semibold">Important point</p>
<p className="font-medium">Slightly emphasized</p>

// Code/monospace
<code className="font-mono text-sm">product_id: {productId}</code>
```

---

## Spacing System

### **8pt Grid**

All spacing uses multiples of 8px for consistency:

```ts
spacing: {
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px (base unit)
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
}
```

### **Padding & Margin**

```tsx
// Padding (inside element)
<div className="p-4">Padding 16px on all sides</div>
<div className="px-4 py-2">Padding 16px horizontal, 8px vertical</div>
<div className="pt-6">Padding 24px top only</div>

// Margin (outside element)
<div className="m-4">Margin 16px on all sides</div>
<div className="mb-6">Margin 24px bottom</div>
<div className="mx-auto">Auto horizontal margin (center)</div>
```

### **Gutters & Gaps**

```tsx
// Grid spacing
<div className="grid grid-cols-2 gap-4">
  {/* 16px gap between columns */}
</div>

<div className="grid grid-cols-2 md:gap-6 lg:gap-8">
  {/* Responsive gap: 16px (mobile), 24px (tablet), 32px (desktop) */}
</div>

// Flexbox spacing
<div className="flex flex-col gap-4">
  {/* 16px gap between items */}
</div>
```

---

## Responsive Design

### **Breakpoints**

```ts
screens: {
  DEFAULT: '0px',    // Mobile first (always applied)
  sm: '640px',       // Small tablet (landscape phone)
  md: '768px',       // Tablet (portrait)
  lg: '1024px',      // Desktop (small)
  xl: '1280px',      // Desktop (large)
  '2xl': '1536px',   // Ultra-wide
}
```

### **Mobile-First Approach**

Always start with mobile (small screen) default, then add larger screen modifiers:

```tsx
// ✅ Good: Mobile-first
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {/* 2 cols on mobile, 3 on tablet, 4 on desktop */}
</div>

// ❌ Avoid: Desktop-first
<div className="grid grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
  {/* Confusing and unnecessary */}
</div>
```

### **Common Responsive Patterns**

**Grid columns**:
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Most flexibility pattern */}
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Single column on mobile, pairs on tablet, triplets on desktop */}
</div>
```

**Text size**:
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  {/* Scale heading based on screen */}
</h1>
```

**Padding**:
```tsx
<div className="px-4 md:px-6 lg:px-8">
  {/* 16px on mobile, 24px on tablet, 32px on desktop */}
</div>
```

**Display**:
```tsx
<div className="hidden md:block">
  {/* Only show on tablet+ */}
</div>

<div className="md:hidden">
  {/* Only show on mobile */}
</div>
```

---

## Component Styling

### **Buttons**

```tsx
// Primary button (blue, white text)
<button className="
  bg-mechanic-blue text-white
  px-6 py-3
  rounded-lg
  font-semibold
  hover:bg-blue-700 active:bg-blue-900
  disabled:bg-road-grey-300 disabled:cursor-not-allowed
  transition-colors duration-200
">
  Click Me
</button>

// Secondary button (grey background)
<button className="
  bg-road-grey-100 text-mechanic-blue
  px-6 py-3
  rounded-lg
  font-semibold
  hover:bg-road-grey-200
  border border-road-grey-300
">
  Secondary
</button>

// Ghost button (transparent, outline)
<button className="
  bg-transparent text-mechanic-blue
  px-6 py-3
  rounded-lg
  font-semibold
  border border-mechanic-blue
  hover:bg-blue-50
">
  Ghost
</button>
```

### **Cards**

```tsx
// Default card (white background, subtle shadow)
<div className="
  bg-white
  rounded-lg
  p-6
  shadow-sm
  border border-road-grey-200
">
  {/* Content */}
</div>

// Elevated card (stronger shadow)
<div className="
  bg-white
  rounded-lg
  p-6
  shadow-md
  hover:shadow-lg transition-shadow
">
  {/* Content */}
</div>

// Outlined card (border emphasis)
<div className="
  bg-white
  rounded-lg
  p-6
  border-2 border-mechanic-blue
">
  {/* Content */}
</div>
```

### **Badges**

```tsx
// Success badge
<span className="
  inline-flex items-center gap-2
  bg-success-green text-white
  px-3 py-1
  rounded-full
  text-xs font-semibold
">
  ✓ In Stock
</span>

// Warning badge
<span className="
  inline-flex items-center gap-2
  bg-warning-orange text-white
  px-3 py-1
  rounded-full
  text-xs font-semibold
">
  ⚠ Low Stock
</span>

// Featured badge
<div className="
  absolute top-2 right-2
  bg-trust-gold text-black
  px-3 py-1
  rounded-md
  text-xs font-bold
">
  Featured
</div>
```

### **Forms**

```tsx
// Input field
<div className="form-group">
  <label className="text-sm font-semibold text-road-grey-900">
    Email Address
  </label>
  <input
    type="email"
    className="
      w-full mt-2
      px-4 py-2
      border border-road-grey-300
      rounded-lg
      text-road-grey-900
      placeholder-road-grey-500
      focus:border-mechanic-blue focus:ring-2 focus:ring-blue-100
      focus:outline-none
      transition-colors
      disabled:bg-road-grey-100 disabled:text-road-grey-600
    "
    placeholder="you@example.com"
  />
  {/* Error state */}
  {error && (
    <p className="mt-2 text-sm text-reliable-red">{error}</p>
  )}
</div>

// Checkbox
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    className="
      w-5 h-5
      rounded
      border border-road-grey-300
      accent-mechanic-blue
      cursor-pointer
    "
  />
  <span className="text-sm text-road-grey-900">
    Remember me
  </span>
</label>

// Select dropdown
<select className="
  w-full
  px-4 py-2
  border border-road-grey-300
  rounded-lg
  text-road-grey-900
  bg-white
  focus:border-mechanic-blue focus:ring-2 focus:ring-blue-100
  focus:outline-none
  cursor-pointer
">
  <option value="">Select option</option>
  <option value="1">Option 1</option>
</select>
```

---

## Animations & Transitions

### **Tailwind Built-in**

```tsx
// Fade in/out
<div className="transition opacity-0 hover:opacity-100">
  Hover to reveal
</div>

// Smooth color transition
<button className="
  bg-mechanic-blue
  hover:bg-blue-700
  transition-colors duration-200
">
  Hover
</button>

// Transform (scale, translate)
<div className="transform transition hover:scale-105 hover:shadow-lg">
  Hover to pop
</div>

// Slide
<div className="transition transform -translate-y-2 hover:translate-y-0">
  Slide up on hover
</div>
```

### **Framer Motion** (for complex animations)

```tsx
// Entry animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Fades in and slides up
</motion.div>

// Hover animation
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>

// Scroll-triggered
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  Animate when visible
</motion.div>
```

### **Custom Animations** (in `globals.css`)

```css
@keyframes spin-wheel {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounce-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.animate-wheel {
  animation: spin-wheel 2s linear infinite;
}

.animate-pulse-soft {
  animation: pulse-soft 2s ease-in-out infinite;
}

.animate-bounce-soft {
  animation: bounce-soft 1s ease-in-out infinite;
}
```

---

## Shadows & Depth

```ts
boxShadow: {
  // Subtle
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
}
```

### **Usage**

```tsx
// Subtle elevation
<div className="shadow-sm">Slight shadow</div>

// Card elevation
<div className="shadow-md hover:shadow-lg transition-shadow">
  Card with hover depth
</div>

// Large modal
<div className="shadow-2xl">Modal or overlay</div>
```

---

## Border Radius

```ts
borderRadius: {
  'none': '0px',
  'sm': '0.25rem',    // 4px (small, tight)
  'md': '0.375rem',   // 6px (standard)
  'lg': '0.5rem',     // 8px (loose)
  'xl': '0.75rem',    // 12px (very loose)
  'full': '9999px',   // Fully rounded (pills, circles)
}
```

### **Usage**

```tsx
// Small button
<button className="rounded-md px-4 py-2">Click</button>

// Card
<div className="rounded-lg p-6">Card content</div>

// Fully rounded (badge, avatar)
<img className="w-12 h-12 rounded-full" />
<span className="rounded-full bg-blue-500 text-white px-4 py-2">
  Badge
</span>
```

---

## Best Practices

### 1. **Avoid Inline Styles**

```tsx
// ❌ Bad
<div style={{ color: 'red', fontSize: '18px' }}>Text</div>

// ✅ Good
<div className="text-reliable-red text-lg">Text</div>
```

### 2. **Use `cn()` for Class Merging**

```tsx
// ❌ Bad (conflicting classes): px-2 px-4
<button className={`px-2 ${large ? 'px-4' : ''}`}>Click</button>

// ✅ Good (merged correctly): px-4
import { cn } from '@/lib/utils'
<button className={cn('px-2', large && 'px-4')}>Click</button>
```

### 3. **Component Composition**

```tsx
// ✅ Good: Reusable component
const PrimaryButton = ({ children, ...props }) => (
  <button
    className="
      bg-mechanic-blue text-white
      px-6 py-3
      rounded-lg
      font-semibold
      hover:bg-blue-700
      transition-colors
    "
    {...props}
  >
    {children}
  </button>
)
```

### 4. **Extract Complex Classes**

```tsx
// ❌ Messy
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

// ✅ Better: Extract to CSS or component
const productGridClasses = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
<div className={productGridClasses}>
```

### 5. **Group Related Classes**

```tsx
// ✅ Organized
<button className={cn(
  // Layout
  'w-full px-6 py-3',
  
  // Style
  'bg-mechanic-blue text-white rounded-lg',
  
  // Typography
  'font-semibold text-base',
  
  // Interaction
  'hover:bg-blue-700 active:bg-blue-900',
  'transition-colors duration-200',
  'disabled:bg-road-grey-300 disabled:cursor-not-allowed',
)}>
  Click Me
</button>
```

---

## Accessibility in Styling

### **Color Contrast**

- Text: Minimum 4.5:1 for normal, 3:1 for large
- Verified with: WCAG Contrast Checker, axe DevTools

### **Focus Indicators**

```tsx
// Always show focus indicator
<button className="
  focus:outline-none
  focus:ring-2
  focus:ring-offset-2
  focus:ring-mechanic-blue
">
  Accessible button
</button>
```

### **Disabled States**

```tsx
// Visual feedback for disabled
<button disabled className="
  disabled:bg-road-grey-300
  disabled:text-road-grey-600
  disabled:cursor-not-allowed
  disabled:opacity-50
">
  Disabled button
</button>
```

---

## Dark Mode (Future)

Currently not implemented, but Tailwind supports it:

```tsx
// Add to tailwind.config.ts when needed
darkMode: 'class',

// Use in components
<div className="bg-white dark:bg-road-grey-900 text-black dark:text-white">
  Supports light and dark
</div>
```

---

## Performance

### **CSS File Size**
- Tailwind purges unused styles in production
- Output CSS: ~25-30KB (gzipped)

### **Tips**
- Avoid arbitrary classes in loops
- Use Tailwind utilities, not custom CSS when possible
- Keep animation counts reasonable (max 3-4 simultaneous)
- Use `will-change` sparingly for high-performance animations

---

**Last Updated**: February 6, 2026
