import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Public pages
import HomePage from './pages/HomePage';
import NetworkDataPage from './pages/NetworkDataPage';
import ResultCheckersPage from './pages/ResultCheckersPage';
import TrackOrderPage from './pages/TrackOrderPage';
import FAQPage from './pages/FAQPage';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminSettings from './pages/admin/AdminSettings';

// Layout / Auth guard
import AdminLayout from './components/layout/AdminLayout';
import AdminProtectedRoute from './components/layout/AdminProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1f2937',
              borderRadius: '12px',
              border: '1px solid #e0f2fe',
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.15)',
              fontSize: '14px',
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/mtn-data" element={<NetworkDataPage network="mtn" />} />
          <Route path="/airteltigo-data" element={<NetworkDataPage network="airteltigo" />} />
          <Route path="/telecel-data" element={<NetworkDataPage network="telecel" />} />
          <Route path="/result-checkers" element={<ResultCheckersPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
