'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, TrendingUp } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useCartStore } from '@/stores/cartStore';
import { formatKsh, formatRating, calculateDiscountedPrice } from '@/lib/formatting';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';
import toast from 'react-hot-toast';
import { Product } from '@/types/models';

/**
 * ProductCard Component
 * Displays product in grid with image, price, rating, badges
 * Supports favorites toggle and add-to-cart quick action
 * Accepts either a Product object or individual props for backward compatibility
 */

interface ProductCardProps {
  id?: number;
  name?: string;
  sku?: string;
  price?: number;
  unit_price?: number;
  discountPercentage?: number;
  discount_percentage?: number;
  cost_price?: number;
  stock?: number;
  available_stock?: number;
  reserved_stock?: number;
  primaryImage?: string;
  primary_image?: string;
  rating?: number;
  average_rating?: number;
  reviewCount?: number;
  review_count?: number;
  isFeatured?: boolean;
  is_featured?: boolean;
  isActive?: boolean;
  is_active?: boolean;
  category?: string | { name: string };
  category_id?: number;
  onAddToCart?: (productId: number, quantity: number) => void;
  // Allow spreading the full Product type
  [key: string]: any;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  // Handle both Product type and individual props
  const {
    id = props.id,
    name = props.name,
    sku = props.sku,
    price = props.price || props.unit_price,
    discountPercentage = props.discountPercentage || props.discount_percentage || 0,
    cost_price = props.cost_price,
    stock = props.stock || props.available_stock || 0,
    reserved_stock = props.reserved_stock || 0,
    primaryImage = props.primaryImage || props.primary_image,
    rating = props.rating || props.average_rating,
    reviewCount = props.reviewCount || props.review_count,
    isFeatured = props.isFeatured || props.is_featured || false,
    isActive = props.is_active !== undefined ? props.is_active : (props.isActive !== undefined ? props.isActive : true),
    category = props.category,
    onAddToCart = props.onAddToCart,
  } = props;
  const { addFavorite, removeFavorite, isFavorited } = useFavoritesStore();
  const { addItem } = useCartStore();
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);

  // Handle category as string or object
  const categoryName = typeof category === 'string' ? category : category?.name;

  const isFav = isFavorited(id!);
  const discountedPrice = calculateDiscountedPrice(price || 0, discountPercentage);
  const availableStock = Math.max(0, (stock || 0) - (reserved_stock || 0));
  const isInStock = availableStock > 0 && isActive;

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFavorite(id!);
      toast.success('Removed from favorites');
    } else {
      addFavorite({
        id: id!,
        name: name!,
        sku: sku!,
        price: price!,
        discount_percentage: discountPercentage,
        primary_image: primaryImage,
        category: categoryName,
      });
      toast.success('Added to favorites');
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addItem({
        id: id!,
        product_id: id!,
        product_name: name!,
        sku: sku!,
        unit_price: discountedPrice > 0 ? discountedPrice : (price || 0),
        quantity: 1,
        primary_image: primaryImage,
      });

      toast.success('Added to cart! 🛒');

      if (onAddToCart) {
        onAddToCart(id!, 1);
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card
      variant="default"
      className="group flex flex-col h-full overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Product Link */}
      <Link
        href={`/product/${id}`}
        className="flex-1 flex flex-col h-full"
      >
        {/* Image Container */}
        <div className="relative bg-road-grey-100 overflow-hidden pt-[100%] sm:pt-[120%]">
          {primaryImage && (
            <Image
              src={primaryImage}
              alt={name}
              fill
              className="object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
            />
          )}

          {/* Overlay Badges */}
          <div className="absolute inset-0 bg-gradient-fade-bottom opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Stock Badge */}
          <div className="absolute top-2 right-2">
            {!isInStock ? (
              <Badge
                type="custom"
                label="Out of Stock"
                customColor="#D32F2F"
                customBgColor="rgba(211, 47, 47, 0.9)"
                size="sm"
              />
            ) : availableStock <= 3 ? (
              <Badge
                type="custom"
                label="Low Stock"
                customColor="#F57F17"
                customBgColor="rgba(245, 127, 23, 0.9)"
                size="sm"
              />
            ) : null}
          </div>

          {/* Featured Star */}
          {isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge
                type="featured"
                label="Featured"
                size="sm"
              />
            </div>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute bottom-2 left-2 bg-reliable-red text-white px-2 py-1 rounded font-montserrat font-bold text-body-sm">
              -{discountPercentage}%
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleToggleFavorite();
            }}
            className={`absolute top-2 left-2 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFav
                ? 'bg-reliable-red text-white'
                : 'bg-white/80 text-road-grey-900 hover:bg-white'
            }`}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-2 p-3 sm:p-4">
          {/* Category */}
          {categoryName && (
            <p className="text-body-sm text-road-grey-500 capitalize">{categoryName}</p>
          )}

          {/* Name */}
          <h3 className="text-h4 font-montserrat font-bold text-road-grey-900 truncate-2 group-hover:text-mechanic-blue transition-colors">
            {name}
          </h3>

          {/* SKU */}
          <p className="text-body-sm text-road-grey-500 font-mono uppercase">{sku}</p>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(rating)
                        ? 'fill-trust-gold text-trust-gold'
                        : 'text-road-grey-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-body-sm font-semibold text-road-grey-700">
                {formatRating(rating)}
              </span>
              {reviewCount && (
                <span className="text-body-sm text-road-grey-500">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-h4 font-montserrat font-bold text-reliable-red">
              {formatKsh(discountedPrice > 0 ? discountedPrice : price)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-body-sm text-road-grey-500 line-through">
                {formatKsh(price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-road-grey-200">
        <Button
          variant={isInStock ? 'primary' : 'ghost'}
          size="md"
          fullWidth
          disabled={!isInStock}
          isLoading={isAddingToCart}
          onClick={handleAddToCart}
        >
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
