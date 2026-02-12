'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useVehicleStore } from '@/stores/vehicleStore';
import { apiMethods, handleApiError } from '@/lib/api';
import { Product, Category, VehicleMake } from '@/types/models';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductCard from '@/components/product/ProductCard';
import EmptyState from '@/components/common/EmptyState';
import { ChevronRight, MapPin, Zap, Shield, Truck, Wrench, Heart, Star } from 'lucide-react';

/**
 * Home Page (/page.tsx)
 * Hero section, vehicle selector, featured products, categories
 */

const HomePage: React.FC = () => {
  const { selectedVehicle, setVehicle } = useVehicleStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load featured products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [featuredRes, categoriesRes] = await Promise.all([
          apiMethods.getFeaturedProducts({ page_size: 8 }),
          apiMethods.getCategories({ page_size: 12 }),
        ]);

        setFeaturedProducts(featuredRes.data.results || []);
        setCategories(categoriesRes.data.results || []);
      } catch (err: any) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-road-grey-100 pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative w-full h-96 md:h-[500px] bg-gradient-header overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />

        <div className="relative h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col justify-center items-center sm:items-start gap-6 z-10 lg:flex-row lg:justify-center lg:items-center lg:gap-16 xl:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg w-full"
          >
            <h1 className="text-h1 md:text-4xl font-montserrat font-bold text-white mb-4 leading-tight text-center sm:text-left">
              Genuine Car Parts In Kenya
            </h1>
            <p className="text-body-lg md:text-h4 text-white/90 mb-6 text-center sm:text-left">
              Quality spares. Fast delivery. Trusted mechanics.
            </p>

            <div className="flex flex-col md:flex-row gap-3 w-full sm:w-auto">
              <Link href="/search" className="w-full md:w-auto">
                <Button variant="primary" size="lg" className="w-full h-auto py-3 px-6 text-base md:text-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <Zap className="w-5 h-5" />
                  Browse Parts
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <button className="w-full md:w-auto px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-montserrat font-semibold rounded-lg hover:bg-white hover:text-mechanic-blue transition-all duration-300 flex items-center justify-center gap-2 group border-2 border-white hover:shadow-lg hover:scale-105">
                <Shield className="w-5 h-5" />
                Learn More
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Hero Icon - Large devices only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center flex-shrink-0"
          >
            <div className="relative">
              {/* Background circles */}
              <div className="absolute inset-0 bg-white/20 rounded-full w-48 h-48 blur-3xl animate-pulse"></div>
              
              {/* Main icon container */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-full w-48 h-48 flex items-center justify-center border border-white/30 hover:border-white/50 transition-all duration-300">
                <Wrench className="w-24 h-24 text-white animate-bounce" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <div className="absolute bottom-4 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 flex gap-3 flex-wrap z-10">
          <Badge
            type="genuine"
            label="100% Genuine"
            size="sm"
            variant="outlined"
          />
          <Badge
            type="secure"
            label="Secure M-Pesa"
            size="sm"
            variant="outlined"
          />
          <Badge
            type="delivery"
            label="Nairobi 1-2 Days"
            size="sm"
            variant="outlined"
          />
        </div>
      </section>

      {/* Vehicle Selector */}
      <section className="py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <h2 className="text-h2 font-montserrat font-bold mb-6 text-road-grey-900">
          {selectedVehicle
            ? `Parts for ${selectedVehicle.make_name} ${selectedVehicle.model_name} (${selectedVehicle.year})`
            : 'Select Your Vehicle'}
        </h2>

        <VehicleSelectorComponent onSelect={setVehicle} />

        {selectedVehicle && (
          <div className="mt-6 flex gap-3">
            <Link href={`/search?make=${selectedVehicle.make_id}&model=${selectedVehicle.model_id}&year=${selectedVehicle.year}`}>
              <Button variant="primary" size="lg">
                View Compatible Parts
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setVehicle(null)}
            >
              Change Vehicle
            </Button>
          </div>
        )}
      </section>

      {/* Features / Why Choose Us */}
      <section className="py-12 md:py-16 bg-white">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
            className="flex flex-col gap-3 text-center"
          >
            <div className="w-16 h-16 mx-auto bg-mechanic-blue/20 rounded-xl flex items-center justify-center">
              <Truck className="w-8 h-8 text-mechanic-blue" />
            </div>
            <h3 className="text-h4 font-montserrat font-bold text-road-grey-900">
              Fast Delivery
            </h3>
            <p className="text-body-md text-road-grey-700">
              Same-day & next-day delivery across Nairobi & beyond
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-3 text-center"
          >
            <div className="w-16 h-16 mx-auto bg-success-green/20 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-success-green" />
            </div>
            <h3 className="text-h4 font-montserrat font-bold text-road-grey-900">
              100% Genuine
            </h3>
            <p className="text-body-md text-road-grey-700">
              All parts authenticated. Trusted by mechanics nationwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-3 text-center"
          >
            <div className="w-16 h-16 mx-auto bg-trust-gold/20 rounded-xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-trust-gold" />
            </div>
            <h3 className="text-h4 font-montserrat font-bold text-road-grey-900">
              Secure Payment
            </h3>
            <p className="text-body-md text-road-grey-700">
              Safe M-Pesa transactions with buyer protection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-h2 font-montserrat font-bold text-road-grey-900">
            ⭐ Featured Products
          </h2>
          <Link
            href="/search?featured=true"
            className="text-mechanic-blue font-semibold hover:underline flex items-center gap-2"
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading featured products..." />
        ) : error ? (
          <EmptyState
            type="error"
            title="Failed to load products"
            description={error}
            action={{
              label: 'Try Again',
              onClick: () => window.location.reload(),
            }}
          />
        ) : featuredProducts.length === 0 ? (
          <EmptyState
            type="no-results"
            title="No featured products yet"
            description="Check back soon for handpicked selections"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  sku={product.sku}
                  price={product.price}
                  discountPercentage={product.discount_percentage}
                  stock={product.stock}
                  reserved_stock={product.reserved_stock}
                  primaryImage={product.primary_image}
                  rating={product.rating}
                  reviewCount={product.review_count}
                  isFeatured={product.is_featured}
                  category={product.category?.name}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <h2 className="text-h2 font-montserrat font-bold mb-8 text-road-grey-900">
            Shop by Category
          </h2>

          {categories.length === 0 ? (
            <EmptyState
              type="custom"
              title="No categories available"
              description="Check back soon"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/search?category=${category.id}`}
                  className="group"
                >
                  <div className="bg-road-grey-100 rounded-xl p-6 hover:bg-mechanic-blue/10 transition-colors text-center cursor-pointer">
                    {category.icon_url && (
                      <div className="mb-3 flex justify-center">
                        <img
                          src={category.icon_url}
                          alt={category.name}
                          className="w-12 h-12 group-hover:scale-110 transition-transform"
                        />
                      </div>
                    )}
                    <h3 className="text-h4 font-montserrat font-bold text-road-grey-900 group-hover:text-mechanic-blue transition-colors">
                      {category.name}
                    </h3>
                    {category.products_count && (
                      <p className="text-body-sm text-road-grey-500 mt-2">
                        {category.products_count} items
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="bg-gradient-to-r from-mechanic-blue to-reliable-red rounded-2xl p-8 md:p-16 text-white text-center">
          <h2 className="text-h2 md:text-4xl font-montserrat font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-body-lg mb-8 max-w-xl mx-auto">
            Search our complete catalog or contact us for custom part orders.
          </p>
          <div className="flex gap-3 justify-center flex-col md:flex-row">
            <Link href="/search">
              <Button variant="secondary" size="lg" className="border-white text-white w-full md:w-auto">
                Advanced Search
              </Button>
            </Link>
            <a href="https://wa.me/254701000000" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" className="w-full md:w-auto">
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * Vehicle Selector Sub-component
 */
interface VehicleSelectorComponentProps {
  onSelect: (vehicle: any) => void;
}

const VehicleSelectorComponent: React.FC<VehicleSelectorComponentProps> = ({
  onSelect,
}) => {
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [selectedMake, setSelectedMake] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setLoading(true);
        const res = await apiMethods.getVehicleMakes({ page_size: 50 });
        setMakes(res.data.results || []);
      } catch (err) {
        console.error('Failed to load vehicle makes');
      } finally {
        setLoading(false);
      }
    };

    fetchMakes();
  }, []);

  if (loading) {
    return <LoadingSpinner size="sm" message="Loading vehicles..." />;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {makes.map((make) => (
          <button
            key={make.id}
            onClick={() => setSelectedMake(selectedMake === make.id ? null : make.id)}
            className={`p-4 rounded-lg border-2 transition-all text-center cursor-pointer ${
              selectedMake === make.id
                ? 'border-mechanic-blue bg-mechanic-blue/10'
                : 'border-road-grey-300 hover:border-mechanic-blue'
            }`}
          >
            <p className="font-montserrat font-bold text-road-grey-900">{make.name}</p>
            {make.models_count && (
              <p className="text-body-sm text-road-grey-500">{make.models_count} models</p>
            )}
          </button>
        ))}
      </div>

      {selectedMake && (
        <ModelYearSelector
          makeId={selectedMake}
          makeName={makes.find((m) => m.id === selectedMake)?.name || ''}
          onSelect={onSelect}
        />
      )}
    </div>
  );
};

/**
 * Model & Year Selector Sub-component
 */
interface ModelYearSelectorProps {
  makeId: number;
  makeName: string;
  onSelect: (vehicle: any) => void;
}

const ModelYearSelector: React.FC<ModelYearSelectorProps> = ({
  makeId,
  makeName,
  onSelect,
}) => {
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const res = await apiMethods.getVehicleModels({
          make: makeId,
          page_size: 50,
        });
        setModels(res.data.results || []);
      } catch (err) {
        console.error('Failed to load vehicle models');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [makeId]);

  // Extract unique years from selected model
  useEffect(() => {
    if (selectedModel) {
      const model = models.find((m) => m.id === selectedModel);
      if (model) {
        const yearArray = [];
        for (let i = model.year_from; i <= model.year_to; i++) {
          yearArray.push(i);
        }
        setYears(yearArray.sort((a, b) => b - a));
      }
    }
  }, [selectedModel, models]);

  // Auto-select when year is chosen
  useEffect(() => {
    if (selectedYear && selectedModel) {
      const model = models.find((m) => m.id === selectedModel);
      onSelect({
        make_id: makeId,
        make_name: makeName,
        model_id: selectedModel,
        model_name: model?.name,
        year: selectedYear,
      });
    }
  }, [selectedYear, selectedModel, makeId, makeName, models, onSelect]);

  if (loading) {
    return <LoadingSpinner size="sm" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-6"
    >
      {/* Models */}
      {selectedModel === null && (
        <div>
          <h4 className="text-h4 font-montserrat font-bold mb-3">Select Model</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className="p-3 rounded-lg border-2 border-road-grey-300 hover:border-mechanic-blue text-center transition-all"
              >
                <p className="font-semibold text-road-grey-900">{model.name}</p>
                <p className="text-body-sm text-road-grey-500">
                  {model.year_from} - {model.year_to}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Years */}
      {selectedModel !== null && (
        <div>
          <h4 className="text-h4 font-montserrat font-bold mb-3">Select Year</h4>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`p-2.5 rounded-lg border-2 transition-all font-montserrat font-bold ${
                  selectedYear === year
                    ? 'border-mechanic-blue bg-mechanic-blue text-white'
                    : 'border-road-grey-300 hover:border-mechanic-blue text-road-grey-900'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedModel !== null && (
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedModel(null);
            setSelectedYear(null);
            setYears([]);
          }}
        >
          Change Model
        </Button>
      )}
    </motion.div>
  );
};

export default HomePage;
