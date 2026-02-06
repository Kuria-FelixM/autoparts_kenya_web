'use client';

import type { Metadata } from 'next';
import { ReactNode, useEffect } from 'react';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';

// Component imports
import dynamic from 'next/dynamic';

const TopAppBar = dynamic(() => import('@/components/layout/TopAppBar'), {
  ssr: true,
});

const BottomNav = dynamic(() => import('@/components/layout/BottomNav'), {
  ssr: true,
});

const SideDrawer = dynamic(() => import('@/components/layout/SideDrawer'), {
  ssr: true,
});

export const metadata: Metadata = {
  title: 'AutoParts Kenya - Genuine Car Parts & Accessories',
  description:
    'Buy genuine automotive spare parts in Kenya. Fast delivery in Nairobi. Secure M-Pesa payment. Expert mechanics trusted.',
  keywords: [
    'car parts Kenya',
    'auto parts',
    'spares',
    'Nairobi delivery',
    'M-Pesa',
    'vehicle parts',
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AutoParts Kenya',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: [
      {
        url: '/logo-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/logo-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  themeColor: '#1976D2',
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { setDarkMode, isDarkMode } = useAppStore();
  const { user } = useAuthStore();

  // Initialize on mount
  useEffect(() => {
    // Check for system dark mode preference
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setDarkMode(true);
    }

    // Listen for online/offline events
    const handleOnline = () => {
      useAppStore.setState({ isOnline: true });
    };

    const handleOffline = () => {
      useAppStore.setState({ isOnline: false });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setDarkMode]);

  // Register service worker for PWA
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NEXT_PUBLIC_ENABLE_PWA === 'true'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.log('Service Worker registration failed', err));
    }
  }, []);

  return (
    <html
      lang="en"
      className={`${isDarkMode ? 'dark' : ''} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to API */}
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
        />

        {/* Prefetch DNS */}
        <link
          rel="dns-prefetch"
          href={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
        />

        {/* Fonts (already loaded in globals.css via @import) */}

        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AutoParts Kenya" />

        {/* Safe Area (for notched devices) */}
        <meta name="safe-area-inset-top" content="20" />
        <meta name="safe-area-inset-bottom" content="20" />

        {/* No Zoom */}
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
        />

        {/* Color scheme */}
        <meta name="color-scheme" content="light dark" />

        {/* Theme color */}
        <meta name="theme-color" content="#1976D2" />

        {/* Social meta tags */}
        <meta property="og:title" content="AutoParts Kenya" />
        <meta
          property="og:description"
          content="Buy genuine automotive spare parts in Kenya. Fast Nairobi delivery."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Trust & SEO */}
        <meta name="author" content="AutoParts Kenya" />
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="7 days" />
      </head>

      <body className="overflow-x-hidden bg-road-grey-100 font-open-sans text-road-grey-900">
        {/* App Container */}
        <div id="app-root" className="relative flex min-h-screen flex-col">
          {/* Skip to content link for accessibility */}
          <a href="#main-content" className="sr-only focus:not-sr-only">
            Skip to main content
          </a>

          {/* TopAppBar */}
          <TopAppBar />

          {/* SideDrawer (owner only) */}
          <SideDrawer />

          {/* Main Content Area - with left margin for desktop sidebar */}
          <main
            id="main-content"
            className="flex-1 w-full md:ml-20"
            role="main"
          >
            {children}
          </main>

          {/* BottomNav (mobile only) */}
          <BottomNav />
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#424242',
              borderRadius: '8px',
              boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
            },
            success: {
              style: {
                background: '#E8F5E9',
                color: '#388E3C',
              },
            },
            error: {
              style: {
                background: '#FFEBEE',
                color: '#D32F2F',
              },
            },
          }}
        />

        {/* Offline Indicator (optional) */}
        {typeof window !== 'undefined' && !navigator.onLine && (
          <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-auto md:w-96 bg-warning-orange text-white p-3 rounded-t-lg md:rounded-lg text-sm font-semibold text-center md:text-left z-40">
            📶 You are offline. Some features may be limited.
          </div>
        )}
      </body>
    </html>
  );
};

export default RootLayout;
