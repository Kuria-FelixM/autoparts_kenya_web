// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// App Branding
export const APP_NAME = 'AutoParts Kenya';
export const APP_VERSION = '1.0.0';
export const COMPANY_EMAIL = 'support@autopartskenya.co.ke';
export const COMPANY_PHONE = '+254 701 000 000';

// Feature Flags
export const FEATURES = {
  ENABLE_PWA: true,
  ENABLE_VOICE_SEARCH: false,
  ENABLE_AR_PREVIEW: false,
  ENABLE_REVIEWS: false,
  ENABLE_CHAT_SUPPORT: false,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  INFINITE_SCROLL_THRESHOLD: 0.8, // 80% of scroll
};

// Cache Configuration
export const CACHE_DURATION = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  VEHICLES: 24 * 60 * 60 * 1000, // 24 hours
  CATEGORIES: 24 * 60 * 60 * 1000, // 24 hours
  PROFILE: 60 * 60 * 1000, // 1 hour
};

// Order Status Labels & Colors
export const ORDER_STATUS = {
  pending: { label: 'Pending', color: '#FBC02D', icon: 'Clock' },
  confirmed: { label: 'Confirmed', color: '#0097A7', icon: 'CheckCircle' },
  processing: { label: 'Processing', color: '#1976D2', icon: 'Package' },
  shipped: { label: 'Shipped', color: '#388E3C', icon: 'Truck' },
  delivered: { label: 'Delivered', color: '#388E3C', icon: 'CheckCircle2' },
  cancelled: { label: 'Cancelled', color: '#D32F2F', icon: 'X' },
};

export const PAYMENT_STATUS = {
  unpaid: { label: 'Unpaid', color: '#757575', icon: 'AlertCircle' },
  pending: { label: 'Pending', color: '#FBC02D', icon: 'Clock' },
  paid: { label: 'Paid', color: '#388E3C', icon: 'CheckCircle' },
  failed: { label: 'Failed', color: '#D32F2F', icon: 'XCircle' },
  refunded: { label: 'Refunded', color: '#1976D2', icon: 'RotateCcw' },
};

// Delivery Options
export const DELIVERY_OPTIONS = {
  economy: { label: 'Economy', days: { min: 5, max: 7 }, costPerKm: 2 },
  standard: { label: 'Standard', days: { min: 2, max: 3 }, costPerKm: 5 },
  express: { label: 'Express', days: { min: 0, max: 1 }, costPerKm: 10 },
};

// Nairobi Base Delivery Costs
export const NAIROBI_DELIVERY_COSTS = {
  economy: 150,
  standard: 300,
  express: 500,
};

// Price Limits
export const PRICE_LIMITS = {
  MIN: 0,
  MAX: 1000000, // KSh 1 million
};

// Stock Alerts
export const STOCK_ALERTS = {
  LOW_STOCK_THRESHOLD: 10,
  CRITICAL_STOCK_THRESHOLD: 3,
  OUT_OF_STOCK_LABEL: 'Out of Stock',
  LOW_STOCK_LABEL: 'Low Stock',
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PHONE_LENGTH: 12, // For KE format (254XXXXXXXXX)
  PHONE_PREFIX: '254', // Kenya country code
  EMAIL_MAX_LENGTH: 254,
};

// Kenyan Phone Format
export const PHONE_FORMATS = {
  KE_LANDLINE: /^(\+254|0)(2[0-9]|4[0-5]|6[0-9]|7[0-3])/,
  KE_MOBILE: /^(\+254|0)(7|1)[0-9]{8}$/,
  ALL_KE: /^(\+254|0)[1-9]\d{8}$/,
};

// Swahili/English Translations
export const MESSAGES = {
  EN: {
    // Common
    APP_NAME: 'AutoParts Kenya',
    LOADING: 'Loading...',
    ERROR: 'Something went wrong',
    RETRY: 'Try Again',
    CANCEL: 'Cancel',
    CONFIRM: 'Confirm',
    DELETE: 'Delete',
    EDIT: 'Edit',
    SAVE: 'Save',
    BACK: 'Back',

    // Auth
    LOGIN_TITLE: 'Sign In',
    REGISTER_TITLE: 'Create Account',
    FORGOT_PASSWORD: 'Forgot Password?',
    EMAIL_OR_USERNAME: 'Email or Username',
    PASSWORD: 'Password',
    PASSWORD_CONFIRM: 'Confirm Password',
    PHONE: 'Phone Number',
    REMEMBER_ME: 'Remember me',
    DONT_HAVE_ACCOUNT: "Don't have an account?",
    ALREADY_HAVE_ACCOUNT: 'Already have an account?',
    LOGIN_ERROR: 'Invalid email or password',
    REGISTRATION_ERROR: 'Unable to create account. Please try again.',

    // Cart & Checkout
    ADD_TO_CART: 'Add to Cart',
    CONTINUE_SHOPPING: 'Continue Shopping',
    VIEW_CART: 'View Cart',
    CHECKOUT: 'Checkout',
    CONTINUE_AS_GUEST: 'Continue as Guest',
    LOGIN_TO_CHECKOUT: 'Log In / Create Account',
    CART_EMPTY: 'Your cart is empty',
    SUBTOTAL: 'Subtotal',
    DELIVERY_FEE: 'Delivery Fee',
    TOTAL: 'Total',
    REMOVE_FROM_CART: 'Remove from Cart',
    UPDATE_QUANTITY: 'Update Quantity',

    // Orders
    MY_ORDERS: 'My Orders',
    ORDER_NUMBER: 'Order Number',
    ORDER_DATE: 'Order Date',
    DELIVERY_ADDRESS: 'Delivery Address',
    TRACK_ORDER: 'Track Order',
    ORDER_RECEIVED: 'Order Received!',
    THANK_YOU: 'Thank you for your purchase',
    ORDER_DETAILS: 'Order Details',

    // Products
    SEARCH: 'Search parts...',
    FILTER: 'Filters',
    SORT: 'Sort By',
    PRICE: 'Price',
    RATING: 'Rating',
    NEWEST: 'Newest',
    POPULAR: 'Most Popular',
    FEATURED_PRODUCTS: 'Featured Products',
    RELATED_PRODUCTS: 'Related Products',
    IN_STOCK: 'In Stock',
    OUT_OF_STOCK: 'Out of Stock',
    COMPATIBILITY: 'Compatibility',

    // Delivery
    DELIVERY_OPTIONS: 'Delivery Options',
    ESTIMATED_DELIVERY: 'Estimated Delivery',
    SELECT_DELIVERY: 'Select Delivery Type',
    DELIVERY_INFO: 'Delivery Information',

    // Errors & Success
    SUCCESS: 'Success!',
    ITEM_ADDED: 'Item added to cart',
    ITEM_REMOVED: 'Item removed from cart',
    FAVORITES_ADDED: 'Added to favorites',
    FAVORITES_REMOVED: 'Removed from favorites',
    PAYMENT_SUCCESS: 'Payment successful!',
    PAYMENT_PENDING: 'Payment pending. Please confirm M-Pesa prompt on your phone.',
    PAYMENT_FAILED: 'Payment failed. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',

    // Validation
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email',
    INVALID_PHONE: 'Please enter a valid Kenyan phone number',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    WEAK_PASSWORD: 'Password must be at least 8 characters',
  },
  SW: {
    // Common
    APP_NAME: 'AutoParts Kenya',
    LOADING: 'Inapakia...',
    ERROR: 'Kitu kimetatiza',
    RETRY: 'Jaribu Tena',
    CANCEL: 'Ghairi',
    CONFIRM: 'Thibitisha',
    DELETE: 'Futa',
    EDIT: 'Hariri',
    SAVE: 'Hifadhi',
    BACK: 'Nyuma',

    // Auth
    LOGIN_TITLE: 'Ingia',
    REGISTER_TITLE: 'Tengeneza Akaunti',
    FORGOT_PASSWORD: 'Umesahau Neno la Siri?',
    EMAIL_OR_USERNAME: 'Barua au Jina la Mtumiaji',
    PASSWORD: 'Neno la Siri',
    PASSWORD_CONFIRM: 'Thibitisha Neno la Siri',
    PHONE: 'Namba ya Simu',
    REMEMBER_ME: 'Nikumbuke',
    DONT_HAVE_ACCOUNT: 'Huna akaunti?',
    ALREADY_HAVE_ACCOUNT: 'Una akaunti tayari?',
    LOGIN_ERROR: 'Barua/namba au neno la siri si sahihi',
    REGISTRATION_ERROR: 'Imeshindwa kutengeneza akaunti. Jaribu tena.',

    // Cart & Checkout
    ADD_TO_CART: 'Ongeza kwenye Karata',
    CONTINUE_SHOPPING: 'Endelea Kununua',
    VIEW_CART: 'Tazama Karata',
    CHECKOUT: 'Malipo',
    CONTINUE_AS_GUEST: 'Endelea Kama Mgeni',
    LOGIN_TO_CHECKOUT: 'Ingia / Tengeneza Akaunti',
    CART_EMPTY: 'Karata yako ni tupu',
    SUBTOTAL: 'Jumla ya Chini',
    DELIVERY_FEE: 'Malipo ya Uwasilishaji',
    TOTAL: 'Jumla',
    REMOVE_FROM_CART: 'Ondoa kutoka Karata',
    UPDATE_QUANTITY: 'Sasisha Idadi',

    // Orders
    MY_ORDERS: 'Agizo Zangu',
    ORDER_NUMBER: 'Namba ya Agizo',
    ORDER_DATE: 'Tarehe ya Agizo',
    DELIVERY_ADDRESS: 'Anwani ya Uwasilishaji',
    TRACK_ORDER: 'Fuatilia Agizo',
    ORDER_RECEIVED: 'Agizo Liliterima!',
    THANK_YOU: 'Asante kwa ununuzi wako',
    ORDER_DETAILS: 'Maelezo ya Agizo',

    // Products
    SEARCH: 'Tafuta sehemu...',
    FILTER: 'Kichujio',
    SORT: 'Panga Kwa',
    PRICE: 'Bei',
    RATING: 'Ukadiriaji',
    NEWEST: 'Mpya',
    POPULAR: 'Maadhimisho',
    FEATURED_PRODUCTS: 'Bidhaa Zilizochaguliwa',
    RELATED_PRODUCTS: 'Bidhaa Zinazolingana',
    IN_STOCK: 'Ipo Kwa Stoo',
    OUT_OF_STOCK: 'Hakuna Kwa Stoo',
    COMPATIBILITY: 'Uwiano',

    // Delivery
    DELIVERY_OPTIONS: 'Chaguo za Uwasilishaji',
    ESTIMATED_DELIVERY: 'Uwasilishaji Unatarajiwa',
    SELECT_DELIVERY: 'Chagua Aina ya Uwasilishaji',
    DELIVERY_INFO: 'Maelezo ya Uwasilishaji',

    // Errors & Success
    SUCCESS: 'Kamata!',
    ITEM_ADDED: 'Bidhaa imeongezwa kwenye karata',
    ITEM_REMOVED: 'Bidhaa imeondolewa kwenye karata',
    FAVORITES_ADDED: 'Imeongezwa kwa mapendekezo',
    FAVORITES_REMOVED: 'Imeondolewa kwa mapendekezo',
    PAYMENT_SUCCESS: 'Malipo yafanikiwa!',
    PAYMENT_PENDING: 'Malipo yanakubali. Tafadhali thibitisha M-Pesa kwenye simu yako.',
    PAYMENT_FAILED: 'Malipo yashindwa. Jaribu tena.',
    NETWORK_ERROR: 'Hitilafu ya mtandao. Tafadhali angalia muunganisho wako.',
    SERVER_ERROR: 'Hitilafu ya seva. Jaribu tena baadaye.',

    // Validation
    REQUIRED_FIELD: 'Sehemu hii inahitajika',
    INVALID_EMAIL: 'Tafadhali ingiza barua halali',
    INVALID_PHONE: 'Tafadhali ingiza namba halali ya simu ya Kenya',
    PASSWORDS_DONT_MATCH: 'Maneno ya siri hayalingani',
    WEAK_PASSWORD: 'Neno la siri lazima liwe na angalau herufi 8',
  },
};

// Badges & Tags
export const BADGES = {
  GENUINE: { label: 'Genuine Parts', icon: 'Shield', color: 'trust-gold' },
  SECURE_MPESA: { label: 'Secure M-Pesa', icon: 'Lock', color: 'success-green' },
  FAST_DELIVERY: { label: 'Nairobi 1-2 Days', icon: 'Truck', color: 'mechanic-blue' },
  IN_STOCK: { label: 'In Stock', icon: 'Check', color: 'success-green' },
  LOW_STOCK: { label: 'Low Stock', icon: 'AlertCircle', color: 'warning-orange' },
  FEATURED: { label: 'Featured', icon: 'Star', color: 'trust-gold' },
  CERTIFIED: { label: 'Certified Mechanic Approved', icon: 'Verified', color: 'success-green' },
};

// Business Hours
export const BUSINESS_HOURS = {
  monday_to_friday: '8:00 AM - 6:00 PM',
  saturday: '9:00 AM - 5:00 PM',
  sunday: 'Closed',
  timezone: 'Africa/Nairobi',
};

// Social Links
export const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me/254701000000',
  facebook: 'https://facebook.com/autopartskenya',
  twitter: 'https://twitter.com/autopartskenya',
  instagram: 'https://instagram.com/autopartskenya',
};
