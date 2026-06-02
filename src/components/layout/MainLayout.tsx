import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Menu, X, MessageCircle, ChevronDown } from 'lucide-react';

const SUPPORT_WHATSAPP = import.meta.env.VITE_SUPPORT_WHATSAPP || '+233000000000';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/mtn-data', label: 'MTN Data' },
    { href: '/airteltigo-data', label: 'AirtelTigo Data' },
    { href: '/telecel-data', label: 'Telecel Data' },
    { href: '/result-checkers', label: 'Result Checkers' },
    { href: '/track-order', label: 'Track Order' },
    { href: '/faq', label: 'FAQ' },
  ];

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-sky-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              NetGH
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-sky-100 text-sky-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* WhatsApp support button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Support
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-sky-100 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-sky-100 text-sky-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 bg-green-500 text-white text-sm font-medium rounded-lg mt-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Support
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-gradient-to-b from-white to-sky-50 border-t border-sky-100 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">NetGH</span>
          </div>
          <p className="text-sm text-gray-500 max-w-xs">
            Ghana's trusted platform for affordable data bundles and result checkers. Delivered instantly via mobile money.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Data Bundles</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/mtn-data" className="hover:text-sky-600 transition-colors">MTN Data</Link></li>
            <li><Link to="/airteltigo-data" className="hover:text-sky-600 transition-colors">AirtelTigo Data</Link></li>
            <li><Link to="/telecel-data" className="hover:text-sky-600 transition-colors">Telecel Data</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Support</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/faq" className="hover:text-sky-600 transition-colors">FAQ</Link></li>
            <li><Link to="/track-order" className="hover:text-sky-600 transition-colors">Track Order</Link></li>
            <li>
              <a
                href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-600 transition-colors"
              >
                WhatsApp Support
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sky-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} NetGH. All rights reserved.</p>
        <p className="text-xs text-gray-400">Powered by Moolre · Hosted on Vercel</p>
      </div>
    </div>
  </footer>
);

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
