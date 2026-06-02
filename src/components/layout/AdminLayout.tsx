import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, LayoutDashboard, ShoppingBag, Package, Settings,
  LogOut, Menu, X, ChevronRight, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (href: string) => location.pathname === href;

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-5 border-b border-sky-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Wifi className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">NetGH Admin</p>
            <p className="text-xs text-gray-400">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => mobile && setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(item.href)
                ? 'bg-sky-100 text-sky-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
            {isActive(item.href) && <ChevronRight className="w-3 h-3 ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-3 border-t border-sky-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
            <User className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">{admin?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{admin?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sky-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-r border-sky-100 fixed h-full z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-sky-100 px-4 sm:px-6 h-14 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">
              {navItems.find((n) => isActive(n.href))?.label || 'Admin'}
            </p>
          </div>
          <Link to="/" target="_blank" className="text-xs text-sky-600 hover:text-sky-700 font-medium">
            View Site →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
