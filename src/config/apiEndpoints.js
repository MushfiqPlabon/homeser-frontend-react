// Centralized configuration for API endpoints
// This file defines public endpoints that don't require auth for GET requests

export const PUBLIC_ENDPOINTS = [
  "/services/",
  "/categories/",
  "/search/",
  "/public/",
  "/auth/token/refresh/",
];

// Define a function to check if an endpoint is public
export const isPublicEndpoint = (url) => {
  return PUBLIC_ENDPOINTS.some((endpoint) => url?.includes(endpoint));
};

// Define endpoints that are read-only (GET) public but require auth for write operations
export const PUBLIC_READ_ONLY_ENDPOINTS = [
  "/services/",
  "/categories/",
  "/search/",
  "/public/",
];
