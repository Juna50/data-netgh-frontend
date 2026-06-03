import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
console.log(API_URL)
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Auth token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('netgh_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('netgh_admin_token');
      localStorage.removeItem('netgh_admin_user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
