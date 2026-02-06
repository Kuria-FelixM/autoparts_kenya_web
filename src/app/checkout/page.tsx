'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { apiMethods, handleApiError } from '@/lib/api';
import { formatKsh, normalizePhoneNumber, isValidPhoneNumber } from '@/lib/formatting';
import { toast } from 'react-hot-toast';

type CheckoutStep = 'choice' | 'guest-form' | 'login' | 'address' | 'payment' | 'success';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, delivery, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState<CheckoutStep>(
    isAuthenticated ? 'address' : 'choice'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Guest info
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Address info
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Nairobi');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  // Payment
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const deliveryFee = delivery ? 1500 : 0; // Default to standard
  const total = subtotal + deliveryFee;

  const handleChoiceSelect = (choice: 'guest' | 'login') => {
    if (choice === 'guest') {
      setStep('guest-form');
    } else {
      setStep('login');
    }
  };

  const handleGuestFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail || !guestPhone) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!isValidPhoneNumber(guestPhone)) {
      toast.error('Invalid phone number');
      return;
    }
    setStep('address');
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress || !recipientName || !recipientPhone) {
      toast.error('Please fill in all address fields');
      return;
    }
    if (!isValidPhoneNumber(recipientPhone)) {
      toast.error('Invalid phone number');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaPhone) {
      toast.error('Please enter M-Pesa phone number');
      return;
    }
    if (!isValidPhoneNumber(mpesaPhone)) {
      toast.error('Invalid phone number');
      return;
    }

    setPaymentStatus('processing');
    setIsLoading(true);

    try {
      // Create order
      const checkoutData = {
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        guest_email: guestEmail || user?.email,
        guest_phone: normalizePhoneNumber(guestPhone || recipientPhone),
        delivery_address: deliveryAddress,
        delivery_city: deliveryCity,
        delivery_method: delivery || 'standard',
        subtotal,
        delivery_fee: deliveryFee,
        total,
      };

      const orderResponse = await apiMethods.checkout(checkoutData);
      
      // Initiate STK Push
      const stkResponse = await apiMethods.initiateSTKPush({
        phone_number: normalizePhoneNumber(mpesaPhone),
        amount: Math.round(total),
      });

      setOrderNumber(orderResponse.order_number || 'ORD-' + Date.now());
      setPaymentStatus('success');
      setStep('success');
      clearCart();
      
      toast.success('Order placed successfully!');
    } catch (error) {
      setPaymentStatus('error');
      handleApiError(error as any);
      toast.error('Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  // Show success screen
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-success-green to-success-green/50 pb-20 md:pb-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className='max-w-md w-full'
        >
          <Card className="text-center p-8 space-y-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <CheckCircle className="h-20 w-20 text-success-green mx-auto" />
            </motion.div>

            <div>
              <h1 className="text-3xl font-bold text-road-grey-900 mb-2">Order Confirmed!</h1>
              <p className="text-road-grey-600">Thank you for your purchase</p>
            </div>

            <div className="bg-road-grey-50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-road-grey-600">Order Number</p>
              <p className="text-2xl font-bold text-road-grey-900 font-mono">{orderNumber}</p>
            </div>

            <div className="space-y-2 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-road-grey-600">Items:</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-road-grey-600">Total Paid:</span>
                <span className="font-semibold">{formatKsh(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-road-grey-600">Delivery:</span>
                <span className="font-semibold">Nairobi 1-2 Days</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-mechanic-blue/20 rounded-lg p-4">
              <p className="text-sm text-road-grey-700">
                <strong>What's next?</strong> You'll receive a confirmation message shortly with tracking details.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Link href="/" className="block">
                <Button variant="primary" fullWidth size="lg">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/profile?tab=orders" className="block">
                <Button variant="secondary" fullWidth size="lg">
                  View Orders
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main checkout flow
  return (
    <div className="min-h-screen bg-road-grey-100 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-mechanic-blue hover:text-mechanic-blue/80 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {/* Guest or Login Choice */}
              {step === 'choice' && (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h1 className="text-3xl font-bold text-road-grey-900">Check Out</h1>
                  <p className="text-road-grey-600 mb-6">
                    No account needed - checkout fast. Create one later to track orders & save vehicles.
                  </p>

                  <div className="space-y-4">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={() => handleChoiceSelect('guest')}
                    >
                      Continue as Guest
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-road-grey-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-road-grey-100 text-road-grey-600">Or</span>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="lg"
                      fullWidth
                      onClick={() => handleChoiceSelect('login')}
                    >
                      Log In / Create Account
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Guest Form */}
              {step === 'guest-form' && (
                <motion.form
                  key="guest-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleGuestFormSubmit}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-road-grey-900">Your Contact Info</h2>

                  <Card className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-road-grey-900 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-road-grey-300 rounded-lg focus:border-mechanic-blue focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-road-grey-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="0722123456"
                        className="w-full px-4 py-3 border border-road-grey-300 rounded-lg focus:border-mechanic-blue focus:outline-none"
                        required
                      />
                      <p className="text-xs text-road-grey-600 mt-2">Kenyan format: 0722123456</p>
                    </div>
                  </Card>

                  <Button variant="primary" size="lg" fullWidth type="submit">
                    Continue
                  </Button>
                </motion.form>
              )}

              {/* Address Form */}
              {step === 'address' && (
                <motion.form
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleAddressSubmit}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-road-grey-900">Delivery Address</h2>

                  <Card className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-road-grey-900 mb-2">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-4 py-3 border border-road-grey-300 rounded-lg focus:border-mechanic-blue focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-road-grey-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        placeholder="0722123456"
                        className="w-full px-4 py-3 border border-road-grey-300 rounded-lg focus:border-mechanic-blue focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-road-grey-900 mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Street address, building name, apartment number, etc."
                        className="w-full px-4 py-3 border border-road-grey-300 rounded-lg focus:border-mechanic-blue focus:outline-none resize-none"
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-road-grey-900 mb-2">
                        City
                      </label>
                      <select
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        className="w-full px-4 py-3 border border-road-grey-300 rounded-lg focus:border-mechanic-blue focus:outline-none"
                      >
                        <option value="Nairobi">Nairobi</option>
                        <option value="Mombasa">Mombasa</option>
                        <option value="Kisumu">Kisumu</option>
                        <option value="Eldoret">Eldoret</option>
                        <option value="Nakuru">Nakuru</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </Card>

                  <Button variant="primary" size="lg" fullWidth type="submit">
                    Continue to Payment
                  </Button>
                </motion.form>
              )}

              {/* Payment Form */}
              {step === 'payment' && (
                <motion.form
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handlePaymentSubmit}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-road-grey-900">Payment</h2>

                  {paymentStatus === 'error' && (
                    <div className="bg-red-50 border border-reliable-red/20 rounded-lg p-4 flex gap-4">
                      <AlertCircle className="h-5 w-5 text-reliable-red flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-reliable-red">Payment Failed</p>
                        <p className="text-sm text-road-grey-600 mt-1">
                          Please check your M-Pesa balance and try again
                        </p>
                      </div>
                    </div>
                  )}

                  <Card className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-road-grey-900 mb-4">M-Pesa Payment</h3>
                      <label className="block text-sm font-bold text-road-grey-900 mb-2">
                        M-Pesa Phone Number
                      </label>
                      <input
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="0722123456"
                        className="w-full px-4 py-3 border border-road-grey-300 rounded-lg focus:border-mechanic-blue focus:outline-none"
                        required
                        disabled={isLoading}
                      />
                      <p className="text-xs text-road-grey-600 mt-2">
                        You'll receive an M-Pesa prompt to enter your PIN
                      </p>
                    </div>
                  </Card>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    type="submit"
                    isLoading={isLoading}
                    disabled={paymentStatus === 'processing'}
                  >
                    {paymentStatus === 'processing' ? 'Processing...' : `Pay ${formatKsh(total)}`}
                  </Button>
                </motion.form>
              )}

              {/* Login Prompt */}
              {step === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center py-12"
                >
                  <p className="text-road-grey-600 mb-6">
                    Login to your account or create a new one
                  </p>
                  <Link href="/auth/login?redirect=/checkout" className="block mb-4">
                    <Button variant="primary" size="lg" fullWidth>
                      Go to Login
                    </Button>
                  </Link>
                  <button
                    onClick={() => setStep('choice')}
                    className="text-mechanic-blue hover:text-mechanic-blue/80 font-semibold transition-colors"
                  >
                    Prefer to continue as guest?
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="h-fit">
            <Card className="p-6 space-y-4 sticky top-6">
              <h3 className="font-bold text-lg text-road-grey-900">Order Summary</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span className="text-road-grey-600">{item.product_name} x{item.quantity}</span>
                    <span className="font-semibold">{formatKsh(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-road-grey-200 pt-4 space-y-2">
                <div className="flex justify-between text-road-grey-600">
                  <span>Subtotal</span>
                  <span>{formatKsh(subtotal)}</span>
                </div>
                <div className="flex justify-between text-road-grey-600">
                  <span>Delivery</span>
                  <span>{formatKsh(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-road-grey-900">
                  <span>Total</span>
                  <span className="text-reliable-red">{formatKsh(total)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
