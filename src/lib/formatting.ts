/**
 * Currency, date, and format utilities for AutoParts Kenya (Kenyan context)
 */

// Currency Formatting (Kenyan Shillings)
export const formatKsh = (amount: number, includeSymbol = true): string => {
  if (!Number.isFinite(amount)) return 'KSh 0';

  const formatted = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  if (!includeSymbol) {
    return formatted.replace('KES', '').trim();
  }

  return formatted.replace('KES', 'KSh').trim();
};

// Phone Number Formatting (Kenyan)
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');

  // Handle different input formats
  // +254xxxxxxxxx -> 0xxxxxxxxx
  if (cleaned.startsWith('254')) {
    cleaned = '0' + cleaned.substring(3);
  }

  // Format as 0XXX XXXXXX
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4)}`;
  }

  return phone;
};

// Phone Number Normalization (for API calls)
export const normalizePhoneNumber = (phone: string): string => {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');

  // If starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }

  // If already has 254, keep it
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }

  return cleaned;
};

// Validate Phone Number (Kenyan format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = normalizePhoneNumber(phone);
  // Must be 254 + 9 digits for mobile/landline
  return /^254[0-9]{9}$/.test(cleaned);
};

// Date Formatting
export const formatDate = (dateString: string | Date, format: 'short' | 'long' = 'short'): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? {
          year: '2-digit',
          month: 'short',
          day: 'numeric',
          timeZone: 'Africa/Nairobi',
        }
      : {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          timeZone: 'Africa/Nairobi',
        };

  return date.toLocaleDateString('en-KE', options);
};

// Time Formatting
export const formatTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) {
    return 'Invalid time';
  }

  return date.toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Nairobi',
  });
};

// DateTime Formatting
export const formatDateTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return `${formatDate(date)} ${formatTime(date)}`;
};

// Relative Time (e.g., "2 days ago")
export const formatRelativeTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm ago';

  return Math.floor(seconds) + 's ago';
};

// Estimated Delivery Date
export const getEstimatedDeliveryDate = (minDays: number, maxDays: number): string => {
  const today = new Date();
  const minDate = new Date(today.getTime() + minDays * 24 * 60 * 60 * 1000);
  const maxDate = new Date(today.getTime() + maxDays * 24 * 60 * 60 * 1000);

  if (minDays === maxDays) {
    return formatDate(minDate, 'short');
  }

  return `${formatDate(minDate, 'short')} - ${formatDate(maxDate, 'short')}`;
};

// SKU Formatting (uppercase)
export const formatSKU = (sku: string): string => {
  return sku.toUpperCase();
};

// Slug to Title
export const slugToTitle = (slug: string): string => {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Truncate Text
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Discount Percentage Display
export const formatDiscountPercentage = (discount: number): string => {
  if (discount <= 0) return '';
  return `${discount}% off`;
};

// Discount Price
export const calculateDiscountedPrice = (price: number, discountPercent: number): number => {
  if (discountPercent <= 0 || discountPercent > 100) return price;
  return price * (1 - discountPercent / 100);
};

// Rating Format
export const formatRating = (rating: number | undefined | null): string => {
  if (!rating) return '—';
  return (Math.round(rating * 10) / 10).toFixed(1);
};

// Profit Margin Format
export const formatProfitMargin = (margin: number | undefined): string => {
  if (!margin) return '—';
  return `${Math.round(margin)}%`;
};

// URL Safe String
export const toUrlSafe = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Capitalize First Letter
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Format Product Name for Display
export const formatProductName = (name: string): string => {
  return capitalize(name.toLowerCase());
};

// Bytes to Human Readable
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Format Address
export const formatAddress = (
  street: string,
  city: string,
  postalCode: string,
  country = 'Kenya'
): string => {
  const parts = [street, city, postalCode, country].filter(Boolean);
  return parts.join(', ');
};

// Order Status Color
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: '#FBC02D',
    confirmed: '#0097A7',
    processing: '#1976D2',
    shipped: '#388E3C',
    delivered: '#388E3C',
    cancelled: '#D32F2F',
    paid: '#388E3C',
    unpaid: '#757575',
    failed: '#D32F2F',
    refunded: '#1976D2',
  };
  return colors[status.toLowerCase()] || '#757575';
};

// Order Status Badge Class
export const getStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    processing: 'badge-info',
    shipped: 'badge-success',
    delivered: 'badge-success',
    cancelled: 'bg-red-100 text-red-700',
    paid: 'badge-success',
    unpaid: 'badge-default',
    failed: 'bg-red-100 text-red-700',
    refunded: 'badge-info',
  };
  return classes[status.toLowerCase()] || 'badge-default';
};
