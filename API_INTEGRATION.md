# API Integration

Complete guide to backend API integration and HTTP client configuration.

---

## Overview

All API communication is handled through a centralized Axios instance with:
- Automatic JWT Bearer token injection
- Automatic token refresh on expiration (401)
- Automatic retry of failed requests
- Consistent error handling
- Request/response transformation

---

## HTTP Client Setup

### **Axios Instance** (`lib/api.ts`)

```ts
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Add JWT token
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().tokens?.access
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: Handle 401 (token refresh)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Attempt token refresh
      const refreshToken = useAuthStore.getState().tokens?.refresh
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${axiosInstance.defaults.baseURL}/auth/refresh/`,
            { refresh: refreshToken }
          )
          
          // Update tokens in store
          useAuthStore.getState().setTokens({
            access: response.data.access,
            refresh: refreshToken,
          })
          
          // Retry original request with new token
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          useAuthStore.getState().logout()
          return Promise.reject(refreshError)
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance
```

### **Environment Variables**

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## API Methods

All API methods are exported from `lib/api.ts`:

```ts
export const apiMethods = {
  // Auth
  login: async (credentials: LoginRequest) => LoginResponse
  register: async (data: RegisterRequest) => User
  logout: async () => void
  refreshToken: async () => TokenResponse
  
  // Products
  getProducts: async (filters?: ProductFilters) => PaginatedResponse<Product>
  getProductDetail: async (id: string) => Product
  getFeaturedProducts: async () => Product[]
  getCategories: async () => Category[]
  
  // Vehicles
  getVehicleMakes: async () => Make[]
  getVehicleModels: async (make_id: string) => Model[]
  
  // Orders
  getOrders: async () => Order[]
  getOrderDetail: async (id: string) => Order
  checkout: async (data: CheckoutRequest) => Order
  
  // Payments
  initiateSTKPush: async (phone: string, amount: number) => STKResponse
  checkPaymentStatus: async (reference: string) => PaymentStatus
  
  // Admin
  adminGetDashboard: async () => DashboardStats
  adminGetOrders: async (filters?: AdminOrderFilters) => PaginatedResponse<Order>
  adminUpdateOrder: async (id: string, status: OrderStatus) => Order
  adminGetProducts: async (filters?: AdminProductFilters) => PaginatedResponse<Product>
}
```

---

## Authentication

### **Login**

```ts
// Request
const response = await apiMethods.login({
  username: 'user@example.com',  // or phone number
  password: 'password123'
})

// Response
{
  user: {
    id: 'uuid',
    email: 'user@example.com',
    phone_number: '+254722xxx',
    first_name: 'John',
    is_owner: false,
    created_at: '2026-02-06T10:00:00Z'
  },
  tokens: {
    access: 'eyJhbGc...',
    refresh: 'eyJhbGc...'
  }
}

// Usage in component
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')

const handleLogin = async () => {
  try {
    const response = await apiMethods.login({ username: email, password })
    useAuthStore.getState().login(response)
    router.push('/profile')
  } catch (err) {
    setError(err.response?.data?.detail || 'Login failed')
  }
}
```

### **Register**

```ts
// Request
const response = await apiMethods.register({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone_number: '0722xxx',
  password: 'password123',
  password_confirm: 'password123'
})

// Response: Same as login (includes tokens)

// Usage
const handleRegister = async (formData) => {
  try {
    const response = await apiMethods.register(formData)
    useAuthStore.getState().login(response)
    router.push('/profile')
  } catch (err) {
    // Handle validation errors
    // err.response.data.email, err.response.data.phone_number, etc.
    showValidationErrors(err.response.data)
  }
}
```

### **Token Refresh**

Automatic via interceptor, but can be called manually:

```ts
// Manual refresh
const refreshAccessToken = async () => {
  try {
    const tokens = useAuthStore.getState().tokens
    const response = await apiMethods.refreshToken()
    useAuthStore.getState().setTokens(response.tokens)
    return response.tokens.access
  } catch (err) {
    useAuthStore.getState().logout()
    router.push('/auth/login')
  }
}

// Or use the built-in method
const token = await useAuthStore.getState().getAccessToken()
```

### **Logout**

```ts
const handleLogout = async () => {
  await apiMethods.logout()  // Blacklist token on backend
  useAuthStore.getState().logout()  // Clear local state
  useCartStore.getState().clearCart()  // Clear transient data
  router.push('/')
}
```

---

## Products

### **List Products** (with Filters)

```ts
// Request
const response = await apiMethods.getProducts({
  category: 'engines',
  make: 'toyota',
  model: 'corolla',
  make_id: 'uuid',
  model_id: 'uuid',
  year_from: 2015,
  year_to: 2020,
  price_min: 1000,
  price_max: 50000,
  search: 'oil filter',
  sort: 'price_asc',  // or newest, price_desc, popular, rating
  page: 1,
  page_size: 20
})

// Response
{
  count: 342,
  next: 'http://...?page=2',
  previous: null,
  results: [
    {
      id: 'uuid',
      product_name: 'Engine Oil 5L',
      unit_price: 2500,
      discount_percentage: 20,
      discounted_price: 2000,
      category: { id: 'uuid', name: 'Oils & Fluids' },
      category_ref: { name: 'Oils & Fluids' },
      sku: 'OIL-5L-001',
      stock_quantity: 42,
      featured_image: 'https://...',
      average_rating: 4.8,
      total_reviews: 47,
      is_featured: true
    },
    // ...
  ]
}

// Usage with infinite scroll
const [products, setProducts] = useState<Product[]>([])
const [page, setPage] = useState(1)
const [hasMore, setHasMore] = useState(true)

const loadMore = async () => {
  const response = await apiMethods.getProducts({ page, page_size: 20 })
  setProducts((prev) => [...prev, ...response.results])
  setPage((prev) => prev + 1)
  setHasMore(!!response.next)
}

// Call loadMore when user scrolls near bottom
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && hasMore) {
      loadMore()
    }
  })
  
  const target = document.getElementById('load-more-sentinel')
  if (target) observer.observe(target)
  
  return () => observer.disconnect()
}, [page, hasMore])
```

### **Product Detail**

```ts
// Request
const product = await apiMethods.getProductDetail('product-uuid')

// Response
{
  id: 'uuid',
  product_name: 'Engine Oil 5L Fully Synthetic',
  unit_price: 2500,
  discount_percentage: 20,
  discounted_price: 2000,
  description: 'Premium full synthetic...',
  sku: 'OIL-5L-001',
  stock_quantity: 42,
  featured_image: 'https://...',
  images: [
    'https://...',
    'https://...',
  ],
  average_rating: 4.8,
  reviews: [
    {
      id: 'uuid',
      author: 'John Doe',
      rating: 5,
      text: 'Excellent product!',
      created_at: '2026-02-05T...'
    }
  ],
  category: { id: 'uuid', name: 'Oils & Fluids' },
  is_featured: true,
  compatible_vehicles: [
    { id: 'uuid', make: 'Toyota', model: 'Corolla', year_from: 2015, year_to: 2020 },
    { id: 'uuid', make: 'Honda', model: 'Civic', year_from: 2018, year_to: 2022 },
  ],
  related_products: [
    // Same product structure, up to 6 items
  ]
}

// Usage
const [product, setProduct] = useState<Product | null>(null)
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  const loadProduct = async () => {
    try {
      const data = await apiMethods.getProductDetail(id)
      setProduct(data)
    } catch (err) {
      toast.error('Failed to load product')
    } finally {
      setIsLoading(false)
    }
  }
  
  loadProduct()
}, [id])
```

### **Featured Products**

```ts
// Request
const featured = await apiMethods.getFeaturedProducts()

// Response: Product[]

// Usage
const [featured, setFeatured] = useState<Product[]>([])

useEffect(() => {
  apiMethods.getFeaturedProducts().then(setFeatured)
}, [])

return (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {featured.map((product) => (
      <ProductCard key={product.id} {...product} />
    ))}
  </div>
)
```

### **Categories**

```ts
// Request
const categories = await apiMethods.getCategories()

// Response
[
  {
    id: 'uuid',
    name: 'Oils & Fluids',
    product_count: 156,
    icon: 'oil-can',  // lucide-react icon name
  },
  // ...
]

// Usage
const [categories, setCategories] = useState<Category[]>([])

useEffect(() => {
  apiMethods.getCategories().then(setCategories)
}, [])

return categories.map((cat) => (
  <Link href={`/search?category=${cat.id}`}>
    <Card className="text-center">
      <Icon name={cat.icon} size={48} />
      <h3>{cat.name}</h3>
      <p className="text-sm text-grey-500">{cat.product_count} items</p>
    </Card>
  </Link>
))
```

---

## Vehicles

### **Vehicle Makes**

```ts
// Request
const makes = await apiMethods.getVehicleMakes()

// Response
[
  { id: 'uuid', name: 'Toyota' },
  { id: 'uuid', name: 'Honda' },
  { id: 'uuid', name: 'Nissan' },
  // ...
]

// Usage
const [makes, setMakes] = useState<Make[]>([])

useEffect(() => {
  apiMethods.getVehicleMakes().then(setMakes)
}, [])

return (
  <select onChange={(e) => setSelectedMake(e.target.value)}>
    <option value="">Select Make</option>
    {makes.map((make) => (
      <option key={make.id} value={make.id}>
        {make.name}
      </option>
    ))}
  </select>
)
```

### **Vehicle Models**

```ts
// Request (requires make_id)
const models = await apiMethods.getVehicleModels('toyota-uuid')

// Response
[
  { id: 'uuid', name: 'Corolla' },
  { id: 'uuid', name: 'Camry' },
  { id: 'uuid', name: 'RAV4' },
  // ...
]
```

---

## Orders

### **List Orders**

```ts
// Request (authenticated user only)
const orders = await apiMethods.getOrders()

// Response
[
  {
    id: 'ORD-00001',
    order_status: 'delivered',  // pending, confirmed, processing, shipped, delivered, cancelled
    total: 15000,
    subtotal: 14000,
    delivery_fee: 1000,
    items: [
      {
        id: 'uuid',
        product_name: 'Engine Oil 5L',
        product_sku: 'OIL-5L-001',
        quantity: 2,
        unit_price: 2000,
        line_total: 4000,
        featured_image: 'https://...'
      }
    ],
    delivery_address: 'P.O. Box 123, Nairobi',
    delivery_city: 'Nairobi',
    estimated_delivery: '2026-02-08',
    created_at: '2026-02-06T10:00:00Z'
  }
]
```

### **Order Detail**

```ts
// Request
const order = await apiMethods.getOrderDetail('ORD-00001')

// Response: Same as list order
```

### **Checkout**

```ts
// Request
const order = await apiMethods.checkout({
  // Line items (auto-populated from cart)
  order_items: [
    {
      product_id: 'uuid',
      quantity: 2,
      unit_price: 2000
    }
  ],
  
  // Guest or authenticated
  customer_email: 'guest@example.com',
  customer_phone: '0722xxx',
  
  // Delivery
  delivery_address: 'P.O. Box 123, Nairobi',
  delivery_city: 'Nairobi',
  recipient_name: 'John Doe',
  recipient_phone: '0722xxx',
  
  // Delivery method
  delivery_method: 'standard',  // economy, standard, express
  
  // Payment
  payment_method: 'mpesa',
  payment_reference: 'STK_PUSH_ID'
})

// Response
{
  id: 'ORD-00001',
  reference: 'STK_PUSH_ID',
  order_status: 'pending_payment',
  // ... full order details
}

// Usage
const handleCheckout = async (formData) => {
  try {
    const cartItems = useCartStore.getState().items
    const order = await apiMethods.checkout({
      order_items: cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      })),
      ...formData
    })
    
    // Clear cart
    useCartStore.getState().clearCart()
    
    // Navigate to success
    router.push(`/checkout?step=success&orderId=${order.id}`)
  } catch (err) {
    toast.error('Checkout failed. Please try again.')
  }
}
```

---

## Payments

### **M-Pesa STK Push**

```ts
// Request (initiates payment prompt on phone)
const response = await apiMethods.initiateSTKPush('0722xxx', 15000)

// Response
{
  request_id: 'uuid',
  reference: 'STK_PUSH_ID',
  message: 'STK push prompt sent'
}

// Usage
const handlePayment = async (phone, amount) => {
  try {
    const response = await apiMethods.initiateSTKPush(phone, amount)
    
    // Wait for user to enter M-Pesa PIN on phone
    // Poll for payment status every 2 seconds
    const maxRetries = 30
    let retries = 0
    
    const checkPayment = async () => {
      if (retries > maxRetries) {
        toast.error('Payment not completed. Please try again.')
        return
      }
      
      const status = await apiMethods.checkPaymentStatus(response.reference)
      
      if (status.status === 'completed') {
        // Payment successful, finalize order
        completeCheckout()
      } else if (status.status === 'failed') {
        toast.error('Payment failed. Please try again.')
      } else {
        // Still pending, check again soon
        retries++
        setTimeout(checkPayment, 2000)
      }
    }
    
    checkPayment()
  } catch (err) {
    toast.error('Failed to initiate payment')
  }
}
```

### **Check Payment Status**

```ts
// Request
const status = await apiMethods.checkPaymentStatus('STK_PUSH_ID')

// Response
{
  status: 'completed' | 'pending' | 'failed',
  reference: 'STK_PUSH_ID',
  amount: 15000,
  timestamp: '2026-02-06T10:00:00Z'
}
```

---

## Admin APIs

### **Dashboard Stats**

```ts
// Request (owner-only)
const stats = await apiMethods.adminGetDashboard()

// Response
{
  total_revenue: 1500000,
  pending_orders: 12,
  total_products: 342,
  total_sales: 456,
  revenue_growth_percent: 15,
  trending_products: [
    { id: 'uuid', name: 'Product Name', sales: 42 }
  ],
  recent_orders: [
    // Last 5 orders
  ]
}
```

### **Admin Orders List**

```ts
// Request
const response = await apiMethods.adminGetOrders({
  status: 'pending',  // Filter by status
  page: 1,
  page_size: 20
})

// Response
{
  count: 342,
  next: 'http://...?page=2',
  previous: null,
  results: [
    {
      id: 'ORD-00001',
      order_status: 'pending',
      customer_name: 'John Doe',
      customer_phone: '0722xxx',
      customer_email: 'john@example.com',
      total: 15000,
      items_count: 3,
      created_at: '2026-02-06T10:00:00Z',
      // ...
    }
  ]
}
```

### **Update Order Status**

```ts
// Request
const updated = await apiMethods.adminUpdateOrder('ORD-00001', 'shipped')

// Response: Full order object with new status

// Usage
const handleStatusChange = async (orderId, newStatus) => {
  try {
    await apiMethods.adminUpdateOrder(orderId, newStatus)
    toast.success(`Order updated to ${newStatus}`)
    // Refresh orders list
    loadOrders()
  } catch (err) {
    toast.error('Failed to update order')
  }
}
```

---

## Error Handling

### **Error Types**

```ts
// Validation error (400, 422)
try {
  await apiMethods.register(data)
} catch (err) {
  // err.response.data = {
  //   email: ['Email already exists'],
  //   phone_number: ['Invalid format'],
  //   password: ['Password too short']
  // }
  showValidationErrors(err.response.data)
}

// Unauthorized (401)
try {
  await apiMethods.getOrders()
} catch (err) {
  // Token expired or invalid
  // Interceptor will attempt refresh
  // If refresh fails, user is logged out
  router.push('/auth/login')
}

// Forbidden (403)
try {
  await apiMethods.adminGetOrders()
} catch (err) {
  // User is not owner, redirect
  router.push('/')
}

// Not found (404)
try {
  await apiMethods.getProductDetail('invalid-id')
} catch (err) {
  // Product doesn't exist
  router.push('/not-found')
}

// Server error (5xx)
try {
  await apiMethods.checkout(data)
} catch (err) {
  toast.error('Server error. Please try again later.')
}

// Network error (timeout, no connection)
try {
  await apiMethods.getProducts()
} catch (err) {
  if (!navigator.onLine) {
    toast.error('No internet connection')
  } else {
    toast.error('Network error. Please try again.')
  }
}
```

### **Error Response Format**

```ts
// Backend returns errors as:
{
  detail: 'Error message',
  // or
  field: ['Error message'],
  // or validation errors:
  email: ['Email is required'],
  password: ['Password must be 8+ characters']
}
```

---

## Best Practices

1. **Always handle errors**:
   ```ts
   try {
     await apiMethods.checkout(data)
   } catch (err) {
     toast.error('Checkout failed')
   }
   ```

2. **Use loading states**:
   ```ts
   const [isLoading, setIsLoading] = useState(false)
   const handleClick = async () => {
     setIsLoading(true)
     try {
       await apiMethods.doSomething()
     } finally {
       setIsLoading(false)
     }
   }
   ```

3. **Validate input before API call**:
   ```ts
   const handleSubmit = async (data) => {
     const errors = validateForm(data)
     if (Object.keys(errors).length > 0) {
       setErrors(errors)
       return
     }
     // Call API
   }
   ```

4. **Cache when appropriate**:
   ```ts
   const [categories, setCategories] = useState<Category[] | null>(null)
   useEffect(() => {
     if (!categories) {
       apiMethods.getCategories().then(setCategories)
     }
   }, [])
   ```

5. **Handle offline**:
   ```ts
   if (!navigator.onLine) {
     // Use cached data from localStorage/IndexedDB
     useLocalCart()
     return
   }
   ```

---

**Last Updated**: February 6, 2026
