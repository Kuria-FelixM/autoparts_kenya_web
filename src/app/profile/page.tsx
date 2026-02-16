'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Settings, Heart, Truck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuthStore } from '@/stores/authStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { apiMethods, handleApiError } from '@/lib/api';
import { formatKsh, formatDate } from '@/lib/formatting';
import { toast } from 'react-hot-toast';
import { Order } from '@/types/models';

type TabType = 'orders' | 'favorites' | 'vehicles' | 'settings';

const TABS = [
  { id: 'orders', label: 'Orders', icon: Truck },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'vehicles', label: 'Vehicles', icon: Zap },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get('tab') as TabType) || 'orders'
  );

  const { user, logout, isAuthenticated } = useAuthStore();
  const { favorites } = useFavoritesStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Fetch orders
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiMethods.getOrders();
      setOrders(response.data);
    } catch (error) {
      handleApiError(error as any);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      toast.success('Logged out successfully');
      router.push('/');
    }
  };

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen message="Redirecting..." />;
  }

  return (
    <div className="min-h-screen bg-road-grey-100 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-mechanic-blue to-mechanic-blue/80 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{user?.first_name || 'User'}</h1>
              <p className="text-blue-100 mt-1">{user?.email}</p>
            </div>
            <div className="text-right text-sm">
              {user?.profile?.is_owner && (
                <span className="inline-block px-3 py-1 bg-trust-gold text-road-grey-900 rounded-full font-bold mb-2 block">
                  Store Owner
                </span>
              )}
              <Link href="/admin/dashboard" className="block text-blue-100 hover:text-white transition-colors">
                View Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto">
        <div className="sticky top-0 z-20 bg-white border-b border-road-grey-200">
          <div className="flex overflow-x-auto px-4 -mx-4">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-mechanic-blue text-mechanic-blue'
                      : 'border-transparent text-road-grey-600 hover:text-road-grey-900'
                  }`}
                >
                  <TabIcon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {isLoading ? (
                  <LoadingSpinner message="Loading orders..." />
                ) : orders.length === 0 ? (
                  <EmptyState
                    type="no-orders"
                    title="No orders yet"
                    description="Start shopping to place your first order"
                    action={{
                      label: 'Shop Now',
                      href: '/search',
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} hoverable className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div>
                            <p className="text-xs text-road-grey-600 font-bold mb-1">ORDER NUMBER</p>
                            <p className="font-bold text-road-grey-900">{order.order_number}</p>
                          </div>
                          <div>
                            <p className="text-xs text-road-grey-600 font-bold mb-1">DATE</p>
                            <p className="font-semibold text-road-grey-900">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-road-grey-600 font-bold mb-1">TOTAL</p>
                            <p className="font-bold text-reliable-red">{formatKsh(order.total_amount)}</p>
                          </div>
                          <div className="flex items-end justify-between md:justify-start gap-2">
                            <div>
                              <p className="text-xs text-road-grey-600 font-bold mb-1">STATUS</p>
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-success-green/10 text-success-green">
                                {order.order_status || 'pending'}
                              </span>
                            </div>
                            <Link href={`/orders/${order.id}`}>
                              <Button size="sm" variant="secondary">
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {favorites.length === 0 ? (
                  <EmptyState
                    type="no-favorites"
                    title="No favorites yet"
                    description="Save your favorite parts for quick access later"
                    action={{
                      label: 'Browse Products',
                      href: '/search',
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favorites.map((fav) => (
                      <Link key={fav.id} href={`/product/${fav.id}`}>
                        <Card className="group cursor-pointer h-full p-4">
                          <div className="space-y-2">
                            <h3 className="font-bold text-sm text-road-grey-900 group-hover:text-mechanic-blue transition-colors line-clamp-2">
                              {fav.name}
                            </h3>
                            <p className="text-xs font-mono text-road-grey-600">{fav.sku}</p>
                            <p className="font-bold text-reliable-red">
                              {formatKsh(fav.price)}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Vehicles Tab */}
            {activeTab === 'vehicles' && (
              <motion.div
                key="vehicles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-road-grey-900">My Vehicles</h2>
                  <Button size="sm">Add Vehicle</Button>
                </div>

                <div className="grid gap-4">
                  {user?.profile?.saved_vehicles && user.profile.saved_vehicles.length > 0 ? (
                    user.profile.saved_vehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-road-grey-900">
                                {vehicle.make_name || (vehicle as any).make?.name || 'Unknown'} {vehicle.model_name || (vehicle as any).model?.name || 'Unknown'}{' '}
                              {vehicle.year}
                            </h3>
                            <p className="text-sm text-road-grey-600 mt-1">
                                {(vehicle as any).notes || vehicle.nickname || 'No notes'}
                            </p>
                          </div>
                          <button className="text-mechanic-blue hover:text-mechanic-blue/80 transition-colors p-2">
                            ✎
                          </button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <EmptyState
                      type="custom"
                      icon="🚗"
                      title="No vehicles added"
                      description="Add your vehicles to get personalized product recommendations"
                      action={{
                        label: 'Add Vehicle',
                        onClick: () => {},
                      }}
                    />
                  )}
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 max-w-2xl"
              >
                <div>
                  <h2 className="text-2xl font-bold text-road-grey-900 mb-6">Account Settings</h2>

                  {/* Profile Info */}
                  <Card className="p-6 mb-6 space-y-4">
                    <h3 className="font-bold text-road-grey-900">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-road-grey-600 font-bold mb-2">First Name</p>
                        <p className="text-road-grey-900">{user?.first_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-road-grey-600 font-bold mb-2">Last Name</p>
                        <p className="text-road-grey-900">{user?.last_name}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-road-grey-600 font-bold mb-2">Email</p>
                        <p className="text-road-grey-900">{user?.email}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary">
                      Edit Profile
                    </Button>
                  </Card>

                  {/* Security */}
                  <Card className="p-6 mb-6 space-y-4">
                    <h3 className="font-bold text-road-grey-900">Security</h3>
                    <p className="text-sm text-road-grey-600">
                      Manage your password and account security
                    </p>
                    <Button size="sm" variant="secondary">
                      Change Password
                    </Button>
                  </Card>

                  {/* Preferences */}
                  <Card className="p-6 mb-6 space-y-4">
                    <h3 className="font-bold text-road-grey-900">Preferences</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-mechanic-blue" />
                      <span className="text-road-grey-900">Enable notifications</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-mechanic-blue" />
                      <span className="text-road-grey-900">Marketing emails</span>
                    </label>
                  </Card>

                  {/* Logout */}
                  <Button
                    variant="danger"
                    fullWidth
                    size="lg"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Loading profile..." />}>
      <ProfilePageContent />
    </Suspense>
  );
}
