import axios from "axios";
import { handleApiError } from "./errorHandler";

// Determine the base URL for API requests
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Token storage key (must match AuthContext)
const TOKEN_STORAGE_KEY = "homeser_auth_tokens";

// Variable to store the promise for ongoing token refresh
let refreshingTokenPromise = null;

// Utility to get tokens from localStorage
const getStoredTokens = () => {
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { access: null, refresh: null };
  } catch (error) {
    console.warn("Failed to parse stored tokens:", error);
    return { access: null, refresh: null };
  }
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach JWT access token from localStorage
api.interceptors.request.use(
  (config) => {
    // List of public endpoints that should NOT have authentication headers
    const publicEndpoints = [
      "/services/",
      "/categories/",
      "/services",
      "/categories",
      "/auth/login/",
      "/auth/register/",
      "/auth/token/refresh/",
    ];

    // Check if this is a public endpoint
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url.includes(endpoint),
    );

    // Only add auth header if it's not a public endpoint
    if (!isPublicEndpoint) {
      const tokens = getStoredTokens();
      if (tokens.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Function to refresh the token (to be set by AuthContext)
let refreshToken = () =>
  Promise.reject(new Error("Token refresh function not set"));

// Function to set the token refresh function
export const setTokenRefreshFunction = (refreshFn) => {
  refreshToken = refreshFn;
};

// Response interceptor: Handle 401 errors with token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 Unauthorized response and it hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If we're already refreshing the token, wait for it to complete
      if (refreshingTokenPromise) {
        try {
          const newToken = await refreshingTokenPromise;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Set the refreshing token promise and trigger token refresh
      refreshingTokenPromise = refreshToken()
        .then((newToken) => {
          // Update the authorization header with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Retry the original request with the new token
          return api(originalRequest);
        })
        .catch((refreshError) => {
          // If token refresh fails, propagate the error
          return Promise.reject(refreshError);
        })
        .finally(() => {
          // Clear the refreshing promise
          refreshingTokenPromise = null;
        });

      return refreshingTokenPromise;
    }

    // For all other errors, use the error handler
    return handleApiError(error);
  },
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/login/", credentials),
  register: (userData) => api.post("/auth/register/", userData),
  logout: () => api.post("/auth/logout/"),
  getProfile: () => api.get("/profile/"),
  refreshToken: (refreshToken) =>
    api.post("/auth/token/refresh/", { refresh: refreshToken }),
};

// Orders API
export const ordersAPI = {
  getUserOrders: () => api.get("/user/orders/"),
  getOrder: (orderId) => api.get(`/user/orders/${orderId}/`),
  createOrder: (orderData) => api.post("/user/orders/", orderData),
};

// Services API
export const servicesAPI = {
  getServices: (params) => api.get("/services/", { params }),
  getService: (serviceId) => api.get(`/services/${serviceId}/`),
  createService: (serviceData) => api.post("/services/", serviceData),
  updateService: (serviceId, serviceData) =>
    api.put(`/services/${serviceId}/`, serviceData),
  deleteService: (serviceId) => api.delete(`/services/${serviceId}/`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get("/cart/"),
  addToCart: (data) => api.post("/cart/add/", data),
  removeFromCart: (data) => api.post("/cart/remove/", data),
  updateCartItem: (data) => api.post("/cart/update-quantity/", data),
};

export default api;
