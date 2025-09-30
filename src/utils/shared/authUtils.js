// src/utils/shared/authUtils.js
// Shared authentication utilities

/**
 * Check if user is authenticated
 * @param {object} user - User object from AuthContext
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = (user) => {
  return !!user;
};

/**
 * Check if user is an admin
 * @param {object} user - User object from AuthContext
 * @returns {boolean} True if user is an admin
 */
export const isAdmin = (user) => {
  return user?.is_staff || false;
};

/**
 * Check if user has permission to perform an action
 * @param {object} user - User object from AuthContext
 * @param {string} requiredPermission - Required permission
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (user, _requiredPermission) => {
  if (!user) return false;

  // Admins have all permissions
  if (user.is_staff) return true;

  // Check if user has specific permission
  // This is a simplified implementation - in a real app, you might check
  // against a permissions array or make an API call
  return false;
};
