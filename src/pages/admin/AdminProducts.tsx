import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Product } from '../../types';
import { formatCurrency } from '../../lib/utils';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const NETWORKS = ['mtn', 'airteltigo', 'telecel', 'WASSCE', 'BECE'];
const PRODUCT_TYPES = ['data_bundle', 'result_checker'];

const emptyForm = {
  product_type: 'data_bundle',
  network: 'mtn',
  name: '',
  size: '',
  price: '',
  duration: '',
  is_active: true,
  sort_order: 0,
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [networkFilter, setNetworkFilter] = useState('all');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products/admin');
      setProducts(res.data.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      product_type: product.product_type,
      network: product.network,
      name: product.name,
      size: product.size || '',
      price: String(product.price),
      duration: product.duration || '',
      is_active: product.is_active,
      sort_order: product.sort_order,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (editProduct) {
        await api.patch(`/products/${editProduct._id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      await api.patch(`/products/${product._id}`, { is_active: !product.is_active });
      setProducts((prev) => prev.map((p) => p._id === product._id ? { ...p, is_active: !p.is_active } : p));
      toast.success(`Product ${!product.is_active ? 'enabled' : 'disabled'}`);
    } catch {
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = networkFilter === 'all'
    ? products
    : products.filter((p) => p.network.toLowerCase() === networkFilter.toLowerCase());

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Products</h1>
        <div className="flex items-center gap-2">
          <button onClick={fetchProducts} disabled={loading} className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-4 py-2 gradient-brand text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Network filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', ...NETWORKS].map((n) => (
          <button
            key={n}
            onClick={() => setNetworkFilter(n)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              networkFilter === n ? 'bg-sky-600 text-white' : 'bg-white border border-sky-100 text-gray-600 hover:border-sky-300'
            }`}
          >
            {n === 'all' ? 'All' : n.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sky-50">
              <tr>
                {['Name', 'Network', 'Type', 'Size', 'Price', 'Duration', 'Active', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">No products found</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{product.network}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{product.product_type.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-gray-600">{product.size}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{product.duration?.replace(/\n/g, ' ').trim()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(product)} className="transition-colors">
                        {product.is_active
                          ? <ToggleRight className="w-5 h-5 text-green-500" />
                          : <ToggleLeft className="w-5 h-5 text-gray-300" />
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(product)} className="p-1.5 hover:bg-sky-50 rounded-lg text-sky-600 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                    <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20">
                      {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Network</label>
                    <select value={form.network} onChange={(e) => setForm({ ...form, network: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20">
                      {NETWORKS.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                {[
                  { label: 'Name', key: 'name', placeholder: 'e.g. 1GB Data Bundle' },
                  { label: 'Size', key: 'size', placeholder: 'e.g. 1GB' },
                  { label: 'Price (GHS)', key: 'price', placeholder: '4.90', type: 'number' },
                  { label: 'Duration', key: 'duration', placeholder: 'e.g. Non-Expiry' },
                  { label: 'Sort Order', key: 'sort_order', placeholder: '0', type: 'number' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input
                      type={type || 'text'}
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                ))}

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600" />
                  <span className="text-sm text-gray-700">Active (visible to customers)</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 gradient-brand text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
