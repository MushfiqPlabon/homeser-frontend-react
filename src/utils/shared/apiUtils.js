// src/utils/shared/apiUtils.js
// Shared API utilities and error handling

/**
 * Format API response data
 * @param {object} data - Raw API response data
 * @returns {object} Formatted response data
 */
export const formatApiResponse = (data) => {
  // If response has a success field, return the data directly
  if (data.success !== undefined) {
    return data;
  }

  // If response has a data field, return that
  if (data.data !== undefined) {
    return data.data;
  }

  // Otherwise return the response as is
  return data;
};
