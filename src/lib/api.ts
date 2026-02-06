/**
 * API Client with JWT interceptor and base configuration
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { MESSAGES } from './constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore.getState();
    const token = authStore.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const authStore = useAuthStore.getState();

      try {
        const refreshToken = authStore.getRefreshToken();

        if (!refreshToken) {
          // No refresh token, logout user
          authStore.logout();
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return Promise.reject(error);
        }

        // Try to refresh token
        const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        const newTokens = {
          access,
          refresh: refreshToken,
        };

        // Update tokens in store
        authStore.setTokens(newTokens);
        localStorage.setItem('access_token', access);

        // Retry original request
        const config = originalRequest;
        config.headers.Authorization = `Bearer ${access}`;
        return apiClient(config);
      } catch (refreshError) {
        // Refresh failed, logout user
        authStore.logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Client Methods
export const apiMethods = {
  // Auth endpoints
  login: (data: { username?: string; email?: string; password: string }) =>
    apiClient.post('/users/token/', data),

  register: (data: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    phone_number?: string;
  }) => apiClient.post('/users/register/', data),

  refreshToken: (refreshToken: string) =>
    apiClient.post('/users/token/refresh/', { refresh: refreshToken }),

  // Profile endpoints
  getProfile: () => apiClient.get('/users/profile/'),

  updateProfile: (data: any) => apiClient.patch('/users/profile/', data),

  // Vehicles endpoints
  getVehicleMakes: (params?: any) => apiClient.get('/vehicles/makes/', { params }),

  getVehicleModels: (params?: any) => apiClient.get('/vehicles/models/', { params }),

  // Products endpoints
  getProducts: (params?: any) => apiClient.get('/products/products/', { params }),

  getProductDetail: (id: number) => apiClient.get(`/products/products/${id}/`),

  getFeaturedProducts: (params?: any) =>
    apiClient.get('/products/products/featured/', { params }),

  getCategories: (params?: any) => apiClient.get('/products/categories/', { params }),

  // Orders endpoints
  checkout: (data: any) => apiClient.post('/orders/checkout/', data),

  getOrders: (params?: any) => apiClient.get('/orders/my-orders/', { params }),

  getOrderDetail: (orderNumber: string) =>
    apiClient.get(`/orders/order/${orderNumber}/`),

  // Payments endpoints
  initiateSTKPush: (data: { order_id: number; phone_number?: string }) =>
    apiClient.post('/payments/initiate-stk-push/', data),

  checkPaymentStatus: (orderId: number) =>
    apiClient.get('/payments/check-status/', { params: { order_id: orderId } }),

  // Admin endpoints (owner only)
  adminGetDashboard: () => apiClient.get('/analytics/dashboard/'),

  adminGetRevenueAnalytics: (params?: any) =>
    apiClient.get('/analytics/revenue/', { params }),

  adminGetTopProducts: (params?: any) =>
    apiClient.get('/analytics/top-products/', { params }),

  adminGetLowStockAlerts: () => apiClient.get('/analytics/low-stock/'),

  adminGetOrderStatusDist: () => apiClient.get('/analytics/order-status/'),

  adminGetPaymentStatusDist: () => apiClient.get('/analytics/payment-status/'),

  adminGetProfitAnalysis: (params?: any) =>
    apiClient.get('/analytics/profit/', { params }),

  adminGetOrders: (params?: any) => apiClient.get('/orders/admin/orders/', { params }),

  adminUpdateOrderStatus: (orderId: number, data: any) =>
    apiClient.patch(`/orders/admin/orders/${orderId}/`, data),

  adminGetProducts: (params?: any) =>
    apiClient.get('/products/products/', { params }),

  adminCreateProduct: (data: any) => apiClient.post('/products/products/', data),

  adminUpdateProduct: (id: number, data: any) =>
    apiClient.patch(`/products/products/${id}/`, data),

  adminDeleteProduct: (id: number) =>
    apiClient.delete(`/products/products/${id}/`),
};

// Error handling utility
export const handleApiError = (error: any): string => {
  const lang = 'en'; // Could be dynamic based on locale

  if (!error.response) {
    return MESSAGES[lang as 'EN' | 'SW'].NETWORK_ERROR;
  }

  const status = error.response.status;
  const data = error.response.data;

  switch (status) {
    case 400:
      // Try to extract field-specific errors
      if (typeof data === 'object') {
        const firstError = Object.values(data)[0];
        if (Array.isArray(firstError)) {
          return firstError[0] as string;
        }
        if (typeof firstError === 'string') {
          return firstError;
        }
      }
      return 'Invalid request. Please check your input.';

    case 401:
      return MESSAGES[lang as 'EN' | 'SW'].LOGIN_ERROR;

    case 403:
      return 'You do not have permission to perform this action.';

    case 404:
      return 'Resource not found.';

    case 409:
      return 'Conflict. This item may already exist.';

    case 429:
      return 'Too many requests. Please try again later.';

    case 500:
      return MESSAGES[lang as 'EN' | 'SW'].SERVER_ERROR;

    case 503:
      return 'Service temporarily unavailable. Please try again later.';

    default:
      return MESSAGES[lang as 'EN' | 'SW'].ERROR;
  }
};

export default apiClient;
