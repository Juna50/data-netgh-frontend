import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { ProductCard, ProductCardSkeleton } from '../components/shared/ProductCard';
import CheckoutModal from '../components/shared/CheckoutModal';
import type { Product } from '../types';
import api from '../lib/api';

const faqs = [
  { q: 'How long does delivery take?', a: 'Checker PINs are delivered instantly to your MoMo number via SMS after payment confirmation.' },
  { q: 'Can I use the PIN multiple times?', a: 'No, each PIN is for single use only.' },
  { q: 'What if I don\'t receive my PIN?', a: 'Contact us via WhatsApp and we\'ll resolve it within minutes.' },
];

const ResultCheckersPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/products?type=result_checker');
        setProducts(res.data.data);
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">WASSCE & BECE Result Checkers</h1>
              <p className="text-gray-500 text-sm mt-0.5">Buy your checker PIN instantly via mobile money. Delivered by SMS.</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} onSelect={setSelectedProduct} index={i} />
            ))}
          </div>
        )}

        {/* How it works */}
        <div className="mt-12 bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 max-w-2xl">
          <h2 className="font-bold text-gray-900 text-lg mb-4">How to Get Your Checker PIN</h2>
          <div className="space-y-3">
            {[
              'Select WASSCE or BECE checker above',
              'Enter your MoMo payment number',
              'Approve the payment prompt on your phone',
              'Receive your PIN via SMS instantly',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-700">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 max-w-2xl">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-sky-100 p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{faq.q}</h3>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <CheckoutModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </MainLayout>
  );
};

export default ResultCheckersPage;
