import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, Clock, XCircle, Loader2, Package } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import type { OrderStatusResponse } from '../types';
import { formatCurrency, formatDate, statusColors } from '../lib/utils';
import api from '../lib/api';

const statusIcons: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="w-8 h-8 text-green-500" />,
  pending: <Clock className="w-8 h-8 text-yellow-500" />,
  processing: <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />,
  failed: <XCircle className="w-8 h-8 text-red-500" />,
  cancelled: <XCircle className="w-8 h-8 text-gray-400" />,
};

const statusMessages: Record<string, string> = {
  pending: 'Your order is awaiting payment confirmation.',
  processing: 'Payment confirmed! Delivering your data bundle now...',
  completed: 'Your data bundle has been delivered successfully!',
  failed: 'This order failed. Please contact support or place a new order.',
  cancelled: 'This order was cancelled.',
};

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<OrderStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (id?: string) => {
    const searchQuery = id || query.trim();
    if (!searchQuery) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await api.get(`/orders/${searchQuery}/status`);
      setOrder(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order not found. Check your order number and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if id param provided
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setQuery(id);
      handleTrack(id);
    }
  }, []);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 gradient-brand rounded-2xl flex items-center justify-center shadow-md">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Track Your Order</h1>
            <p className="text-gray-500 mt-2 text-sm">Enter your order number to check delivery status</p>
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                placeholder="e.g. NGABC12345"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 font-mono"
              />
              <button
                onClick={() => handleTrack()}
                disabled={loading || !query.trim()}
                className="px-5 py-3 gradient-brand text-white font-semibold rounded-xl disabled:opacity-50 hover:shadow-md transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Track
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700"
            >
              {error}
            </motion.div>
          )}

          {/* Order result */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden"
            >
              {/* Status header */}
              <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                {statusIcons[order.status]}
                <div>
                  <p className="font-bold text-gray-900 text-lg capitalize">{order.status}</p>
                  <p className="text-sm text-gray-500">{statusMessages[order.status]}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              {/* Order details */}
              <div className="p-6 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Order Number', value: order.order_number, mono: true },
                    { label: 'Product', value: order.product_name },
                    { label: 'Network', value: order.network?.toUpperCase() },
                    { label: 'Size', value: order.size },
                    { label: 'Amount Paid', value: formatCurrency(order.amount) },
                    { label: 'Recipient', value: order.recipient_number, mono: true },
                    { label: 'Date Placed', value: formatDate(order.created_at) },
                  ].map((item) => (
                    <div key={item.label} className="bg-sky-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                      <p className={`text-sm font-semibold text-gray-900 ${item.mono ? 'font-mono' : ''}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default TrackOrderPage;
