'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types/models';
import { cn } from '@/lib/utils';

interface RelatedProductsCarouselProps {
  products: Product[];
  title?: string;
  className?: string;
}

export default function RelatedProductsCarousel({
  products,
  title = 'Related Products',
  className,
}: RelatedProductsCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 320; // 2 products width + gap

    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });

    setScrollPosition(newPosition);
  };

  if (!products || products.length === 0) {
    return null;
  }

  const canScrollRight =
    scrollContainerRef.current &&
    scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-road-grey-900">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={scrollPosition === 0}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-road-grey-100 hover:bg-road-grey-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-road-grey-700" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-road-grey-100 hover:bg-road-grey-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-road-grey-700" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4"
        role="region"
        aria-label={title}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-64 snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}
