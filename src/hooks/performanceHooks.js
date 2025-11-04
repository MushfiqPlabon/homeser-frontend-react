import { useMemo } from "react";

// Debounce function for search optimization
export const useDebounce = (callback, delay) => {
  const debouncedCallback = useMemo(() => {
    let timeoutId;

    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    };
  }, [callback, delay]);

  return debouncedCallback;
};

// Memoized search filter function
export const useSearchFilter = (services, searchTerm) => {
  return useMemo(() => {
    if (!searchTerm) return services;

    const searchLower = searchTerm.toLowerCase();
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchLower) ||
        service.short_desc?.toLowerCase().includes(searchLower) ||
        service.category?.name?.toLowerCase().includes(searchLower),
    );
  }, [services, searchTerm]);
};

// Memoized hash map for O(1) lookups
export const useServicesMap = (services) => {
  return useMemo(() => {
    const map = new Map();
    services.forEach((service) => {
      map.set(service.id, service);
      map.set(service.name.toLowerCase(), service);
    });
    return map;
  }, [services]);
};

// Memoized category grouping for O(1) lookups
export const useCategoryMap = (services) => {
  return useMemo(() => {
    const map = new Map();
    services.forEach((service) => {
      const category = service.category?.name || "uncategorized";
      if (!map.has(category)) {
        map.set(category, []);
      }
      map.get(category).push(service);
    });
    return map;
  }, [services]);
};
