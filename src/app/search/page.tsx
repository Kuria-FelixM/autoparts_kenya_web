'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import SearchInput from '@/components/search/SearchInput';
import FilterAccordion from '@/components/search/FilterAccordion';
import SortingDropdown from '@/components/search/SortingDropdown';
import ProductCard from '@/components/product/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { apiMethods, handleApiError } from '@/lib/api';
import { PAGINATION } from '@/lib/constants';
import { toast } from 'react-hot-toast';
import { Product as ProductType } from '@/types/models';

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'rating', label: 'Highest Rated' },
];

const STOCK_OPTIONS = [
  { id: 'in-stock', label: 'In Stock' },
  { id: 'low-stock', label: 'Low Stock' },
];

interface FilterOption {
  id: string | number;
  label: string;
  count?: number;
}

interface FilterState {
  search: string;
  makes: (string | number)[];
  categories: (string | number)[];
  priceRange: [number, number];
  stock: (string | number)[];
  sort: string;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('q') || '',
    makes: [],
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    priceRange: [0, 100000],
    stock: [],
    sort: 'newest',
  });

  // Dynamic filter options from API
  const [vehicleMakes, setVehicleMakes] = useState<FilterOption[]>([]);
  const [categoriesOptions, setCategoriesOptions] = useState<FilterOption[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    setIsLoadingFilters(true);
    try {
      // Fetch vehicle makes - axios returns data in response.data
      const makesResponse = await apiMethods.getVehicleMakes();
      const makesData = makesResponse.data.results || makesResponse.data;
      const makes = (Array.isArray(makesData) ? makesData : []).map((make: any) => ({
        id: make.id,
        label: make.name,
        count: make.models_count || 0,
      }));
      setVehicleMakes(makes);

      // Fetch categories - axios returns data in response.data
      const categoriesResponse = await apiMethods.getCategories();
      const categoriesData = categoriesResponse.data.results || categoriesResponse.data;
      const categories = (Array.isArray(categoriesData) ? categoriesData : []).map((category: any) => ({
        id: category.id,
        label: category.name,
        count: category.products_count || 0,
      }));
      setCategoriesOptions(categories);
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    } finally {
      setIsLoadingFilters(false);
    }
  };

  // Fetch products on filter change
  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, true);
  }, [filters.search, filters.makes, filters.categories, filters.priceRange, filters.stock, filters.sort]);

  const fetchProducts = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      if (pageNum === 1 && reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const params: any = {
          page: pageNum,
          page_size: PAGINATION.DEFAULT_PAGE_SIZE,
        };

        // Add search if present
        if (filters.search) {
          params.search = filters.search;
        }

        // Add categories (comma-separated string to match backend)
        if (filters.categories.length > 0) {
          params.categories = filters.categories.join(',');
        }

        // Add vehicle makes if selected
        if (filters.makes.length > 0) {
          // You may need to adjust this based on your API structure
          // For now, sending first make only - adjust if your API supports multiple
          params.vehicle_make = filters.makes[0];
        }

        // Add price range (using min_price/max_price to match backend)
        if (filters.priceRange[0] > 0) {
          params.min_price = filters.priceRange[0];
        }
        if (filters.priceRange[1] < 100000) {
          params.max_price = filters.priceRange[1];
        }

        // Add stock filter
        if (filters.stock.includes('in-stock')) {
          params.in_stock = true;
        }

        // Add ordering
        params.ordering =
          filters.sort === 'price-asc'
            ? 'price'
            : filters.sort === 'price-desc'
              ? '-price'
              : filters.sort === 'rating'
                ? '-rating'
                : filters.sort === 'popular'
                  ? '-review_count'
                  : '-created_at';

        // Axios returns data in response.data
        const response = await apiMethods.getProducts(params);
        const responseData = response.data;

        if (reset) {
          setProducts(responseData.results || []);
        } else {
          setProducts((prev) => [...prev, ...(responseData.results || [])]);
        }

        setHasMore(!!responseData.next);
      } catch (error) {
        const errorMessage = handleApiError(error);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filters]
  );

  // Infinite scroll setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProducts(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, page, fetchProducts]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      makes: [],
      categories: [],
      priceRange: [0, 100000],
      stock: [],
      sort: 'newest',
    });
    setShowMobileFilters(false);
  };

  const activeFiltersCount =
    filters.makes.length +
    filters.categories.length +
    (filters.stock.length > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-road-grey-100 pb-20 md:pb-0">
      {/* Mobile Filters Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-road-grey-200 p-4 md:hidden">
        <div className="flex gap-2">
          <SearchInput
            value={filters.search}
            onChange={(value) => updateFilter('search', value)}
            onSubmit={(value) => updateFilter('search', value)}
            className="flex-1"
          />
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-center h-11 w-11 rounded-lg border border-road-grey-300 hover:border-mechanic-blue text-road-grey-600 hover:text-mechanic-blue transition-colors relative"
            aria-label="Toggle filters"
          >
            {showMobileFilters ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-reliable-red text-white text-xs font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block col-span-1 bg-white rounded-lg border border-road-grey-200 h-fit sticky top-20">
          <div className="p-4 border-b border-road-grey-200">
            <SearchInput
              value={filters.search}
              onChange={(value) => updateFilter('search', value)}
              onSubmit={(value) => updateFilter('search', value)}
              className="w-full"
            />
          </div>

          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {isLoadingFilters ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner message="Loading filters..." />
              </div>
            ) : (
              <>
                {vehicleMakes.length > 0 && (
                  <FilterAccordion
                    title="Vehicle Make"
                    items={vehicleMakes}
                    selected={filters.makes}
                    onSelect={(ids) => updateFilter('makes', ids)}
                  />
                )}

                {categoriesOptions.length > 0 && (
                  <FilterAccordion
                    title="Category"
                    items={categoriesOptions}
                    selected={filters.categories}
                    onSelect={(ids) => updateFilter('categories', ids)}
                    isMultiSelect
                  />
                )}

                <FilterAccordion
                  title="Price Range"
                  items={[]}
                  selected={filters.priceRange}
                  onSelect={(ids) => updateFilter('priceRange', ids as [number, number])}
                  type="range"
                  minValue={0}
                  maxValue={100000}
                  step={5000}
                />

                <FilterAccordion
                  title="Stock Status"
                  items={STOCK_OPTIONS}
                  selected={filters.stock}
                  onSelect={(ids) => updateFilter('stock', ids)}
                />

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-2 px-4 rounded-lg bg-road-grey-100 text-road-grey-900 hover:bg-road-grey-200 text-sm font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 top-24 z-40 bg-white md:hidden overflow-y-auto pb-20">
            <div className="p-4 space-y-4">
              {isLoadingFilters ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner message="Loading filters..." />
                </div>
              ) : (
                <>
                  {vehicleMakes.length > 0 && (
                    <FilterAccordion
                      title="Vehicle Make"
                      items={vehicleMakes}
                      selected={filters.makes}
                      onSelect={(ids) => updateFilter('makes', ids)}
                      isOpen
                    />
                  )}

                  {categoriesOptions.length > 0 && (
                    <FilterAccordion
                      title="Category"
                      items={categoriesOptions}
                      selected={filters.categories}
                      onSelect={(ids) => updateFilter('categories', ids)}
                      isOpen
                    />
                  )}

                  <FilterAccordion
                    title="Price Range"
                    items={[]}
                    selected={filters.priceRange}
                    onSelect={(ids) => updateFilter('priceRange', ids as [number, number])}
                    type="range"
                    minValue={0}
                    maxValue={100000}
                    step={5000}
                    isOpen
                  />

                  <FilterAccordion
                    title="Stock Status"
                    items={STOCK_OPTIONS}
                    selected={filters.stock}
                    onSelect={(ids) => updateFilter('stock', ids)}
                    isOpen
                  />

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="w-full py-2 px-4 rounded-lg bg-road-grey-100 text-road-grey-900 hover:bg-road-grey-200 text-sm font-medium transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          {/* Results Header */}
          <div className="bg-white rounded-lg border border-road-grey-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-road-grey-600">
                {products && products.length > 0
                  ? `Showing ${products.length} results`
                  : 'No products found'}
              </p>
            </div>
            <SortingDropdown
              options={SORT_OPTIONS}
              value={filters.sort}
              onChange={(value) => updateFilter('sort', value)}
              className="hidden sm:block"
            />
          </div>

          {/* Mobile Sort Dropdown */}
          <div className="md:hidden">
            <SortingDropdown
              options={SORT_OPTIONS}
              value={filters.sort}
              onChange={(value) => updateFilter('sort', value)}
              className="w-full"
            />
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <LoadingSpinner fullScreen message="Loading products..." />
          ) : !products || products.length === 0 ? (
            <EmptyState
              type="no-results"
              title="No parts found"
              description="Try adjusting your filters or search term"
              action={{
                label: 'Clear Filters',
                onClick: clearAllFilters,
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              <div ref={observerTarget} className="py-8">
                {isLoadingMore && <LoadingSpinner message="Loading more..." />}
                {!hasMore && products.length > 0 && (
                  <p className="text-center text-road-grey-600 text-sm">
                    You've reached the end
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
