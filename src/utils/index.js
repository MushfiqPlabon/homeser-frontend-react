// Unified exports for all utility functions

export {
  createCartMap,
  isInCart,
  getItemQuantity,
  getCartItem,
} from "./cartUtils";
export {
  useDebouncedValue,
  useDebouncedCallback,
  useDebouncedSearch,
  debounce,
  throttle,
  useDebouncedQuery,
  DebouncedSearchInput,
  withDebouncedSearch,
} from "./consolidatedDebounce";
export { validateContract } from "./contractValidation";
export { handleError, handleAsyncOperation } from "./errorHandler";
export {
  optimizeImage,
  compressImage,
  validateImage,
  getFallbackImage,
  generatePlaceholderImage,
} from "./imageUtils";
export {
  sanitizeInput,
  sanitizeHTML,
  escapeHtml,
  sanitizeUrl,
} from "./inputSanitization";
export {
  measurePerformance,
  logPerformance,
  trackComponentRender,
  trackApiCall,
  getPerformanceMetrics,
} from "./performanceMonitoring";
export {
  cn,
  formatDate,
  formatCurrency,
  truncateText,
  generateId,
  renderStars,
} from "./uiUtils";
export { showSuccess, showError, showWarning, showInfo } from "./userFeedback";
