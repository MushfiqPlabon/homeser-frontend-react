// src/utils/shared/uiComponents.js
// Shared UI components and utilities

/**
 * Get size classes for loading spinner
 * @param {string} size - Size of the spinner (sm, md, lg, xl)
 * @returns {string} Tailwind classes for the spinner size
 */
export const getSpinnerSizeClasses = (size) => {
  switch (size) {
    case "sm":
      return "h-8 w-8 border-2";
    case "lg":
      return "h-16 w-16 border-4";
    case "xl":
      return "h-24 w-24 border-4";
    default:
      return "h-12 w-12 border-2";
  }
};

/**
 * Get style classes for toast notifications based on type
 * @param {string} type - Type of notification (success, error, warning, info)
 * @returns {string} Tailwind classes for the notification style
 */
export const getToastTypeStyles = (type) => {
  switch (type) {
    case "success":
      return "bg-green-50/80 border-green-200/50 text-green-800";
    case "error":
      return "bg-red-50/80 border-red-200/50 text-red-800";
    case "warning":
      return "bg-yellow-50/80 border-yellow-200/50 text-yellow-800";
    default:
      return "bg-blue-50/80 border-blue-200/50 text-blue-800";
  }
};

/**
 * Optimize Cloudinary URLs for better performance
 * @param {string} url - Image URL
 * @returns {string} Optimized image URL
 */
export const optimizeCloudinaryUrl = (url) => {
  // If it's a Cloudinary URL and doesn't already have optimization parameters, add them
  if (url?.includes("cloudinary.com") && !url.includes("/f_auto,q_auto/")) {
    // Add automatic format and quality optimization
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  return url;
};
