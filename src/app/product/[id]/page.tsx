'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, Star, Zap, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductGallery from '@/components/product/ProductGallery';
import CompatibilityTable from '@/components/product/CompatibilityTable';
import RelatedProductsCarousel from '@/components/product/RelatedProductsCarousel';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { apiMethods, handleApiError } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { formatKsh } from '@/lib/formatting';
import { toast } from 'react-hot-toast';
import { Product, ProductImage } from '@/types/models';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCartStore();
  const { isFavorited, toggleFavorite } = useFavoritesStore();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const data = await apiMethods.getProductDetail(productId);
      setProduct(data);

      // Fetch related products (same category)
      if (data.category_id) {
        try {
          const related = await apiMethods.getProducts({
            category: data.category_id,
            page_size: 8,
          });
          setRelatedProducts(related.results.filter((p) => p.id !== data.id).slice(0, 5));
        } catch {
          // Silently fail for related products
        }
      }
    } catch (error) {
      handleApiError(error as any);
      toast.error('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      addItem({
        id: product.id,
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        unit_price: product.discounted_price > 0 ? product.discounted_price : product.unit_price,
        quantity: 1,
        primary_image: product.primary_image,
      });
      toast.success('Added to cart! 🛒');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product.id);
    toast.success(
      isFavorited(product.id) ? 'Removed from favorites' : 'Added to favorites ❤️'
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen pb-20 md:pb-0 p-4">
        <EmptyState
          type="error"
          title="Product not found"
          description="The product you're looking for doesn't exist or has been removed."
          action={{
            label: 'Back to Shopping',
            href: '/search',
          }}
        />
      </div>
    );
  }

  const images = product.images?.map((img: ProductImage) => img.image) || [product.primary_image];
  const discountPercentage = product.discounted_price > 0
    ? Math.round(((product.unit_price - product.discounted_price) / product.unit_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-road-grey-100 pb-20 md:pb-8">
      {/* Product Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        {/* Images and Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg p-4 md:p-6">
          {/* Gallery */}
          <ProductGallery images={images} alt={product.name} />

          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title and Badges */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-road-grey-900">
                    {product.name}
                  </h1>
                  <p className="text-sm text-road-grey-600 mt-1">SKU: {product.sku}</p>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className="flex-shrink-0 p-3 rounded-full hover:bg-road-grey-100 transition-colors"
                  aria-label={isFavorited(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    className={`h-6 w-6 transition-colors ${
                      isFavorited(product.id)
                        ? 'fill-reliable-red text-reliable-red'
                        : 'text-road-grey-400 hover:text-reliable-red'
                    }`}
                  />
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.is_featured && <Badge type="featured" />}
                {product.available_stock > 10 && <Badge type="stock" />}
                {product.available_stock > 0 && product.available_stock <= 10 && (
                  <Badge type="stock" customColor="warning-orange" />
                )}
                {product.available_stock === 0 && (
                  <Badge type="custom" label="Out of Stock" customColor="road-grey-500" />
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-2 pb-4 border-b border-road-grey-200">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-reliable-red">
                  {formatKsh(product.discounted_price > 0 ? product.discounted_price : product.unit_price)}
                </span>
                {product.discounted_price > 0 && (
                  <>
                    <span className="text-lg text-road-grey-500 line-through">
                      {formatKsh(product.unit_price)}
                    </span>
                    <Badge
                      type="custom"
                      label={`-${discountPercentage}%`}
                      customColor="reliable-red"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Stock & Delivery Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-road-grey-50 rounded-lg">
                <p className="text-xs text-road-grey-600 font-semibold mb-1">STOCK STATUS</p>
                <p className="font-bold text-road-grey-900">
                  {product.available_stock > 0 ? `${product.available_stock} units` : 'Out of Stock'}
                </p>
              </div>
              <div className="p-3 bg-road-grey-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="h-4 w-4 text-mechanic-blue" />
                  <p className="text-xs text-road-grey-600 font-semibold">DELIVERY</p>
                </div>
                <p className="font-bold text-road-grey-900">Nairobi 1-2 days</p>
              </div>
            </div>

            {/* Rating */}
            {product.average_rating && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.average_rating!)
                          ? 'fill-trust-gold text-trust-gold'
                          : 'text-road-grey-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-road-grey-600">
                  {product.average_rating.toFixed(1)} ({product.review_count || 0} reviews)
                </span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                isLoading={isAddingToCart}
                disabled={product.available_stock === 0}
              >
                {product.available_stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Link href="/cart" className="block">
                <Button variant="secondary" size="lg" fullWidth>
                  Buy Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Compatibility Table */}
        {product.compatible_vehicles && product.compatible_vehicles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-4 md:p-6"
          >
            <CompatibilityTable vehicles={product.compatible_vehicles} />
          </motion.div>
        )}

        {/* Description and Specs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Description */}
          <div className="md:col-span-2 bg-white rounded-lg p-4 md:p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-road-grey-900 mb-3">Description</h2>
              <p className="text-road-grey-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>

          {/* Specs Sidebar */}
          <div className="bg-white rounded-lg p-4 md:p-6 space-y-4 h-fit">
            <h3 className="font-bold text-road-grey-900">Product Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-road-grey-600 mb-1">CATEGORY</p>
                <p className="text-road-grey-900">{product.category?.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-road-grey-600 mb-1">SKU</p>
                <p className="text-road-grey-900 font-mono">{product.sku}</p>
              </div>
              {product.weight && (
                <div>
                  <p className="text-xs font-semibold text-road-grey-600 mb-1">WEIGHT</p>
                  <p className="text-road-grey-900">{product.weight} kg</p>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <p className="text-xs font-semibold text-road-grey-600 mb-1">DIMENSIONS</p>
                  <p className="text-road-grey-900">{product.dimensions}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-4 md:p-6"
          >
            <RelatedProductsCarousel products={relatedProducts} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
