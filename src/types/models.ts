// Product types
export interface Vehicle {
  id: number;
  name: string;
  make?: VehicleMake;
}

export interface VehicleMake {
  id: number;
  name: string;
  country?: string;
  logo_url?: string;
  models_count?: number;
}

export interface VehicleModel {
  id: number;
  make: VehicleMake;
  make_id: number;
  name: string;
  year_from: number;
  year_to: number;
  engine_type?: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  image_url?: string;
  parent_id?: number;
  children?: Category[];
  products_count?: number;
  is_active: boolean;
  display_order: number;
}

export interface ProductImage {
  id: number;
  product: number;
  image: string;
  alt_text?: string;
  display_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: Category;
  category_id: number;
  sku: string;
  price: number;
  cost_price?: number;
  discount_percentage: number;
  stock: number;
  reserved_stock: number;
  available_stock: number; // property
  discounted_price: number; // property
  profit_margin?: number; // property (owner only)
  primary_image?: string;
  images?: ProductImage[];
  compatible_vehicles?: VehicleModel[];
  is_featured: boolean;
  is_active: boolean;
  rating?: number; // 0-5
  review_count?: number;
  created_at: string;
  updated_at: string;
}

// Order types
export interface OrderItem {
  id: number;
  order: number;
  product?: Product;
  product_id?: number;
  product_name: string;
  sku: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: number;
  user?: number;
  user_id?: number;
  order_number: string;
  guest_email?: string;
  guest_phone?: string;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string;
  recipient_name: string;
  recipient_phone: string;
  subtotal: number;
  delivery_cost: number;
  total_amount: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  customer_notes?: string;
  admin_notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  customer_email: string; // computed property
  customer_phone: string; // computed property
  item_count: number; // property
}

// Payment types
export interface TransactionLog {
  id: number;
  order: number;
  transaction_type: 'stk_initiate' | 'stk_timeout' | 'user_cancel' | 'payment_success' | 'payment_failed' | 'payment_pending';
  merchant_request_id?: string;
  checkout_request_id?: string;
  phone_number?: string;
  amount?: number;
  response_code?: string;
  response_description?: string;
  mpesa_receipt?: string;
  raw_response?: Record<string, any>;
  created_at: string;
}

// User types
export interface UserProfile {
  id: number;
  user: number;
  user_id: number;
  phone_number: string;
  avatar_url?: string;
  bio?: string;
  is_owner: boolean;
  business_registration?: string;
  tax_id?: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_superuser: boolean;
  last_login?: string;
  date_joined: string;
  profile: UserProfile;
}

export interface SavedVehicle {
  id: number;
  user: number;
  make: number;
  make_name?: string;
  model: number;
  model_name?: string;
  year: number;
  nickname?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedAddress {
  id: number;
  user: number;
  address_type: 'home' | 'work' | 'other';
  label?: string;
  street_address: string;
  city: string;
  postal_code: string;
  recipient_name: string;
  recipient_phone: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Filter/Search types
export interface ProductFilters {
  vehicle_make?: number;
  vehicle_model?: number;
  vehicle_year?: number;
  category?: number;
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
