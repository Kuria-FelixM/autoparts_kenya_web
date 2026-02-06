// Common types and enums

export enum OrderStatusEnum {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatusEnum {
  UNPAID = 'unpaid',
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum DeliveryTypeEnum {
  ECONOMY = 'economy',
  STANDARD = 'standard',
  EXPRESS = 'express',
}

export enum AddressTypeEnum {
  HOME = 'home',
  WORK = 'work',
  OTHER = 'other',
}

export interface PaginationMeta {
  count: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string | string[]>;
  timestamp?: string;
}

export type Locale = 'en' | 'sw';

export interface ToastOptions {
  duration?: number;
  position?: 'top' | 'bottom' | 'center' | 'top-right' | 'bottom-right';
  type?: 'success' | 'error' | 'info' | 'warning';
}

export interface ModalOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: 'confirm' | 'alert' | 'danger';
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface FilterState {
  vehicleMake?: number;
  vehicleModel?: number;
  vehicleYear?: number;
  categoryId?: number;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  searchQuery?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';
  page?: number;
  pageSize?: number;
}

export interface CartItemPayload {
  product_id: number;
  product_name: string;
  sku: string;
  unit_price: number;
  quantity: number;
  primary_image?: string;
}

export interface CheckoutPayload {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string;
  recipient_name: string;
  recipient_phone: string;
  delivery_type: DeliveryTypeEnum;
  guest_email?: string;
  guest_phone?: string;
  customer_notes?: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field?: string;
  direction?: SortDirection;
}
