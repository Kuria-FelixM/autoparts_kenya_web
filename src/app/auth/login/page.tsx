'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { useAuthStore } from '@/stores/authStore';
import { apiMethods, handleApiError } from '@/lib/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { setUser, setTokens } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      const response = await apiMethods.login({
        username: email,
        password,
      });

      const data = (response as any)?.data || response;
      setUser(data.user);
      setTokens({
        access: data.access,
        refresh: data.refresh,
      });

      toast.success('Logged in successfully!');
      router.push(redirect);
    } catch (err) {
      const errorMsg = handleApiError(err as any);
      setError(errorMsg || 'Login failed. Please try again.');
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mechanic-blue/10 to-road-grey-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-12 w-12 rounded-full bg-mechanic-blue flex items-center justify-center text-white font-bold text-lg">
                AP
              </div>
            </div>
            <h1 className="text-3xl font-bold text-road-grey-900">Log In</h1>
            <p className="text-road-grey-600">Welcome back to AutoParts Kenya</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-reliable-red/20 rounded-lg p-4">
              <p className="text-sm text-reliable-red">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-road-grey-900 mb-2">
                Email or Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-road-grey-300 rounded-lg focus:border-mechanic-blue focus:outline-none focus:ring-1 focus:ring-mechanic-blue transition-colors"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-road-grey-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-road-grey-300 rounded-lg focus:border-mechanic-blue focus:outline-none focus:ring-1 focus:ring-mechanic-blue transition-colors"
                disabled={isLoading}
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              type="submit"
              isLoading={isLoading}
            >
              Log In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-road-grey-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-road-grey-600">Don't have an account?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link href="/auth/register" className="block">
            <Button variant="secondary" size="lg" fullWidth>
              Create Account
            </Button>
          </Link>

          {/* Guest Checkout */}
          <div className="text-center space-y-3">
            <p className="text-sm text-road-grey-600">Or continue shopping</p>
            <Link href="/" className="block">
              <Button variant="ghost" size="md" fullWidth>
                Continue as Guest
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-road-grey-600">
            <p>By logging in, you agree to our</p>
            <div className="flex gap-2 justify-center mt-2">
              <Link href="/terms" className="text-mechanic-blue hover:underline">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/privacy" className="text-mechanic-blue hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </Card>

        {/* Trust Badges */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-road-grey-600">
            <span>✓</span>
            <span>Secure M-Pesa</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-road-grey-600">
            <span>✓</span>
            <span>Genuine Parts Guaranteed</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Loading login..." />}>
      <LoginPageContent />
    </Suspense>
  );
}
