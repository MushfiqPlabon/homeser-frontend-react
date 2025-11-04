/**
 * Shared utilities for cart-related functionality
 */

/**
 * Creates a Map from cart items for O(1) lookups by service ID.
 *
 * @param {Array} items - Array of cart items
 * @returns {Map} - Map with service IDs as keys and cart items as values
 */
export const createCartMap = (items) => {
  const map = new Map();
  items?.forEach((item) => {
    map.set(item.service.id, item);
  });
  return map;
};

/**
 * Checks if a service is in the cart using the cart map
 *
 * @param {Map} cartMap - Map of cart items
 * @param {number} serviceId - ID of the service to check
 * @returns {boolean} - True if service is in cart, false otherwise
 */
export const isInCart = (cartMap, serviceId) => {
  return cartMap.has(serviceId);
};

/**
 * Gets the quantity of a service in the cart
 *
 * @param {Map} cartMap - Map of cart items
 * @param {number} serviceId - ID of the service
 * @returns {number} - Quantity of the service in cart, or 0 if not present
 */
export const getItemQuantity = (cartMap, serviceId) => {
  const item = cartMap.get(serviceId);
  return item ? item.quantity : 0;
};

/**
 * Gets a cart item by service ID
 *
 * @param {Map} cartMap - Map of cart items
 * @param {number} serviceId - ID of the service
 * @returns {Object} - Cart item, or undefined if not present
 */
export const getCartItem = (cartMap, serviceId) => {
  return cartMap.get(serviceId);
};
