import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AutoParts Kenya Brand Colors
        'reliable-red': '#D32F2F',      // CTAs, danger states
        'mechanic-blue': '#1976D2',     // Navigation, links, primary
        'trust-gold': '#FBC02D',        // Badges, promotions, highlights
        'road-grey': {
          900: '#424242',               // Dark text
          700: '#616161',               // Secondary text
          500: '#757575',               // Tertiary text
          300: '#E0E0E0',               // Light borders, disabled
          100: '#FAFAFA',               // Background
        },
        'success-green': '#388E3C',     // Success states, order confirmed
        'warning-orange': '#F57C00',    // Low stock alerts
        'info-cyan': '#0097A7',         // Information
      },
      backgroundColor: {
        primary: '#FAFAFA',             // Main background
        secondary: '#FFFFFF',            // Cards, modals
      },
      textColor: {
        primary: '#424242',              // Headings, primary text
        secondary: '#616161',            // Body, descriptions
        tertiary: '#757575',             // Hints, timestamps
        inverted: '#FFFFFF',             // Text on dark backgrounds
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        // Heading sizes
        'h1': ['28px', { lineHeight: '32px', fontWeight: '700' }],   // Page titles
        'h2': ['22px', { lineHeight: '26px', fontWeight: '700' }],   // Section titles
        'h3': ['18px', { lineHeight: '22px', fontWeight: '700' }],   // Subsections
        'h4': ['16px', { lineHeight: '20px', fontWeight: '700' }],   // Card titles
        // Body sizes
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],  // Large body
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],  // Default body
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],  // Small body
        // Special
        'price': ['20px', { lineHeight: '24px', fontWeight: '700' }],   // Product prices
        'badge': ['11px', { lineHeight: '14px', fontWeight: '600' }],   // Badge text
      },
      spacing: {
        'safe-top': 'var(--safe-area-inset-top)',
        'safe-bottom': 'var(--safe-area-inset-bottom)',
        'safe-left': 'var(--safe-area-inset-left)',
        'safe-right': 'var(--safe-area-inset-right)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.05)',
        'md': '0 4px 6px rgba(0,0,0,0.1)',
        'lg': '0 10px 15px rgba(0,0,0,0.1)',
        'xl': '0 20px 25px rgba(0,0,0,0.1)',
        'elevated': '0 8px 16px rgba(25, 118, 210, 0.15)',  // Mechanic blue shadow
      },
      animation: {
        'spin-wheel': 'spinWheel 1s linear infinite',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
        'scale-pop': 'scalePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        spinWheel: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scalePop: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1.15)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backgroundImage: {
        'gradient-header': 'linear-gradient(135deg, #1976D2 0%, #757575 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(25,118,210,0.1) 0%, rgba(211,47,47,0.05) 100%)',
        'tyre-pattern': "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\"><path d=\"M8 16c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z\" opacity=\"0.05\" fill=\"%23000\"/></svg>')",
      },
      maxWidth: {
        'app': '100%',  // Full width responsive
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      minHeight: {
        'touch': '48px',  // Minimum touch target
      },
      zIndex: {
        'drawer': '40',
        'modal': '50',
        'sticky': '20',
        'fab': '30',
      },
    },
  },
  plugins: [
    // Custom plugin for dynamic text scaling
    function ({ addUtilities }: any) {
      addUtilities({
        '.text-scale-sm': {
          fontSize: '12px',
          '@media (min-width: 640px)': { fontSize: '14px' },
        },
        '.text-scale-base': {
          fontSize: '14px',
          '@media (min-width: 640px)': { fontSize: '16px' },
        },
        '.text-scale-lg': {
          fontSize: '16px',
          '@media (min-width: 640px)': { fontSize: '20px' },
        },
      });
    },
  ],
};

export default config;
