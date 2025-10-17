// Utility functions for input sanitization and validation

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input string
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  // Remove dangerous characters and patterns
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/(?:\r\n|\r|\n)/g, "<br>");
};

/**
 * Sanitize numeric input
 * @param {string|number} input - Numeric input
 * @returns {number} - Sanitized number
 */
export const sanitizeNumericInput = (input) => {
  const num = parseFloat(input);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, num); // Ensure non-negative
};

/**
 * Sanitize textarea input (allows line breaks)
 * @param {string} input - Textarea input
 * @returns {string} - Sanitized string
 */
export const sanitizeTextareaInput = (input) => {
  if (typeof input !== "string") return input;

  // Remove dangerous scripts but preserve line breaks
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

/**
 * Validate and sanitize service name
 * @param {string} name - Service name
 * @returns {string} - Sanitized service name
 */
export const sanitizeServiceName = (name) => {
  if (typeof name !== "string") return "";
  // Trim and limit length
  return name.trim().substring(0, 100);
};

/**
 * Validate and sanitize service description
 * @param {string} description - Service description
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized description
 */
export const sanitizeServiceDescription = (description, maxLength = 2000) => {
  if (typeof description !== "string") return "";
  // Trim and limit length
  return description.trim().substring(0, maxLength);
};

/**
 * Validate service price
 * @param {string|number} price - Price input
 * @returns {number} - Validated price
 */
export const validateServicePrice = (price) => {
  const num = parseFloat(price);
  if (Number.isNaN(num) || num <= 0) {
    throw new Error("Invalid price");
  }
  // Round to 2 decimal places
  return Math.round(num * 100) / 100;
};

/**
 * Validate service category
 * @param {string|number} categoryId - Category ID
 * @param {Array} categories - Available categories
 * @returns {number} - Validated category ID
 */
export const validateServiceCategory = (categoryId, categories) => {
  const id = parseInt(categoryId, 10);
  const isValidCategory = categories.some((cat) => cat.id === id);
  if (!isValidCategory) {
    throw new Error("Invalid category");
  }
  return id;
};
