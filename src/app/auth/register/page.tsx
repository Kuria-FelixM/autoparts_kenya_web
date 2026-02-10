'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { useAuthStore } from '@/stores/authStore';
import { apiMethods, handleApiError } from '@/lib/api';
import { isValidPhoneNumber, normalizePhoneNumber } from '@/lib/formatting';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();

  const [step, setStep] = useState<'details' | 'phone' | 'password' | 'vehicles'>(
    'details'
  );
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 'details') {
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.last_name) newErrors.last_name = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
    } else if (step === 'phone') {
      if (!formData.phone) newErrors.phone = 'Phone is required';
      if (!isValidPhoneNumber(formData.phone)) {
        newErrors.phone = 'Invalid Kenyan phone number (0722123456)';
      }
    } else if (step === 'password') {
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.password_confirm) {
        newErrors.password_confirm = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      const nextSteps: Record<string, typeof step> = {
        details: 'phone',
        phone: 'password',
        password: 'vehicles',
      };
      setStep(nextSteps[step] || 'vehicles');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsLoading(true);

    try {
      const registrationData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.email,
        email: formData.email,
        phone_number: normalizePhoneNumber(formData.phone),
        password: formData.password,
        password_confirm: formData.password,
      };

      const response = await apiMethods.register(registrationData);

      const data = (response as any)?.data || response;
      setUser(data.user);
      setTokens({
        access: data.access,
        refresh: data.refresh,
      });

      toast.success('Account created successfully!');
      router.push('/profile');
    } catch (err) {
      const errorMsg = handleApiError(err as any);
      toast.error(errorMsg || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const progressSteps = {
    details: 1,
    phone: 2,
    password: 3,
    vehicles: 4,
  };

  const currentProgress = progressSteps[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mechanic-blue/10 to-road-grey-100 flex items-center justify-center p-4 py-12">
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
            <h1 className="text-3xl font-bold text-road-grey-900">Create Account</h1>
            <p className="text-road-grey-600">
              {step === 'details' && 'Tell us about yourself'}
              {step === 'phone' && 'How can we reach you?'}
              {step === 'password' && 'Secure your account'}
              {step === 'vehicles' && 'Add your vehicles (optional)'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentProgress ? 'bg-mechanic-blue' : 'bg-road-grey-300'
                }`}
              ></div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={step === 'vehicles' ? handleRegister : (e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
            {/* Step 1: Details */}
            {step === 'details' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-bold text-road-grey-900 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.first_name
                        ? 'border-reliable-red focus:ring-reliable-red'
                        : 'border-road-grey-300 focus:border-mechanic-blue focus:ring-mechanic-blue'
                    } transition-colors`}
                    disabled={isLoading}
                  />
                  {errors.first_name && (
                    <p className="text-xs text-reliable-red mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-road-grey-900 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.last_name
                        ? 'border-reliable-red focus:ring-reliable-red'
                        : 'border-road-grey-300 focus:border-mechanic-blue focus:ring-mechanic-blue'
                    } transition-colors`}
                    disabled={isLoading}
                  />
                  {errors.last_name && (
                    <p className="text-xs text-reliable-red mt-1">{errors.last_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-road-grey-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.email
                        ? 'border-reliable-red focus:ring-reliable-red'
                        : 'border-road-grey-300 focus:border-mechanic-blue focus:ring-mechanic-blue'
                    } transition-colors`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-xs text-reliable-red mt-1">{errors.email}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Phone */}
            {step === 'phone' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-bold text-road-grey-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0722123456"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.phone
                        ? 'border-reliable-red focus:ring-reliable-red'
                        : 'border-road-grey-300 focus:border-mechanic-blue focus:ring-mechanic-blue'
                    } transition-colors`}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-road-grey-600 mt-2">Kenyan format: 0722123456</p>
                  {errors.phone && (
                    <p className="text-xs text-reliable-red mt-1">{errors.phone}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Password */}
            {step === 'password' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-bold text-road-grey-900 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.password
                        ? 'border-reliable-red focus:ring-reliable-red'
                        : 'border-road-grey-300 focus:border-mechanic-blue focus:ring-mechanic-blue'
                    } transition-colors`}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-road-grey-600 mt-2">At least 8 characters</p>
                  {errors.password && (
                    <p className="text-xs text-reliable-red mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-road-grey-900 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.password_confirm
                        ? 'border-reliable-red focus:ring-reliable-red'
                        : 'border-road-grey-300 focus:border-mechanic-blue focus:ring-mechanic-blue'
                    } transition-colors`}
                    disabled={isLoading}
                  />
                  {errors.password_confirm && (
                    <p className="text-xs text-reliable-red mt-1">{errors.password_confirm}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Vehicles (Optional) */}
            {step === 'vehicles' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="bg-road-grey-50 border border-road-grey-300 rounded-lg p-4 text-center">
                  <p className="text-road-grey-900 mb-2">Add your vehicles later in your profile</p>
                  <p className="text-sm text-road-grey-600">
                    This helps us recommend products specifically for your cars
                  </p>
                </div>
              </motion.div>
            )}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              type="submit"
              isLoading={isLoading}
            >
              {step === 'vehicles' ? 'Create Account' : 'Next'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-road-grey-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-road-grey-600">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link href="/auth/login" className="block">
            <Button variant="secondary" size="lg" fullWidth>
              Log In
            </Button>
          </Link>

          {/* Footer */}
          <div className="text-center text-xs text-road-grey-600">
            <p>By creating an account, you agree to our</p>
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
      </motion.div>
    </div>
  );
}
