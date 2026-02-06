'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, ShoppingCart, Package, TrendingUp, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!user?.is_owner) {
      router.push('/');
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, user, router]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading admin dashboard..." />;
  }

  if (!user?.is_owner) {
    return (
      <div className="min-h-screen bg-road-grey-100 p-4 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-road-grey-900 mb-4">You don't have access to the admin panel</p>
          <Link href="/">
            <Button variant="primary" fullWidth>
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Mock stats
  const stats = [
    {
      label: 'Total Revenue',
      value: 'KSh 1,250,000',
      icon: TrendingUp,
      change: '+12% from last month',
    },
    {
      label: 'Pending Orders',
      value: '12',
      icon: ShoppingCart,
      change: '3 need attention',
    },
    {
      label: 'Products',
      value: '245',
      icon: Package,
      change: '8 low stock',
    },
    {
      label: 'Sales This Month',
      value: '1,847',
      icon: BarChart3,
      change: '142 more than last month',
    },
  ];

  const adminLinks = [
    { href: '/admin/products', label: 'Products', desc: 'Manage your inventory', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', desc: 'View and process orders', icon: '📋' },
    { href: '/admin/inventory', label: 'Inventory', desc: 'Stock management', icon: '📊' },
    { href: '/admin/analytics', label: 'Analytics', desc: 'Sales and revenue', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-road-grey-100">
      {/* Admin Header */}
      <div className="bg-mechanic-blue text-white p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Store Admin</h1>
              <p className="text-blue-100 mt-1">Welcome back, {user?.first_name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats Grid */}
        <div>
          <h2 className="text-2xl font-bold text-road-grey-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-road-grey-600">{stat.label}</p>
                    <Icon className="h-5 w-5 text-mechanic-blue" />
                  </div>
                  <p className="text-3xl font-bold text-road-grey-900">{stat.value}</p>
                  <p className="text-xs text-road-grey-500">{stat.change}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-road-grey-900">Management</h2>
            <Link href="/admin/products/new">
              <Button size="sm">+ Add Product</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card hoverable className="p-6 h-full cursor-pointer group">
                  <div className="space-y-3">
                    <p className="text-4xl">{link.icon}</p>
                    <div>
                      <h3 className="font-bold text-road-grey-900 group-hover:text-mechanic-blue transition-colors">
                        {link.label}
                      </h3>
                      <p className="text-sm text-road-grey-600">{link.desc}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders Preview */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-road-grey-900">Recent Orders</h2>
            <Link href="/admin/orders">
              <Button size="sm" variant="secondary">
                View All
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-road-grey-300">
                  <th className="text-left py-3 px-4 font-bold text-road-grey-900">Order #</th>
                  <th className="text-left py-3 px-4 font-bold text-road-grey-900">Customer</th>
                  <th className="text-left py-3 px-4 font-bold text-road-grey-900">Amount</th>
                  <th className="text-left py-3 px-4 font-bold text-road-grey-900">Status</th>
                  <th className="text-left py-3 px-4 font-bold text-road-grey-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 'ORD-001',
                    customer: 'John Mwangi',
                    amount: 'KSh 15,500',
                    status: 'shipped',
                    date: '2 hours ago',
                  },
                  {
                    id: 'ORD-002',
                    customer: 'Sarah Kipchoge',
                    amount: 'KSh 8,900',
                    status: 'processing',
                    date: '5 hours ago',
                  },
                  {
                    id: 'ORD-003',
                    customer: 'Peter Njoroge',
                    amount: 'KSh 22,300',
                    status: 'confirmed',
                    date: '1 day ago',
                  },
                ].map((order) => (
                  <tr key={order.id} className="border-b border-road-grey-200 hover:bg-road-grey-50">
                    <td className="py-3 px-4 font-mono font-bold">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4 font-bold text-reliable-red">{order.amount}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-mechanic-blue/10 text-mechanic-blue">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-road-grey-600">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card className="p-6 space-y-4 border-l-4 border-reliable-red">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <h3 className="font-bold text-lg text-road-grey-900">Low Stock Alert</h3>
          </div>
          <p className="text-road-grey-600">
            You have 8 products with low stock. Consider reordering soon to avoid stockouts.
          </p>
          <Link href="/admin/inventory">
            <Button size="sm">View Low Stock Items</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
