import axios from "axios";

// Determine the base URL for API requests.
// It first tries to use the VITE_API_BASE_URL environment variable (e.g., for production builds),
// and falls back to a local development URL if the environment variable is not set.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: This function runs before each outgoing HTTP request.
// Its purpose is to automatically attach the JWT access token from local storage
// to the 'Authorization' header, which is required for authenticated API endpoints.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: This function runs after each incoming HTTP response.
// Its primary purpose is to handle 401 (Unauthorized) errors, which typically
// occur when the access token has expired. It attempts to refresh the token
// using the refresh token, and then retries the original failed request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 Unauthorized response and it hasn't been retried yet.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to prevent infinite loops.

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          // Attempt to get a new access token using the refresh token.
          const response = await axios.post(
            `${API_BASE_URL}/auth/token/refresh/`,
            {
              refresh: refreshToken,
            },
          );

          const { access } = response.data;
          localStorage.setItem("access_token", access); // Store the new access token.

          // Retry the original request with the newly obtained access token.
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (_refreshError) {
        // If token refresh fails (e.g., refresh token is invalid or expired),
        // clear all tokens and redirect the user to the login page.
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.replace("/login"); // Use replace to avoid history stack issues
      }
    }

    return Promise.reject(error); // For any other errors, or if refresh fails, propagate the error.
  },
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register/", userData),
  login: (credentials) => api.post("/auth/login/", credentials),
  getProfile: () => api.get("/profile/"),
  updateProfile: (profileData) => api.patch("/profile/", profileData),
};

// Services API
export const servicesAPI = {
  getServices: (params = {}) => api.get("/services/", { params }),
  getService: (id) => api.get(`/services/${id}/`),
  getServiceReviews: (serviceId) => api.get(`/services/${serviceId}/reviews/`),
  createReview: (serviceId, reviewData) =>
    api.post(`/services/${serviceId}/reviews/`, reviewData),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get("/cart/"),
  addToCart: (serviceId, qty = 1) =>
    api.post("/cart/add/", { service_id: serviceId, qty }),
  removeFromCart: (serviceId) =>
    api.post("/cart/remove/", { service_id: serviceId }),
};

// Orders API
export const ordersAPI = {
  checkout: (orderData) => api.post("/orders/checkout/", orderData),
};

// Admin API
export const adminAPI = {
  promoteUser: (userId) => api.post("/admin/promote/", { user_id: userId }),
};

export default api;
