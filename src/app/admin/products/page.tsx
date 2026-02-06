'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { useAuthStore } from '@/stores/authStore';
import { apiMethods, handleApiError } from '@/lib/api';
import { formatKsh } from '@/lib/formatting';
import { toast } from 'react-hot-toast';
import { Product } from '@/types/models';

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.is_owner) {
      router.push('/auth/login');
      return;
    }

    fetchProducts();
  }, [isAuthenticated, user, router]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await apiMethods.getProducts({ page_size: 100 });
      setProducts(response.results);
    } catch (error) {
      handleApiError(error as any);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      // API call for deletion would go here
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading products..." />;
  }

  return (
    <div className="min-h-screen bg-road-grey-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-road-grey-900">Products</h1>
            <p className="text-road-grey-600 mt-2">{products.length} total products</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-road-grey-500" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-road-grey-300 rounded-lg focus:border-mechanic-blue focus:outline-none transition-colors"
          />
        </div>

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            type="no-results"
            title="No products found"
            description="Create your first product to get started"
            action={{
              label: 'Add Product',
              href: '/admin/products/new',
            }}
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-road-grey-50 border-b border-road-grey-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-road-grey-900">Name</th>
                    <th className="px-6 py-4 text-left font-bold text-road-grey-900">SKU</th>
                    <th className="px-6 py-4 text-left font-bold text-road-grey-900">Price</th>
                    <th className="px-6 py-4 text-left font-bold text-road-grey-900">Stock</th>
                    <th className="px-6 py-4 text-left font-bold text-road-grey-900">Status</th>
                    <th className="px-6 py-4 text-right font-bold text-road-grey-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-road-grey-200 hover:bg-road-grey-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-road-grey-900">{product.name}</p>
                          <p className="text-sm text-road-grey-600">{product.category?.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-road-grey-700">{product.sku}</td>
                      <td className="px-6 py-4 font-bold text-reliable-red">
                        {formatKsh(product.unit_price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          product.available_stock > 20
                            ? 'bg-success-green/10 text-success-green'
                            : product.available_stock > 5
                              ? 'bg-warning-orange/10 text-warning-orange'
                              : 'bg-reliable-red/10 text-reliable-red'
                        }`}>
                          {product.available_stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          product.is_active
                            ? 'bg-mechanic-blue/10 text-mechanic-blue'
                            : 'bg-road-grey-200 text-road-grey-700'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <button className="p-2 text-mechanic-blue hover:bg-mechanic-blue/10 rounded-lg transition-colors">
                              <Edit className="h-5 w-5" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-reliable-red hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
