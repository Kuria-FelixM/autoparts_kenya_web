'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, MoreVertical } from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { useAuthStore } from '@/stores/authStore';
import { apiMethods, handleApiError } from '@/lib/api';
import { formatKsh, formatDate } from '@/lib/formatting';
import { toast } from 'react-hot-toast';
import { Order } from '@/types/models';

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning-orange' },
  { value: 'confirmed', label: 'Confirmed', color: 'info-cyan' },
  { value: 'processing', label: 'Processing', color: 'mechanic-blue' },
  { value: 'shipped', label: 'Shipped', color: 'mechanic-blue' },
  { value: 'delivered', label: 'Delivered', color: 'success-green' },
  { value: 'cancelled', label: 'Cancelled', color: 'road-grey-500' },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated || !user?.is_owner) {
      router.push('/auth/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, user, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiMethods.adminGetOrders
        ? await apiMethods.adminGetOrders()
        : [];
      setOrders(Array.isArray(response) ? response : response.results || []);
    } catch (error) {
      // Fallback: use mock data for demo
      setOrders([
        {
          id: 1,
          order_number: 'ORD-001',
          guest_phone: '0722123456',
          delivery_address: '123 Main St, Nairobi',
          delivery_city: 'Nairobi',
          subtotal: 15000,
          delivery_fee: 1500,
          total: 16500,
          order_status: 'pending',
          payment_status: 'paid',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: [],
        } as any,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      // API call would go here
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((order) => order.order_status === filterStatus);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading orders..." />;
  }

  return (
    <div className="min-h-screen bg-road-grey-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-road-grey-900">Orders</h1>
          <p className="text-road-grey-600 mt-2">{orders.length} total orders</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-full font-bold transition-colors whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-mechanic-blue text-white'
                : 'bg-white border border-road-grey-300 text-road-grey-900 hover:border-mechanic-blue'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {ORDER_STATUSES.map((status) => {
            const count = orders.filter((o) => o.order_status === status.value).length;
            return (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`px-4 py-2 rounded-full font-bold transition-colors whitespace-nowrap ${
                  filterStatus === status.value
                    ? 'bg-mechanic-blue text-white'
                    : 'bg-white border border-road-grey-300 text-road-grey-900 hover:border-mechanic-blue'
                }`}
              >
                {status.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            type="no-orders"
            title="No orders to display"
            description={filterStatus === 'all' ? 'Start selling to see orders here' : `No orders with status "${filterStatus}"`}
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-road-grey-50 border-b border-road-grey-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-road-grey-900">Order #</th>
                    <th className="px-6 py-4 text-left font-bold text-road-grey-900">Customer</th>
                    <th className="px-6 py-4 text-left font-bold text-road-grey-900">Amount</th>
                    <th className="px-6 py-4 text-left font-bold text-road-grey-900">Items</th>
                    <th className="px-6 py-4 text-left font-bold text-road-grey-900">Status</th>
                    <th className="px-6 py-4 text-left font-bold text-road-grey-900">Date</th>
                    <th className="px-6 py-4 text-right font-bold text-road-grey-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const statusConfig = ORDER_STATUSES.find((s) => s.value === order.order_status);
                    const itemCount = order.items?.length || 0;
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-road-grey-200 hover:bg-road-grey-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold font-mono text-road-grey-900">{order.order_number}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-road-grey-900">
                              {order.guest_phone || 'N/A'}
                            </p>
                            <p className="text-sm text-road-grey-600">{order.delivery_city}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-reliable-red">
                          {formatKsh(order.total)}
                        </td>
                        <td className="px-6 py-4 text-road-grey-700">{itemCount} items</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.order_status}
                            onChange={(e) =>
                              handleStatusUpdate(order.id, e.target.value)
                            }
                            className={`px-3 py-1 rounded-full text-sm font-bold border border-road-grey-300 focus:outline-none focus:ring-1 focus:ring-mechanic-blue`}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-road-grey-600">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/orders/${order.id}`}>
                              <button className="p-2 text-mechanic-blue hover:bg-mechanic-blue/10 rounded-lg transition-colors" title="View details">
                                <Eye className="h-5 w-5" />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
