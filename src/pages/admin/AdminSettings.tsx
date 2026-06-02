import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Settings } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    maintenance_mode: 'false',
    mtn_notice_enabled: 'false',
    mtn_notice_message: '',
    support_whatsapp: '',
    site_name: 'NetGH',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        setSettings((prev) => ({ ...prev, ...res.data.data }));
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/admin/settings', settings);
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-sky-100 p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 space-y-5">

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Site Name</label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Support WhatsApp Number</label>
            <input
              type="text"
              value={settings.support_whatsapp}
              onChange={(e) => setSettings({ ...settings, support_whatsapp: e.target.value })}
              placeholder="+233000000000"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
            />
          </div>

          <div className="border border-sky-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Maintenance Mode</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setSettings({ ...settings, maintenance_mode: settings.maintenance_mode === 'true' ? 'false' : 'true' })}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                  settings.maintenance_mode === 'true' ? 'bg-red-500' : 'bg-gray-200'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.maintenance_mode === 'true' ? 'translate-x-5' : ''
                }`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {settings.maintenance_mode === 'true' ? '🔴 Site is in maintenance mode' : '🟢 Site is live'}
                </p>
                <p className="text-xs text-gray-400">When enabled, customers see a maintenance page</p>
              </div>
            </label>
          </div>

          <div className="border border-sky-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">MTN Notice Banner</h3>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <div
                onClick={() => setSettings({ ...settings, mtn_notice_enabled: settings.mtn_notice_enabled === 'true' ? 'false' : 'true' })}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                  settings.mtn_notice_enabled === 'true' ? 'bg-sky-500' : 'bg-gray-200'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.mtn_notice_enabled === 'true' ? 'translate-x-5' : ''
                }`} />
              </div>
              <p className="text-sm font-medium text-gray-900">Show MTN notice banner</p>
            </label>
            <textarea
              value={settings.mtn_notice_message}
              onChange={(e) => setSettings({ ...settings, mtn_notice_message: e.target.value })}
              placeholder="e.g. MTN portal is currently down for maintenance. Please try again later."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 gradient-brand text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default AdminSettings;
