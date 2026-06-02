import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { ProductCard, ProductCardSkeleton } from '../components/shared/ProductCard';
import CheckoutModal from '../components/shared/CheckoutModal';
import type { Product } from '../types';
import api from '../lib/api';

interface NetworkPageProps {
  network: 'mtn' | 'airteltigo' | 'telecel';
}

const networkConfig = {
  mtn: {
    name: 'MTN',
    title: 'MTN Data Bundles',
    description: 'Buy cheap MTN data bundles in Ghana. Non-expiry bundles delivered instantly.',
    gradient: 'from-yellow-400 to-amber-500',
    bg: 'from-yellow-50 to-amber-50',
    accent: 'text-amber-700',
    badge: 'bg-yellow-100 text-yellow-900',
  },
  airteltigo: {
    name: 'AirtelTigo',
    title: 'AirtelTigo Data Bundles',
    description: 'Affordable AirtelTigo data packages valid for 30 days. Pay with MoMo.',
    gradient: 'from-red-500 to-rose-600',
    bg: 'from-red-50 to-rose-50',
    accent: 'text-red-700',
    badge: 'bg-red-100 text-red-900',
  },
  telecel: {
    name: 'Telecel',
    title: 'Telecel Data Bundles',
    description: 'Buy Telecel data bundles with non-expiry validity. Instant mobile money delivery.',
    gradient: 'from-red-700 to-red-800',
    bg: 'from-red-50 to-rose-50',
    accent: 'text-red-800',
    badge: 'bg-red-100 text-red-900',
  },
};

const NetworkDataPage = ({ network }: NetworkPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const config = networkConfig[network];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?network=${network}&type=data_bundle`);
        setProducts(res.data.data);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [network]);

  return (
    <MainLayout>
      {/* Hero */}
      <div className={`bg-gradient-to-br ${config.bg} border-b border-sky-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-md`}>
              <Wifi className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{config.title}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{config.description}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products available right now.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">{products.length} bundle{products.length !== 1 ? 's' : ''} available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} onSelect={setSelectedProduct} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedProduct && (
        <CheckoutModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </MainLayout>
  );
};

export default NetworkDataPage;
