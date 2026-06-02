import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, Clock, Star, ArrowRight, Wifi, BookOpen, Users } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import CheckoutModal from '../components/shared/CheckoutModal';
import { ProductCard, ProductCardSkeleton } from '../components/shared/ProductCard';
import type { Product } from '../types';
import api from '../lib/api';

const networkCards = [
  {
    name: 'MTN Data',
    description: 'Non-expiry MTN bundles at the best prices',
    href: '/mtn-data',
    gradient: 'from-yellow-400 to-amber-500',
    textColor: 'text-yellow-900',
    emoji: '📶',
  },
  {
    name: 'AirtelTigo Data',
    description: 'Affordable AirtelTigo bundles for 30 days',
    href: '/airteltigo-data',
    gradient: 'from-red-500 to-rose-600',
    textColor: 'text-white',
    emoji: '📡',
  },
  {
    name: 'Telecel Data',
    description: 'Non-expiry Telecel bundles for all devices',
    href: '/telecel-data',
    gradient: 'from-red-700 to-red-800',
    textColor: 'text-white',
    emoji: '🌐',
  },
  {
    name: 'Result Checkers',
    description: 'WASSCE & BECE checker PINs — instant delivery',
    href: '/result-checkers',
    gradient: 'from-green-500 to-emerald-600',
    textColor: 'text-white',
    emoji: '📝',
  },
];

const features = [
  { icon: Zap, title: 'Instant Delivery', desc: 'Data delivered to your phone in minutes after payment.' },
  { icon: Shield, title: 'Secure Payments', desc: 'All transactions secured via mobile money (MoMo).' },
  { icon: Clock, title: '24/7 Service', desc: 'Buy anytime, anywhere. We never sleep.' },
  { icon: Star, title: 'Best Prices', desc: 'We guarantee the lowest prices for data in Ghana.' },
];

const testimonials = [
  { name: 'Kwame A.', text: 'Fastest data delivery in Ghana. I always buy my MTN bundles here.', stars: 5 },
  { name: 'Ama S.', text: 'Great prices and super easy to use. Got my AirtelTigo data in seconds!', stars: 5 },
  { name: 'Kofi M.', text: 'My BECE checker PIN came immediately. Will use again.', stars: 5 },
];

const steps = [
  { step: '1', title: 'Choose Network', desc: 'Select MTN, AirtelTigo, or Telecel' },
  { step: '2', title: 'Pick a Package', desc: 'Choose your preferred data size & price' },
  { step: '3', title: 'Pay with MoMo', desc: 'Approve the prompt on your phone' },
  { step: '4', title: 'Receive Instantly', desc: 'Data is sent directly to your number' },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [mtnRes, atRes, telRes] = await Promise.all([
          api.get('/products?network=mtn'),
          api.get('/products?network=airteltigo'),
          api.get('/products?network=telecel'),
        ]);
        const mtn = mtnRes.data.data.slice(0, 2);
        const at = atRes.data.data.slice(0, 2);
        const tel = telRes.data.data.slice(0, 2);
        setFeaturedProducts([...mtn, ...at, ...tel]);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-sky-500 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>Ghana's #1 Data Bundle Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance">
              Buy Cheap Data Bundles<br />
              <span className="text-yellow-300">in Ghana</span>
            </h1>
            <p className="text-lg sm:text-xl text-sky-100 mb-8 text-balance">
              MTN, AirtelTigo & Telecel data bundles starting from <strong className="text-white">GHS 4.20</strong>. Instant delivery via Mobile Money.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/mtn-data"
                className="px-8 py-3.5 bg-white text-sky-700 font-bold rounded-xl hover:bg-sky-50 transition-colors shadow-lg"
              >
                Browse Data Bundles
              </Link>
              <Link
                to="/result-checkers"
                className="px-8 py-3.5 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
              >
                Result Checkers
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-14 grid grid-cols-3 gap-4 max-w-xl mx-auto text-center"
          >
            {[
              { value: '10,000+', label: 'Customers' },
              { value: 'GHS 4.20', label: 'From Only' },
              { value: '< 5 min', label: 'Delivery' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xl sm:text-2xl font-extrabold">{stat.value}</p>
                <p className="text-xs sm:text-sm text-sky-200">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Network Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Browse by Network</h2>
          <p className="text-gray-500 mt-2">Pick your preferred network and get the best deal</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {networkCards.map((card, i) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={card.href}
                className={`block bg-gradient-to-br ${card.gradient} rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group`}
              >
                <div className="text-3xl mb-3">{card.emoji}</div>
                <h3 className={`font-bold text-lg ${card.textColor}`}>{card.name}</h3>
                <p className={`text-sm mt-1 ${card.textColor} opacity-80`}>{card.description}</p>
                <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${card.textColor} opacity-90 group-hover:gap-2 transition-all`}>
                  View Bundles <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular Bundles</h2>
            <p className="text-gray-500 mt-1">Our most purchased data packages</p>
          </div>
          <Link to="/mtn-data" className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featuredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} onSelect={setSelectedProduct} index={i} />
              ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Buy Data Bundles</h2>
            <p className="text-gray-500 mt-2">Simple 4-step process</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 gradient-brand rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{s.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Choose NetGH?</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm"
            >
              <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-sky-50 rounded-2xl p-6 border border-sky-100"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-3 italic">"{t.text}"</p>
                <p className="text-sm font-semibold text-gray-900">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="gradient-brand rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Get Data?</h2>
          <p className="text-sky-100 mb-6">Join thousands of Ghanaians buying cheap data on NetGH</p>
          <Link
            to="/mtn-data"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-sky-700 font-bold rounded-xl hover:bg-sky-50 transition-colors shadow-lg"
          >
            <Wifi className="w-5 h-5" />
            Buy Data Now
          </Link>
        </div>
      </section>

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </MainLayout>
  );
};

export default HomePage;
