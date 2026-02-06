// API Client types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  response?: {
    status: number;
    data: Record<string, any>;
  };
  message: string;
}

// Auth request/response
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    profile: {
      id: number;
      phone_number: string;
      avatar_url?: string;
      is_owner: boolean;
      bio?: string;
    };
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

// Product APIs
export interface GetProductsParams {
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

export interface GetVehicleMakesParams {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface GetVehicleModelsParams {
  make?: number;
  year_from?: number;
  year_to?: number;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// Checkout APIs
export interface CheckoutRequest {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string;
  recipient_name: string;
  recipient_phone: string;
  delivery_type: 'standard' | 'express' | 'economy';
  guest_email?: string;
  guest_phone?: string;
  customer_notes?: string;
}

export interface CheckoutResponse {
  id: number;
  order_number: string;
  subtotal: number;
  delivery_cost: number;
  total_amount: number;
  status: string;
  created_at: string;
}

// M-Pesa APIs
export interface STKPushRequest {
  order_id: number;
  phone_number?: string;
}

export interface STKPushResponse {
  success: boolean;
  merchant_request_id: string;
  checkout_request_id: string;
  response_code: string;
  response_description: string;
}

export interface CheckPaymentStatusResponse {
  order_id: number;
  order_number: string;
  payment_status: string;
  order_status: string;
  total_amount: number;
  paid_at?: string;
}

// Profile APIs
export interface GetProfileResponse {
  id: number;
  user_id: number;
  phone_number: string;
  avatar_url?: string;
  is_owner: boolean;
  bio?: string;
  saved_vehicles?: Array<{
    id: number;
    make_name: string;
    model_name: string;
    year: number;
    is_primary: boolean;
  }>;
  saved_addresses?: Array<{
    id: number;
    address_type: string;
    street_address: string;
    city: string;
    is_default: boolean;
  }>;
}

export interface UpdateProfileRequest {
  phone_number?: string;
  avatar_url?: string;
  bio?: string;
  first_name?: string;
  last_name?: string;
}

// Orders APIs
export interface GetOrdersParams {
  order_status?: string;
  payment_status?: string;
  page?: number;
  page_size?: number;
}

export interface GetOrderDetailResponse {
  id: number;
  order_number: string;
  items: Array<{
    id: number;
    product_name: string;
    sku: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }>;
  subtotal: number;
  delivery_cost: number;
  total_amount: number;
  order_status: string;
  payment_status: string;
  delivery_address: string;
  delivery_city: string;
  recipient_name: string;
  recipient_phone: string;
  created_at: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

// Admin APIs (owner only)
export interface AdminDashboardResponse {
  total_revenue: number;
  total_orders: number;
  orders_today: number;
  total_products: number;
  low_stock_items: number;
}

export interface RevenueAnalyticsResponse {
  period: {
    today: number;
    week: number;
    month: number;
  };
  average_order_value: number;
  paid_orders_count: number;
}

export interface TopProductResponse {
  product_id: number;
  product_name: string;
  sku: string;
  quantity_sold: number;
  revenue: number;
}

export interface LowStockAlertResponse {
  product_id: number;
  product_name: string;
  sku: string;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  category: string;
}

export interface ProfitAnalysisResponse {
  product_id: number;
  product_name: string;
  sku: string;
  revenue: number;
  cost: number;
  profit: number;
  profit_margin_percent: number;
}
