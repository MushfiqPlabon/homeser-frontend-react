/**
 * Centralized error handler for API errors
 * @param {Object} error - The error object from an API call
 * @returns {Object} - Formatted error object with message and type
 */
export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    // Check if it's a backend-formatted response
    if (data && typeof data === "object" && "success" in data) {
      if (data.success === false && data.error) {
        return {
          message:
            data.error.message || data.error.detail || "An error occurred",
          type: "error",
        };
      } else {
        return { message: data.message || "An error occurred", type: "error" };
      }
    }

    // Handle standard DRF format
    switch (status) {
      case 400:
        return { message: data.detail || "Bad Request", type: "error" };
      case 401:
        return { message: "Please login again", type: "error" };
      case 403:
        return { message: "Access denied", type: "error" };
      case 404:
        return { message: "Not found", type: "error" };
      case 500:
        return { message: "Server error", type: "error" };
      default:
        return { message: data.detail || "An error occurred", type: "error" };
    }
  }
  return { message: "Network error", type: "error" };
};

/**
 * Centralized success handler for API responses
 * @param {Object} data - The response data from an API call
 * @returns {Object} - Formatted success object with message and type
 */
export const handleApiSuccess = (data) => {
  // Check if it's a backend-formatted response
  if (
    data &&
    typeof data === "object" &&
    "success" in data &&
    data.success === true
  ) {
    return { message: data.message || "Operation successful", type: "success" };
  }

  // For standard DRF responses
  return { message: data.message || "Operation successful", type: "success" };
};
