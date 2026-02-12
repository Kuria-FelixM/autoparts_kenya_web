'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import {
  X,
  BarChart3,
  Package,
  Truck,
  ShoppingCart,
  Zap,
  Settings,
  LogOut,
} from 'lucide-react';

/**
 * SideDrawer Component
 * Owner-only admin navigation sidebar (desktop only)
 * Collapses on mobile
 */
const SideDrawer: React.FC = () => {
  const { isOwner, logout } = useAuthStore();
  const { sideDrawerOpen, setSideDrawerOpen } = useAppStore();
  const [expanded, setExpanded] = useState(true);

  // Only render for owners
  if (!isOwner) {
    return null;
  }

  const adminMenu = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: BarChart3,
      description: 'Metrics & Analytics',
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: Package,
      description: 'Manage inventory',
    },
    {
      label: 'Inventory',
      href: '/admin/inventory',
      icon: Zap,
      description: 'Stock alerts',
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      description: 'All orders',
    },
    {
      label: 'Vehicles',
      href: '/admin/vehicles',
      icon: Truck,
      description: 'Make/Model',
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-road-grey-200 shadow-xl transition-all duration-300 ${
          expanded ? 'w-64' : 'w-20'
        } z-40`}
        role="navigation"
        aria-label="Admin navigation"
      >
        {/* Header */}
        <div className="p-4 border-b border-road-grey-300 flex items-center justify-between">
          {expanded && (
            <h3 className="text-h4 font-montserrat font-bold text-mechanic-blue">
              Owner Panel
            </h3>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-road-grey-100 rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            {expanded ? (
              <X className="w-5 h-5 text-road-grey-900" />
            ) : (
              <Package className="w-5 h-5 text-mechanic-blue" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg hover:bg-mechanic-blue/10 transition-colors text-road-grey-900 hover:text-mechanic-blue group mb-2"
              >
                <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                {expanded && (
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md font-semibold truncate">{item.label}</p>
                    <p className="text-body-sm text-road-grey-500 truncate">
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings & Logout */}
        <div className="border-t border-road-grey-300 p-4 space-y-2">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-road-grey-100 transition-colors text-road-grey-900 hover:text-mechanic-blue"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {expanded && <span className="text-body-md font-semibold">Settings</span>}
          </Link>

          <button
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-reliable-red/10 transition-colors text-road-grey-900 hover:text-reliable-red"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {expanded && <span className="text-body-md font-semibold">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {sideDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSideDrawerOpen(false)}
          role="dialog"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 md:hidden flex flex-col ${
          sideDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Mobile admin navigation"
      >
        {/* Header */}
        <div className="p-4 border-b border-road-grey-300 flex items-center justify-between">
          <h3 className="text-h4 font-montserrat font-bold text-mechanic-blue">
            Owner Panel
          </h3>
          <button
            onClick={() => setSideDrawerOpen(false)}
            className="p-1 hover:bg-road-grey-100 rounded transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5 text-road-grey-900" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSideDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg hover:bg-mechanic-blue/10 transition-colors text-road-grey-900 hover:text-mechanic-blue group mb-2"
              >
                <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-semibold truncate">{item.label}</p>
                  <p className="text-body-sm text-road-grey-500 truncate">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Settings & Logout */}
        <div className="border-t border-road-grey-300 p-4 space-y-2">
          <Link
            href="/profile"
            onClick={() => setSideDrawerOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-road-grey-100 transition-colors text-road-grey-900 hover:text-mechanic-blue"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="text-body-md font-semibold">Settings</span>
          </Link>

          <button
            onClick={() => {
              logout();
              setSideDrawerOpen(false);
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-reliable-red/10 transition-colors text-road-grey-900 hover:text-reliable-red"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-body-md font-semibold">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
