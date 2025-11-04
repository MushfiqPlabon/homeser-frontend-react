// Redirecting to consolidated debounce utilities for consistency
// This ensures all debouncing functionality comes from one centralized source

import {
  useDebouncedValue,
  useDebouncedCallback,
  useDebouncedSearch,
  debounce,
  throttle,
  useDebouncedQuery,
  DebouncedSearchInput,
  withDebouncedSearch,
} from "./consolidatedDebounce";

// Re-export all functions to maintain backward compatibility
export {
  useDebouncedValue,
  useDebouncedCallback,
  useDebouncedSearch,
  debounce,
  throttle,
  useDebouncedQuery,
  DebouncedSearchInput,
  withDebouncedSearch,
};

// For backward compatibility with the old useDebouncedValue named differently in some places
export { useDebouncedValue as useDebounceValue };
