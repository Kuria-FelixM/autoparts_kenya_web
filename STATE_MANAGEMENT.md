# State Management with Zustand

Complete guide to managing application state using Zustand stores with localStorage persistence.

---

## Overview

Zustand is a lightweight state management library for React. We use it to:
- Manage user authentication (login, tokens, user info)
- Manage shopping cart (items, delivery, guest info)
- Manage user preferences (favorites, saved vehicles)
- Manage UI state (menus, notifications, online status)

All stores use the `persist` middleware to automatically save state to localStorage.

---

## Why Zustand?

- **Lightweight**: No boilerplate, minimal API  
- **Hooks-only**: Works with functional components  
- **DevTools**: Redux DevTools integration for debugging  
- **Subscriptions**: React and non-React listeners  
- **Persist**: Built-in localStorage middleware  
- **Simple**: Write less code than Redux/Context  

---

## Cart Store

**File**: `src/stores/cartStore.ts`

**Purpose**: Manage shopping cart state and operations

### **State**

```ts
interface CartStore {
  items: CartItem[]
  delivery: DeliveryMethod
  guestEmail: string
  guestPhone: string
  
  // Computed properties
  subtotal: number
  total: number
  hasItems: boolean
  
  // Actions
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  setDelivery: (method: DeliveryMethod) => void
  setGuestInfo: (email: string, phone: string) => void
  clearCart: () => void
}

interface CartItem {
  product_id: string
  product_name: string
  unit_price: number
  quantity: number
  featured_image: string
  stock_quantity: number
}

type DeliveryMethod = 'economy' | 'standard' | 'express'

interface Delivery {
  method: DeliveryMethod
  cost: number  // KSh
  days: number  // 1-7 days
}
```

### **Usage Examples**

**Add to Cart**:
```tsx
import { useCartStore } from '@/stores/cartStore'

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem)
  
  const handleAddToCart = () => {
    addItem(product, 1)
    toast.success(`${product.product_name} added to cart`)
  }
  
  return <button onClick={handleAddToCart}>Add to Cart</button>
}
```

**View Cart Items**:
```tsx
const Cart = () => {
  const { items, subtotal, total, delivery } = useCartStore()
  
  return (
    <>
      <div>Subtotal: KSh {subtotal.toLocaleString()}</div>
      <div>Delivery ({delivery.method}): KSh {delivery.cost}</div>
      <div>Total: KSh {total.toLocaleString()}</div>
    </>
  )
}
```

**Remove Item**:
```tsx
const removeItem = useCartStore((state) => state.removeItem)
removeItem(productId)
```

**Change Quantity**:
```tsx
const updateQuantity = useCartStore((state) => state.updateQuantity)
updateQuantity(productId, 5)
```

**Set Delivery Method**:
```tsx
const setDelivery = useCartStore((state) => state.setDelivery)
setDelivery('express')  // Faster delivery, higher cost
```

**Clear Cart** (on checkout success):
```tsx
const clearCart = useCartStore((state) => state.clearCart)
clearCart()
```

### **Persistence**

The cart persists to localStorage automatically:
```ts
localStorage.cartStore = JSON.stringify({
  items: [...],
  delivery: 'standard',
  guestEmail: 'user@example.com',
  guestPhone: '0722xxx'
})
```

This allows users to:
- Close the browser and reopen → cart still there
- Leave the site and come back → cart preserved
- Shop offline (cart works, checkout fails without connection)

---

## Favorites Store

**File**: `src/stores/favoritesStore.ts`

**Purpose**: Save product IDs to favorites list

### **State**

```ts
interface FavoritesStore {
  favorites: string[]  // Product IDs
  
  // Actions
  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}
```

### **Usage Examples**

**Toggle Favorite**:
```tsx
const ProductCard = ({ product }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const isliked = isFavorite(product.id)
  
  return (
    <button
      onClick={() => toggleFavorite(product.id)}
      className={isLiked ? 'text-red-500' : 'text-grey-400'}
    >
      ♥
    </button>
  )
}
```

**Check Favorite Status**:
```tsx
const isFavorite = useFavoritesStore((state) =>
  state.isFavorite(productId)
)

if (isFavorite) {
  // Show filled heart
}
```

**Get All Favorites**:
```tsx
const Profile = () => {
  const favorites = useFavoritesStore((state) => state.favorites)
  
  // Load full product objects for favorites
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    Promise.all(
      favorites.map((id) => apiMethods.getProductDetail(id))
    ).then(setProducts)
  }, [favorites])
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => <ProductCard key={p.id} {...p} />)}
    </div>
  )
}
```

### **Persistence**

Favorites persist to localStorage:
```ts
localStorage.favoritesStore = JSON.stringify({
  favorites: ['product-id-1', 'product-id-2', ...]
})
```

---

## Auth Store

**File**: `src/stores/authStore.ts`

**Purpose**: Manage user authentication and tokens

### **State**

```ts
interface AuthStore {
  user: User | null
  tokens: {
    access: string    // JWT token (expires in 15 min)
    refresh: string   // Refresh token (expires in 7 days)
  } | null
  isAuthenticated: boolean
  
  // Actions
  login: (response: LoginResponse) => void
  logout: () => void
  setTokens: (tokens: TokenPair) => void
  refreshToken: () => Promise<string>
  
  // Computed
  getAccessToken: () => Promise<string>
  checkOwner: () => boolean
}

interface User {
  id: string
  email: string
  phone_number: string
  first_name: string
  last_name: string
  is_owner: boolean
  created_at: string
}

interface TokenPair {
  access: string
  refresh: string
}
```

### **Usage Examples**

**Login**:
```tsx
const Login = () => {
  const login = useAuthStore((state) => state.login)
  
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await apiMethods.login({ username: email, password })
      login(response)  // Sets user + tokens
      router.push('/profile')
    } catch (err) {
      toast.error('Login failed')
    }
  }
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleLogin(email, password)
    }}>
      {/* Form fields */}
    </form>
  )
}
```

**Check Authentication**:
```tsx
const Profile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  if (!isAuthenticated) {
    return <redirect to="/auth/login" />
  }
  
  return <div>User profile</div>
}
```

**Get User Info**:
```tsx
const TopAppBar = () => {
  const user = useAuthStore((state) => state.user)
  
  return (
    <div>
      <p>Hello, {user?.first_name}</p>
      {user?.is_owner && <span className="badge">Store Owner</span>}
    </div>
  )
}
```

**Check Owner Status** (admin routes):
```tsx
const AdminDashboard = () => {
  const isOwner = useAuthStore((state) => state.checkOwner())
  
  if (!isOwner) {
    return <redirect to="/" />
  }
  
  return <div>Admin dashboard</div>
}
```

**Logout**:
```tsx
const handleLogout = async () => {
  const logout = useAuthStore((state) => state.logout)
  await apiMethods.logout()  // Blacklist token on server
  logout()  // Clear local state
  useCartStore.getState().clearCart()  // Clear transient data
  router.push('/')
}
```

**Get Access Token** (with auto-refresh):
```tsx
const token = await useAuthStore.getState().getAccessToken()
// If token is expired, automatically refreshes it
// If refresh fails, user is logged out
```

### **Persistence**

⚠️ **Auth store does NOT persist tokens to localStorage for security reasons**.

Instead:
- User tokens kept in memory (authStore state)
- On page refresh → user is logged out (tokens lost)
- User must login again

This is a security best practice:
- Prevents XSS attacks from stealing tokens from localStorage
- Tokens are cleared on browser close
- Reduces token exposure window

**If you want persistent login**, consider:
- HTTP-only cookies (backend sets, frontend never sees)
- IndexedDB with encryption
- Service Worker caching (still not secure)

---

## App Store

**File**: `src/stores/appStore.ts`

**Purpose**: Manage UI state (menus, notifications, connectivity)

### **State**

```ts
interface AppStore {
  mobileMenuOpen: boolean
  sideDrawerOpen: boolean
  notifications: Notification[]
  isOnline: boolean
  
  // Actions
  toggleMobileMenu: () => void
  setSideDrawerOpen: (open: boolean) => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  setOnline: (online: boolean) => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number  // ms, default 3000
}
```

### **Usage Examples**

**Toggle Mobile Menu**:
```tsx
const TopAppBar = () => {
  const { mobileMenuOpen, toggleMobileMenu } = useAppStore()
  
  return (
    <>
      <button onClick={toggleMobileMenu}>☰</button>
      {mobileMenuOpen && <MobileMenu onClose={toggleMobileMenu} />}
    </>
  )
}
```

**Open Side Drawer** (admin):
```tsx
const AdminMenu = () => {
  const setSideDrawerOpen = useAppStore((state) => state.setSideDrawerOpen)
  
  return (
    <button onClick={() => setSideDrawerOpen(true)}>
      Admin Panel
    </button>
  )
}
```

**Check Online Status**:
```tsx
const Checkout = () => {
  const isOnline = useAppStore((state) => state.isOnline)
  
  if (!isOnline) {
    return <p className="error">Please check your internet connection</p>
  }
  
  return <CheckoutForm />
}
```

**Add Notification**:
```tsx
const handleCheckout = async () => {
  const addNotification = useAppStore((state) => state.addNotification)
  
  try {
    await apiMethods.checkout(data)
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Order Placed',
      message: 'Your order has been confirmed',
      duration: 5000
    })
  } catch (err) {
    addNotification({
      id: Date.now().toString(),
      type: 'error',
      title: 'Checkout Failed',
      message: err.message,
      duration: 5000
    })
  }
}
```

### **Persistence**

App store does NOT persist to localStorage:
- UI state resets on page refresh (intended)
- Menus close on reload
- Notifications disappear
- Online status checked on app load

---

## Vehicle Store

**File**: `src/stores/vehicleStore.ts`

**Purpose**: Save user's selected vehicle for compatible parts filtering

### **State**

```ts
interface VehicleStore {
  selectedVehicle: SelectedVehicle | null
  
  // Actions
  setVehicle: (vehicle: SelectedVehicle) => void
  clearVehicle: () => void
  getSelectedVehicleString: () => string  // "Toyota Corolla 2018"
}

interface SelectedVehicle {
  make: string      // "Toyota"
  model: string     // "Corolla"
  year: number      // 2018
}
```

### **Usage Examples**

**Set Vehicle Selection**:
```tsx
const VehicleSelector = () => {
  const setVehicle = useVehicleStore((state) => state.setVehicle)
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState<number>(new Date().getFullYear())
  
  const handleSelect = () => {
    setVehicle({ make, model, year })
    toast.success('Vehicle saved!')
  }
  
  return (
    <>
      <Select value={make} onChange={setMake} placeholder="Select Make" />
      <Select value={model} onChange={setModel} placeholder="Select Model" />
      <Input value={year} onChange={setYear} type="number" />
      <Button onClick={handleSelect}>Save Vehicle</Button>
    </>
  )
}
```

**Filter Products by Vehicle**:
```tsx
const Search = () => {
  const selectedVehicle = useVehicleStore(
    (state) => state.selectedVehicle
  )
  
  const [products, setProducts] = useState<Product[]>([])
  
  useEffect(() => {
    const filters: ProductFilters = {}
    
    if (selectedVehicle) {
      filters.make = selectedVehicle.make
      filters.model = selectedVehicle.model
      filters.year_from = selectedVehicle.year
      filters.year_to = selectedVehicle.year
    }
    
    apiMethods.getProducts(filters).then((res) => {
      setProducts(res.results)
    })
  }, [selectedVehicle])
  
  return <ProductGrid products={products} />
}
```

**Display Selected Vehicle**:
```tsx
const VehicleDisplay = () => {
  const vehicleString = useVehicleStore(
    (state) => state.getSelectedVehicleString()
  )
  
  return <p className="status">Selected: {vehicleString}</p>
}
```

### **Persistence**

Vehicle store persists to localStorage:
```ts
localStorage.vehicleStore = JSON.stringify({
  selectedVehicle: {
    make: 'Toyota',
    model: 'Corolla',
    year: 2018
  }
})
```

This allows users to:
- Close and reopen site → vehicle selection remembered
- See compatible parts on next visit
- Change vehicle later

---

## Best Practices

### 1. **Selector Pattern** (Recommended)

```tsx
// ✅ Good: Only re-renders if items change
const items = useCartStore((state) => state.items)

// ❌ Avoid: Destructuring (re-renders on any state change)
const { items, total } = useCartStore()
```

Reason: React re-renders when selected value changes. Destructuring selects the entire store object, which changes on any state update.

### 2. **Memoize Selectors**

```tsx
// ❌ Bad: Creates new selector on every render
<CartBadge count={useCartStore((state) => state.items.length)} />

// ✅ Good: Memoize the selector
const useCartItemCount = () => useCartStore(
  (state) => state.items.length
)
const CartBadge = () => {
  const count = useCartItemCount()
  return <span>{count}</span>
}
```

### 3. **Combine Related State Updates**

```tsx
// ❌ Inefficient: Multiple state updates
const addItem = useCartStore((state) => state.addItem)
const setDelivery = useCartStore((state) => state.setDelivery)

addItem(product, 1)  // Store updates
setDelivery('express')  // Store updates again

// ✅ Better: Batch updates if needed
const updateCart = useCartStore((state) => ({
  addItem: state.addItem,
  setDelivery: state.setDelivery
}))

updateCart.addItem(product, 1)
updateCart.setDelivery('express')
```

### 4. **Handle Async Operations**

```tsx
// ✅ Async in components, not stores
const [isLoading, setIsLoading] = useState(false)

const handleCheckout = async () => {
  setIsLoading(true)
  try {
    const order = await apiMethods.checkout(data)
    useCartStore.getState().clearCart()
    router.push('/success')
  } finally {
    setIsLoading(false)
  }
}
```

### 5. **Computed Derived State**

```tsx
// Instead of storing computed values, derive them
const subtotal = useCartStore((state) => {
  return state.items.reduce((sum, item) => {
    return sum + (item.unit_price * item.quantity)
  }, 0)
})

// Or use a selector function in the store
const useSubtotal = () => useCartStore((state) => state.subtotal)
```

---

## Debugging with Redux DevTools

Install Redux DevTools extension in your browser.

The stores are automatically connected to Redux DevTools:
```ts
// In store creation with middleware
const useStore = create(
  persist(
    // middleware: ['@@INIT', 'action/type', ...]
    (set) => ({ /* store logic */ })
  )
)
```

You can:
- View all state changes
- Time-travel (rewind/fast-forward through state history)
- Dispatch actions from DevTools
- Export/import state

---

## Testing Stores

```ts
// Example: Test cart store
import { renderHook, act } from '@testing-library/react'
import { useCartStore } from '@/stores/cartStore'

describe('cartStore', () => {
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore())
    
    act(() => {
      result.current.addItem({ id: '1', unit_price: 100 }, 2)
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })
})
```

---

## Common Patterns

### Loading State During API Call

```tsx
const checkout = async () => {
  const addNotification = useAppStore((state) => state.addNotification)
  setIsLoading(true)
  
  try {
    const order = await apiMethods.checkout(data)
    useCartStore.getState().clearCart()
    addNotification({
      type: 'success',
      title: 'Order Confirmed',
      message: `Order #${order.id}`
    })
  } catch (err) {
    addNotification({
      type: 'error',
      title: 'Checkout Failed',
      message: err.message
    })
  } finally {
    setIsLoading(false)
  }
}
```

### Conditional Rendering Based on Auth

```tsx
const ProtectedContent = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  )
  
  if (!isAuthenticated) {
    return (
      <Card>
        <p>Please log in to continue</p>
        <Button onClick={() => router.push('/auth/login')}>
          Log In
        </Button>
      </Card>
    )
  }
  
  return <div>{/* Protected content */}</div>
}
```

---

**Last Updated**: February 6, 2026
