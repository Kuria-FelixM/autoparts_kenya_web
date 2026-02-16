'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Wrench,
  Zap,
  Droplet,
  Gauge,
  Shield,
  Lightbulb,
  Package,
  Wind,
} from 'lucide-react';
import { apiMethods, handleApiError } from '@/lib/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import Card from '@/components/common/Card';
import { Category } from '@/types/models';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Engine Parts': <Wrench className="h-8 w-8" />,
  Brakes: <Shield className="h-8 w-8" />,
  'Tires & Wheels': <Gauge className="h-8 w-8" />,
  Suspension: <Wind className="h-8 w-8" />,
  Batteries: <Zap className="h-8 w-8" />,
  'Oils & Fluids': <Droplet className="h-8 w-8" />,
  Electronics: <Lightbulb className="h-8 w-8" />,
  Accessories: <Package className="h-8 w-8" />,
};

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await apiMethods.getCategories();
      setCategories(response.data);
    } catch (error) {
      handleApiError(error as any);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToCategory = (categoryId: string | number) => {
    router.push(`/search?category=${categoryId}`);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading categories..." />;
  }

  if (categories.length === 0) {
    return (
      <div className="min-h-screen pb-20 md:pb-0 p-4">
        <EmptyState
          type="no-results"
          title="No categories available"
          description="Please check back later"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-road-grey-100 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-mechanic-blue to-mechanic-blue/80 text-white p-6 sticky top-0 z-10">
        <h1 className="text-2xl md:text-3xl font-bold">Shop by Category</h1>
        <p className="text-blue-100 mt-2 text-sm md:text-base">
          Find the exact parts you need for your vehicle
        </p>
      </div>

      {/* Categories Grid */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigateToCategory(category.id)}
              className="group"
            >
              <Card
                variant="elevated"
                hoverable
                className="h-full flex flex-col items-center justify-center p-6 text-center space-y-3 transition-all duration-300"
              >
                <div className="text-mechanic-blue group-hover:text-reliable-red transition-colors">
                  {CATEGORY_ICONS[category.name] || <Wrench className="h-8 w-8" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-road-grey-900 group-hover:text-mechanic-blue transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  {category.products_count && (
                    <p className="text-xs text-road-grey-500 mt-1">
                      {category.products_count}{' '}
                      {category.products_count === 1 ? 'product' : 'products'}
                    </p>
                  )}
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {/* Browse by Vehicle CTA */}
      <div className="bg-white p-6 md:p-8 mt-8 mx-4 md:mx-6 rounded-lg border border-road-grey-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-road-grey-900 mb-2">
              Can't find what you need?
            </h2>
            <p className="text-road-grey-600">
              Use our vehicle selector to find parts specifically for your car model
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 bg-mechanic-blue text-white rounded-lg font-bold hover:bg-mechanic-blue/90 transition-colors whitespace-nowrap"
          >
            Browse by Vehicle
          </Link>
        </div>
      </div>
    </div>
  );
}
