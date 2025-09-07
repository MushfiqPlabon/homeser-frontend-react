import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
  getProfile: () => api.get('/profile/'),
  updateProfile: (profileData) => api.patch('/profile/', profileData),
};

// Services API
export const servicesAPI = {
  getServices: (params = {}) => api.get('/services/', { params }),
  getService: (id) => api.get(`/services/${id}/`),
  getServiceReviews: (serviceId) => api.get(`/services/${serviceId}/reviews/`),
  createReview: (serviceId, reviewData) => api.post(`/services/${serviceId}/reviews/`, reviewData),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addToCart: (serviceId, qty = 1) => api.post('/cart/add/', { service_id: serviceId, qty }),
  removeFromCart: (serviceId) => api.post('/cart/remove/', { service_id: serviceId }),
};

// Orders API
export const ordersAPI = {
  checkout: (orderData) => api.post('/orders/checkout/', orderData),
};

// Admin API
export const adminAPI = {
  promoteUser: (userId) => api.post('/admin/promote/', { user_id: userId }),
};

export default api;