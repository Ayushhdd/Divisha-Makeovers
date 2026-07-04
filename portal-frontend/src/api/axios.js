import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/backend-api';
const APP_BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = `${APP_BASE}/divisha/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
