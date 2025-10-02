import axios from "axios";
import { handleApiError } from "./errorHandler";

// Determine the base URL for API requests.
// It first tries to use the VITE_API_BASE_URL environment variable (e.g., for production builds),
// and falls back to a local development URL if the environment variable is not set.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Variable to store the promise for ongoing token refresh
let refreshingTokenPromise = null;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: This function runs before each outgoing HTTP request.
// Its purpose is to automatically attach the JWT access token from localStorage
// to the 'Authorization' header for protected endpoints only.
api.interceptors.request.use(
  (config) => {
    // List of public endpoints that should NOT have authentication headers
    const publicEndpoints = [
      "/services/",
      "/categories/",
      "/services",
      "/categories",
    ];

    // Check if this is a public endpoint
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url.includes(endpoint),
    );

    // Only add auth header if it's not a public endpoint and token exists
    if (!isPublicEndpoint && typeof localStorage !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Function to refresh the token (to be implemented in AuthContext)
let refreshToken = () =>
  Promise.reject(new Error("Token refresh function not set"));

// Function to set the token refresh function
export const setTokenRefreshFunction = (refreshFn) => {
  refreshToken = refreshFn;
};

// Response interceptor: This function runs after each incoming HTTP response.
// Its primary purpose is to handle 401 (Unauthorized) errors, which typically
// occur when the access token has expired. It attempts to refresh the token
// using the refresh token, and then retries the original failed request.
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 Unauthorized response and it hasn't been retried yet.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to prevent infinite loops.

      // If we're already refreshing the token, wait for it to complete
      if (refreshingTokenPromise) {
        try {
          const newToken = await refreshingTokenPromise;
          // Update the authorization header with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Store token in localStorage
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("access_token", newToken);
          }
          // Retry the original request with the new token
          return api(originalRequest);
        } catch (refreshError) {
          // If token refresh fails, propagate the error
          return Promise.reject(refreshError);
        }
      }

      // Set the refreshing token promise and trigger token refresh
      refreshingTokenPromise = refreshToken();
      try {
        const newToken = await refreshingTokenPromise;
        // Update the authorization header with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // Store token in localStorage
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("access_token", newToken);
        }
        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, propagate the error
        return Promise.reject(refreshError);
      } finally {
        // Reset the refreshing token promise
        refreshingTokenPromise = null;
      }
    }

    // Handle other errors with our centralized error handler
    const handledError = handleApiError(error);
    return Promise.reject(handledError); // For any other errors, or if refresh fails, propagate the error.
  },
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register/", userData),
  login: (credentials) => api.post("/auth/login/", credentials),
  getProfile: () => api.get("/profile/"),
  updateProfile: (profileData) => api.patch("/profile/", profileData),
  passwordReset: (email) => api.post("/auth/password-reset/", { email }),
  confirmPasswordReset: (data) =>
    api.post("/auth/password-reset/confirm/", data),
  validateResetToken: (uidb64, token) =>
    api.post("/auth/password-reset/validate/", { uidb64, token }),
};

// Services API
export const servicesAPI = {
  getServices: (params = {}, config = {}) =>
    api.get("/services/", { params, ...config }),
  getService: (id) => api.get(`/services/${id}/`),
  getServiceReviews: (serviceId) => api.get(`/services/${serviceId}/reviews/`),
  createReview: (serviceId, reviewData) =>
    api.post(`/services/${serviceId}/reviews/`, reviewData),
};

// Extended Services API
export const extendedServicesAPI = {
  getExtendedServices: (params = {}, config = {}) =>
    api.get("/ext/services/", { params, ...config }),
  getExtendedService: (id) => api.get(`/ext/services/${id}/`),
  createExtendedService: (serviceData) =>
    api.post("/ext/services/", serviceData),
  updateExtendedService: (id, serviceData) =>
    api.put(`/ext/services/${id}/`, serviceData),
  partialUpdateExtendedService: (id, serviceData) =>
    api.patch(`/ext/services/${id}/`, serviceData),
  deleteExtendedService: (id) => api.delete(`/ext/services/${id}/`),
};

// Extended Categories API
export const extendedCategoriesAPI = {
  getExtendedCategories: () => api.get("/ext/categories/"),
  getExtendedCategory: (id) => api.get(`/ext/categories/${id}/`),
  createExtendedCategory: (categoryData) =>
    api.post("/ext/categories/", categoryData),
  updateExtendedCategory: (id, categoryData) =>
    api.put(`/ext/categories/${id}/`, categoryData),
  partialUpdateExtendedCategory: (id, categoryData) =>
    api.patch(`/ext/categories/${id}/`, categoryData),
  deleteExtendedCategory: (id) => api.delete(`/ext/categories/${id}/`),
};

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get("/categories/"),
};

// Users API
export const usersAPI = {
  getUsers: () => api.get("/admin/users/"),
};

// Reviews API
export const reviewsAPI = {
  getReviews: () => api.get("/admin/reviews/"),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}/`),
  updateReview: (reviewId, reviewData) =>
    api.patch(`/reviews/${reviewId}/`, reviewData),
  getUserReviews: () => api.get("/reviews/user/"),
  // Review detail endpoint
  getReview: (reviewId) => api.get(`/reviews/${reviewId}/`),
  createReview: (serviceId, reviewData) =>
    api.post(`/services/${serviceId}/reviews/`, reviewData),
  // Admin review endpoints
  adminUpdateReview: (reviewId, reviewData) =>
    api.put(`/reviews/${reviewId}/`, reviewData),
  adminPartialUpdateReview: (reviewId, reviewData) =>
    api.patch(`/reviews/${reviewId}/`, reviewData),
  adminDeleteReview: (reviewId) => api.delete(`/reviews/${reviewId}/`),
};

// Orders API
export const ordersAPI = {
  checkout: (orderData) => api.post("/checkout/", orderData),
  getOrders: () => api.get("/admin/orders/"),
  getUserOrders: () => api.get("/user/orders/"),
  updateOrderStatus: (orderId, statusData) =>
    api.post(`/admin/orders/${orderId}/status/`, statusData),
};

// Cart API
export const cartAPI = {
  getCart: () => {
    // Only fetch cart for authenticated users
    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      // Return a rejected promise for unauthenticated users
      return Promise.reject(new Error("User not authenticated"));
    }
    return api.get("/cart/");
  },
  addToCart: (serviceId, quantity) => {
    // Only add to cart for authenticated users
    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      return Promise.reject(new Error("User not authenticated"));
    }
    return api.post("/cart/add/", { service_id: serviceId, qty: quantity });
  },
  removeFromCart: (serviceId) => {
    // Only remove from cart for authenticated users
    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      return Promise.reject(new Error("User not authenticated"));
    }
    return api.post("/cart/remove/", { service_id: serviceId });
  },
  updateCartItemQuantity: (serviceId, quantity) => {
    // Only update cart item quantity for authenticated users
    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      return Promise.reject(new Error("User not authenticated"));
    }
    return api.post("/cart/update-quantity/", {
      service_id: serviceId,
      qty: quantity,
    });
  },
};
// Admin API
export const adminAPI = {
  promoteUser: (userId) => api.post("/admin/promote/", { user_id: userId }),
  // Services CRUD
  createService: (serviceData) => api.post("/admin/services/", serviceData),
  getService: (serviceId) => api.get(`/admin/services/${serviceId}/`),
  updateService: (serviceId, serviceData) =>
    api.put(`/admin/services/${serviceId}/`, serviceData),
  deleteService: (serviceId) => api.delete(`/admin/services/${serviceId}/`),
  getServices: () => api.get("/services/"),
  // Categories CRUD
  createCategory: (categoryData) =>
    api.post("/admin/categories/create/", categoryData),
  getCategory: (categoryId) => api.get(`/admin/categories/${categoryId}/`),
  updateCategory: (categoryId, categoryData) =>
    api.put(`/admin/categories/${categoryId}/`, categoryData),
  deleteCategory: (categoryId) =>
    api.delete(`/admin/categories/${categoryId}/`),
  // Users CRUD
  getUser: (userId) => api.get(`/admin/users/${userId}/`),
  updateUser: (userId, userData) =>
    api.put(`/admin/users/${userId}/`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}/`),
  // Orders CRUD
  updateOrderStatus: (orderId, statusData) =>
    api.post(`/admin/orders/${orderId}/status/`, statusData),
  getOrders: () => api.get("/admin/orders/"),
  adminUpdateOrderStatus: (orderId, statusData) =>
    api.post(`/admin/orders/${orderId}/status/`, statusData),
};

// Payment API
export const paymentAPI = {
  handleIPN: (data) => api.post("/payments/ipn/", data),
  handlePaymentIPN: (data) => api.post("/payments/ipn/", data),
};

// Search API
export const searchAPI = {
  advancedSearch: (params = {}) => api.get("/search/advanced/", { params }),
  getAnalytics: (params = {}) => api.get("/search/analytics/", { params }),
  getPopularSearches: (params = {}) => api.get("/search/popular/", { params }),
};

export default api;
