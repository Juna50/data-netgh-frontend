import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types';
import { formatCurrency, networkDisplayName } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index?: number;
}

const networkBadgeColors: Record<string, string> = {
  mtn: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  airteltigo: 'bg-red-100 text-red-800 border-red-200',
  telecel: 'bg-red-100 text-red-800 border-red-200',
  WASSCE: 'bg-green-100 text-green-800 border-green-200',
  BECE: 'bg-purple-100 text-purple-800 border-purple-200',
};

const networkGradients: Record<string, string> = {
  mtn: 'from-yellow-400 to-amber-500',
  airteltigo: 'from-red-500 to-rose-600',
  telecel: 'from-red-600 to-red-700',
  WASSCE: 'from-green-500 to-emerald-600',
  BECE: 'from-purple-500 to-purple-700',
};

export const ProductCard = ({ product, onSelect, index = 0 }: ProductCardProps) => {
  const networkKey = product.network.toLowerCase();
  const gradient = networkGradients[networkKey] || 'from-sky-500 to-blue-600';
  const badge = networkBadgeColors[networkKey] || 'bg-sky-100 text-sky-800 border-sky-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="bg-white rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group hover:-translate-y-0.5"
    >
      {/* Top accent bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        {/* Size + Network */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-3xl font-bold text-gray-900">{product.size}</span>
            <p className="text-xs text-gray-500 mt-0.5">{product.name}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badge}`}>
            {networkDisplayName[product.network] || product.network}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1.5 mb-4 text-sm text-gray-500">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="capitalize">{product.duration?.replace(/\n/g, ' ').trim()}</span>
        </div>

        {/* Price + Buy */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-sky-600">{formatCurrency(product.price)}</span>
          </div>
          <button
            onClick={() => onSelect(product)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 active:scale-95`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Skeleton loader for product card
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
    <div className="h-1.5 bg-gray-200" />
    <div className="p-5 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-1">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      <div className="flex justify-between items-center">
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 w-24 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);
