import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, CheckCircle2, XCircle, Clock, DollarSign, ArrowRight, RefreshCw } from 'lucide-react';
import type { DashboardStats, Order } from '../../types';
import { formatCurrency, formatDate, statusColors } from '../../lib/utils';
import api from '../../lib/api';

interface DashboardData {
  stats: DashboardStats;
  recent_orders: Order[];
}

const StatCard = ({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: any; color: string; sub?: string;
}) => (
  <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data.data);
    } catch {
      // handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const stats = data?.stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-sky-100 p-5 h-28 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
              <div className="h-7 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Revenue row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Revenue" value={formatCurrency(parseFloat(stats.total_revenue))} icon={DollarSign} color="bg-green-100 text-green-600" />
            <StatCard label="Revenue Today" value={formatCurrency(parseFloat(stats.revenue_today))} icon={TrendingUp} color="bg-sky-100 text-sky-600" />
            <StatCard label="Revenue This Month" value={formatCurrency(parseFloat(stats.revenue_this_month))} icon={TrendingUp} color="bg-blue-100 text-blue-600" />
          </div>

          {/* Orders row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Orders" value={parseInt(stats.total_orders).toLocaleString()} icon={ShoppingBag} color="bg-purple-100 text-purple-600" />
            <StatCard label="Orders Today" value={parseInt(stats.orders_today).toLocaleString()} icon={Clock} color="bg-amber-100 text-amber-600" />
            <StatCard label="Completed" value={parseInt(stats.completed_orders).toLocaleString()} icon={CheckCircle2} color="bg-green-100 text-green-600" />
            <StatCard label="Failed" value={parseInt(stats.failed_orders).toLocaleString()} icon={XCircle} color="bg-red-100 text-red-600" />
          </div>
        </>
      ) : null}

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-sky-50">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-sky-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sky-50">
              <tr>
                {['Order #', 'Product', 'Network', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.recent_orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No orders yet</td>
                </tr>
              ) : (
                data?.recent_orders.map((order: any) => (
                  <motion.tr
                    key={order.order_number}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-sky-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-gray-900 text-xs">{order.order_number}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{order.product_name}</td>
                    <td className="px-4 py-3 text-gray-600 uppercase text-xs">{order.network}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(parseFloat(order.amount))}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(order.created_at)}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
