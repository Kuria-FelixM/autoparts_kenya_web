'use client';

import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';
import { formatKsh } from '@/lib/formatting';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Card from '@/components/common/Card';
import { toast } from 'react-hot-toast';

interface DeliveryOption {
  id: string;
  label: string;
  value: number;
  days: string;
  description: string;
}

const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'economy',
    label: 'Economy',
    value: 500,
    days: '5-7 days',
    description: 'Standard delivery',
  },
  {
    id: 'standard',
    label: 'Standard',
    value: 1500,
    days: '2-3 days',
    description: 'Recommended',
  },
  {
    id: 'express',
    label: 'Express',
    value: 3000,
    days: 'Nairobi 1-2 days',
    description: 'Fastest',
  },
];

function CartItem({
  id,
  product_name,
  sku,
  unit_price,
  quantity,
  primary_image,
  onRemove,
  onUpdateQuantity,
}: any) {
  const lineTotal = unit_price * quantity;

  return (
    <Card className="flex gap-4 p-4">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-road-grey-100 rounded-lg overflow-hidden">
        {primary_image && (
          <Image
            src={primary_image}
            alt={product_name}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-road-grey-900 truncate hover:text-mechanic-blue transition-colors">
          <Link href={`/product/${id}`}>{product_name}</Link>
        </h3>
        <p className="text-sm text-road-grey-600 mt-1">SKU: {sku}</p>
        <p className="text-lg font-bold text-reliable-red mt-2">{formatKsh(unit_price)}</p>
      </div>

      {/* Quantity and Remove */}
      <div className="flex flex-col gap-3 items-end">
        {/* Quantity Stepper */}
        <div className="flex items-center gap-2 border border-road-grey-300 rounded-lg p-1">
          <button
            onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
            className="p-1 hover:bg-road-grey-100 rounded transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4 text-road-grey-600" />
          </button>
          <span className="px-3 py-1 font-semibold text-road-grey-900">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(quantity + 1)}
            className="p-1 hover:bg-road-grey-100 rounded transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4 text-road-grey-600" />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => {
            onRemove();
            toast.success('Removed from cart');
          }}
          className="p-2 text-road-grey-600 hover:text-reliable-red hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Remove item"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Line Total */}
      <div className="text-right">
        <p className="text-xs text-road-grey-600 mb-2">Subtotal</p>
        <p className="text-xl font-bold text-road-grey-900">{formatKsh(lineTotal)}</p>
      </div>
    </Card>
  );
}

export default function CartPage() {
  const { items, subtotal, total, delivery, setDelivery, removeItem, updateQuantity, clearCart } =
    useCartStore();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption | null>(
    delivery ? DELIVERY_OPTIONS.find((d) => d.id === delivery) || null : null
  );
  const [promoCode, setPromoCode] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen pb-20 md:pb-0 p-4 bg-road-grey-100">
        <div className="max-w-4xl mx-auto">
          <EmptyState
            type="empty-cart"
            title="Your cart is empty"
            description="Start shopping to add items to your cart"
            action={{
              label: 'Continue Shopping',
              href: '/search',
            }}
          />
        </div>
      </div>
    );
  }

  const deliveryFee = selectedDelivery?.value || 0;
  const finalTotal = subtotal + deliveryFee;

  const handleDeliveryChange = (option: DeliveryOption) => {
    setSelectedDelivery(option);
    setDelivery(option.id);
  };

  return (
    <div className="min-h-screen bg-road-grey-100 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-road-grey-900">Shopping Cart</h1>
          <p className="text-road-grey-600 mt-2">{items.length} items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {/* Items List */}
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem
                  key={item.product_id}
                  {...item}
                  onRemove={() => removeItem(item.product_id)}
                  onUpdateQuantity={(qty: number) => updateQuantity(item.product_id, qty)}
                />
              ))}
            </div>

            {/* Promo Code */}
            <Card className="p-4">
              <h3 className="font-bold text-road-grey-900 mb-3">Have a promo code?</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2 border border-road-grey-300 rounded-lg focus:border-mechanic-blue focus:outline-none"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (promoCode) {
                      toast.error('Promo codes not yet supported');
                    }
                  }}
                >
                  Apply
                </Button>
              </div>
            </Card>

            {/* Clear Cart */}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your cart?')) {
                  clearCart();
                  toast.success('Cart cleared');
                }
              }}
              className="text-road-grey-600 hover:text-reliable-red text-sm font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Delivery Options */}
            <Card className="p-4 space-y-3">
              <h3 className="font-bold text-road-grey-900">Delivery Method</h3>
              {DELIVERY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleDeliveryChange(option)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedDelivery?.id === option.id
                      ? 'border-mechanic-blue bg-mechanic-blue/5'
                      : 'border-road-grey-300 hover:border-mechanic-blue'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-road-grey-900">{option.label}</p>
                      <p className="text-xs text-road-grey-600 mt-1">{option.days}</p>
                      <p className="text-xs text-road-grey-500">{option.description}</p>
                    </div>
                    <p className="font-bold text-mechanic-blue">{formatKsh(option.value)}</p>
                  </div>
                </button>
              ))}
            </Card>

            {/* Summary Card */}
            <Card className="p-4 space-y-3 bg-road-grey-50">
              <div className="space-y-3">
                <div className="flex justify-between text-road-grey-600">
                  <span>Subtotal:</span>
                  <span>{formatKsh(subtotal)}</span>
                </div>
                <div className="flex justify-between text-road-grey-600">
                  <span>Delivery:</span>
                  <span>{formatKsh(deliveryFee)}</span>
                </div>
                <div className="border-t border-road-grey-300 pt-3 flex justify-between text-lg font-bold text-road-grey-900">
                  <span>Total:</span>
                  <span className="text-reliable-red">{formatKsh(finalTotal)}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <Link href="/checkout" className="block mt-4">
                <Button variant="primary" fullWidth size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Continue Shopping */}
              <Link href="/search" className="block">
                <Button variant="ghost" fullWidth size="md">
                  Continue Shopping
                </Button>
              </Link>
            </Card>

            {/* Trust Badges */}
            <div className="bg-white rounded-lg p-4 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-trust-gold text-lg">✓</span>
                <div>
                  <p className="font-semibold text-road-grey-900">Genuine Parts</p>
                  <p className="text-road-grey-600 text-xs">100% authentic</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success-green text-lg">✓</span>
                <div>
                  <p className="font-semibold text-road-grey-900">Secure M-Pesa</p>
                  <p className="text-road-grey-600 text-xs">Safe payments</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-mechanic-blue text-lg">✓</span>
                <div>
                  <p className="font-semibold text-road-grey-900">Fast Delivery</p>
                  <p className="text-road-grey-600 text-xs">Nairobi 1-2 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
