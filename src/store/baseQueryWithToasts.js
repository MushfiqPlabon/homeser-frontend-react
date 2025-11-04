import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Determine the base URL for API requests
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Create base query with toast functionality
export const baseQueryWithToasts = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    // Get token from localStorage using consistent storage method
    const storedTokens = localStorage.getItem("homeser_auth_tokens");
    if (storedTokens) {
      try {
        const tokens = JSON.parse(storedTokens);
        if (tokens.access) {
          headers.set("Authorization", `Bearer ${tokens.access}`);
        }
      } catch (e) {
        console.error("Failed to parse stored tokens:", e);
      }
    }
    return headers;
  },
});

// Global variable to hold the toast function
let globalToastFunction = null;

// Function to set the global toast function
export const setGlobalToastFunction = (toastFunction) => {
  globalToastFunction = toastFunction;
};

// Wrapper function that adds toast notifications to base query
export const baseQueryWithToastsAndNotifications = async (
  args,
  api,
  extraOptions,
) => {
  const result = await baseQueryWithToasts(args, api, extraOptions);

  if (result.error) {
    console.error("API Error:", result.error);

    // Show toast notification for API errors
    if (globalToastFunction) {
      let errorMessage = "An error occurred while processing your request.";

      // Try to extract specific error message from response
      if (result.error.data && typeof result.error.data === "object") {
        if (result.error.data.detail) {
          errorMessage = result.error.data.detail;
        } else if (result.error.data.message) {
          errorMessage = result.error.data.message;
        } else if (Object.values(result.error.data)[0]) {
          // Get the first error message if it's a validation error object
          const firstError = Object.values(result.error.data)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            errorMessage = firstError[0];
          } else if (typeof firstError === "string") {
            errorMessage = firstError;
          }
        }
      }

      globalToastFunction(errorMessage, "error");
    }
  } else if (result.data) {
    // Success case - could trigger success toasts based on operation
    // For now, we're not showing success toasts for all operations to avoid clutter
  }

  return result;
};
