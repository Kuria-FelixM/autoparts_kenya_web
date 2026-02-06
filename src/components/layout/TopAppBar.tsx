'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useAppStore } from '@/stores/appStore';
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Settings,
  BarChart3,
  LogIn,
} from 'lucide-react';

/**
 * TopAppBar Component
 * Header with logo, search, cart, notifications, user menu
 * Sticky on desktop, fixed on mobile
 */
const TopAppBar: React.FC = () => {
  const { user, logout, isOwner } = useAuthStore();
  const { mobileMenuOpen, toggleMobileMenu } = useAppStore();
  const { getCartCount } = useCartStore();
  const { getFavoriteCount } = useFavoritesStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cartCount = getCartCount();
  const favoriteCount = getFavoriteCount();

  const handleLogout = useCallback(() => {
    logout();
    setShowUserMenu(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, [logout]);

  return (
    <>
      {/* Main Header */}
      <header
        className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-road-grey-300 md:border-0 md:shadow-md"
        role="banner"
      >
        <div className="container-app h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
            aria-label="AutoParts Kenya Home"
          >
            {/* Logo Icon */}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-mechanic-blue to-reliable-red rounded-lg flex items-center justify-center text-white font-montserrat font-bold text-lg">
              AP
            </div>
            {/* Brand Text - Hidden on mobile */}
            <div className="hidden sm:block">
              <h1 className="text-h4 md:text-h3 font-montserrat font-bold text-mechanic-blue">
                AutoParts
              </h1>
              <p className="text-body-sm text-road-grey-500">Kenya</p>
            </div>
          </Link>

          {/* Search Bar - Desktop only */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <Link
              href="/search"
              className="w-full flex items-center gap-2 px-3 py-2 bg-road-grey-100 rounded-lg hover:bg-road-grey-200 transition-colors group"
            >
              <Search className="w-5 h-5 text-road-grey-500 group-hover:text-mechanic-blue transition-colors" />
              <span className="text-body-sm text-road-grey-500 group-hover:text-road-grey-700">
                Search parts...
              </span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Button - Mobile only */}
            <Link
              href="/search"
              className="md:hidden p-2 hover:bg-road-grey-100 rounded-lg transition-colors touch-target"
              aria-label="Search"
            >
              <Search className="w-6 h-6 text-road-grey-900" />
            </Link>

            {/* Favorites */}
            <Link
              href="/profile#favorites"
              className="relative p-2 hover:bg-road-grey-100 rounded-lg transition-colors touch-target group hidden sm:flex items-center"
              aria-label={`Favorites (${favoriteCount})`}
            >
              <Heart className="w-6 h-6 text-road-grey-900 group-hover:text-reliable-red transition-colors" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-reliable-red text-white text-badge font-montserrat font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favoriteCount > 9 ? '9+' : favoriteCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-road-grey-100 rounded-lg transition-colors touch-target group"
              aria-label={`Shopping cart (${cartCount} items)`}
            >
              <ShoppingCart className="w-6 h-6 text-road-grey-900 group-hover:text-mechanic-blue transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-reliable-red text-white text-badge font-montserrat font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 hover:bg-road-grey-100 rounded-lg transition-colors touch-target group"
                aria-label="User menu"
                aria-expanded={showUserMenu}
              >
                {user?.profile?.avatar_url ? (
                  <img
                    src={user.profile.avatar_url}
                    alt={user.username}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User className="w-6 h-6 text-road-grey-900 group-hover:text-mechanic-blue transition-colors" />
                )}
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-road-grey-300 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-road-grey-300">
                        <p className="text-body-sm font-semibold text-road-grey-900">
                          {user.first_name || user.username}
                        </p>
                        <p className="text-body-sm text-road-grey-500">{user.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-road-grey-100 transition-colors text-road-grey-900 text-body-sm"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-5 h-5" />
                        Profile
                      </Link>

                      {isOwner && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-road-grey-100 transition-colors text-road-grey-900 text-body-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <BarChart3 className="w-5 h-5" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-road-grey-100 transition-colors text-road-grey-900 text-body-sm border-t border-road-grey-300"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-5 h-5" />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-road-grey-100 transition-colors text-reliable-red text-body-sm border-t border-road-grey-300"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-road-grey-100 transition-colors text-road-grey-900 text-body-sm"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </Link>

                      <Link
                        href="/auth/register"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-road-grey-100 transition-colors text-mechanic-blue text-body-sm border-t border-road-grey-300 font-semibold"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-5 h-5" />
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-road-grey-100 rounded-lg transition-colors touch-target"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-road-grey-900" />
              ) : (
                <Menu className="w-6 h-6 text-road-grey-900" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="md:hidden sticky top-16 z-30 bg-white border-b border-road-grey-300 p-4 shadow-sm">
        <Link
          href="/search"
          className="w-full flex items-center gap-2 px-3 py-2.5 bg-road-grey-100 rounded-lg hover:bg-road-grey-200 transition-colors group"
        >
          <Search className="w-5 h-5 text-road-grey-500 group-hover:text-mechanic-blue transition-colors" />
          <span className="text-body-md text-road-grey-500 group-hover:text-road-grey-700">
            Search parts...
          </span>
        </Link>
      </div>
    </>
  );
};

export default TopAppBar;
