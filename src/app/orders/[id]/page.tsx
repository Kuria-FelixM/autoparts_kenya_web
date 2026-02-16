'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Truck, CheckCircle, Clock } from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { apiMethods, handleApiError } from '@/lib/api';
import { formatKsh, formatDate } from '@/lib/formatting';
import { toast } from 'react-hot-toast';
import { Order } from '@/types/models';

const STATUS_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: 'warning-orange', label: 'Pending Confirmation' },
  confirmed: { icon: CheckCircle, color: 'info-cyan', label: 'Confirmed' },
  processing: { icon: Truck, color: 'mechanic-blue', label: 'Processing' },
  shipped: { icon: Truck, color: 'mechanic-blue', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'success-green', label: 'Delivered' },
  cancelled: { icon: Clock, color: 'road-grey-500', label: 'Cancelled' },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const data = await apiMethods.getOrderDetail(orderId);
      setOrder(data.data);
    } catch (error) {
      handleApiError(error as any);
      toast.error('Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading order..." />;
  }

  if (!order) {
    return (
      <div className="min-h-screen pb-20 md:pb-0 p-4">
        <EmptyState
          type="error"
          title="Order not found"
          description="The order you're looking for doesn't exist"
          action={{
            label: 'Back to Orders',
            href: '/profile?tab=orders',
          }}
        />
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-road-grey-100 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-mechanic-blue hover:text-mechanic-blue/80 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">Back to Orders</span>
        </button>

        {/* Order Status */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-mechanic-blue/5 to-mechanic-blue/10 border-mechanic-blue/20">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-mechanic-blue/20 rounded-full">
                <StatusIcon className="h-6 w-6 text-mechanic-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-road-grey-900">{statusConfig.label}</h1>
                <p className="text-road-grey-600 mt-1">Order {order.order_number}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-road-grey-600 mb-2">Date</p>
              <p className="font-bold text-road-grey-900">{formatDate(order.created_at)}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-road-grey-900">Order Items</h2>
              <div className="space-y-3">
                {order.items && order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-3 border-b border-road-grey-200 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-semibold text-road-grey-900">{item.product_name}</p>
                      <p className="text-sm text-road-grey-600">SKU: {item.sku}</p>
                      <p className="text-sm text-road-grey-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-road-grey-600 text-sm">{formatKsh(item.unit_price)} each</p>
                      <p className="font-bold text-road-grey-900">{formatKsh(item.line_total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Information */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-road-grey-900">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-road-grey-600 font-bold mb-2">DELIVERY ADDRESS</p>
                  <p className="text-road-grey-900">
                    {order.delivery_address}
                  </p>
                  <p className="text-road-grey-900 mt-1">{order.delivery_city}</p>
                </div>
                <div>
                  <p className="text-sm text-road-grey-600 font-bold mb-2">ESTIMATED DELIVERY</p>
                  <p className="text-road-grey-900 font-semibold">Nairobi 1-2 Days</p>
                  {order.updated_at && (
                    <p className="text-sm text-road-grey-600 mt-2">
                      Last updated: {formatDate(order.updated_at)}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-road-grey-900">Payment</h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-success-green"></div>
                <span className="font-semibold text-success-green">{order.payment_status || 'Paid'}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-road-grey-600">
                  <span>M-Pesa Payment</span>
                  <span className="text-success-green font-semibold">✓ Confirmed</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-road-grey-900">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-road-grey-600">
                  <span>Subtotal</span>
                  <span>{formatKsh(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-road-grey-600">
                  <span>Delivery Fee</span>
                  <span>{formatKsh(order.delivery_cost || 0)}</span>
                </div>
                <div className="border-t border-road-grey-200 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-reliable-red">{formatKsh(order.total_amount)}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            {order.order_status !== 'cancelled' && (
              <div className="space-y-3">
                <Link href="/search" className="block">
                  <Button variant="secondary" fullWidth size="md">
                    Continue Shopping
                  </Button>
                </Link>
                <Button variant="ghost" fullWidth size="md">
                  Get Help
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
