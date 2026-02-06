'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import {
  Home,
  Search,
  ShoppingCart,
  User,
  Grid,
} from 'lucide-react';

/**
 * BottomNav Component
 * Mobile-first bottom navigation (48px touch targets)
 * Only visible on mobile (< md breakpoint)
 */
const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { getCartCount } = useCartStore();

  const cartCount = getCartCount();

  // Don't show on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  // Don't show on admin pages
  if (pathname?.startsWith('/admin/')) {
    return null;
  }

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      active: pathname === '/',
    },
    {
      label: 'Search',
      href: '/search',
      icon: Search,
      active: pathname === '/search',
    },
    {
      label: 'Categories',
      href: '/categories',
      icon: Grid,
      active: pathname === '/categories',
    },
    {
      label: 'Cart',
      href: '/cart',
      icon: ShoppingCart,
      active: pathname === '/cart',
      badge: cartCount > 0 ? cartCount : null,
    },
    {
      label: user ? 'Profile' : 'Sign In',
      href: user ? '/profile' : '/auth/login',
      icon: User,
      active: pathname === '/profile' || pathname === '/auth/login',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-road-grey-300 safe-area-bottom"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around items-stretch h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 padding-0 transition-colors relative group ${
                item.active ? 'text-mechanic-blue' : 'text-road-grey-700 hover:text-mechanic-blue'
              }`}
              aria-current={item.active ? 'page' : undefined}
              title={item.label}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-reliable-red text-white text-badge font-montserrat font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-body-sm font-montserrat font-semibold">{item.label}</span>
              {item.active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-mechanic-blue rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
