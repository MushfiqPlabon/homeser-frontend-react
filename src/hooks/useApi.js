// Import all RTK Query hooks from extendedApiSlice in a single statement
import {
  useAdvancedSearchQuery,
  useCreateExtendedCategoryMutation,
  useCreateExtendedServiceMutation,
  useCreateReviewMutation,
  useDeleteExtendedCategoryMutation,
  useDeleteExtendedServiceMutation,
  useDeleteReviewMutation,
  useGetAdminOrdersQuery,
  useGetAdminUserQuery,
  useGetAdminUsersQuery,
  useGetCategoriesQuery,
  useGetExtendedCategoriesQuery,
  useGetExtendedCategoryQuery,
  useGetExtendedServiceQuery,
  useGetExtendedServicesQuery,
  useGetPaymentAnalyticsQuery,
  useGetPopularSearchesQuery,
  useGetReviewQuery,
  useGetSearchAnalyticsQuery,
  useGetServiceQuery,
  useGetServiceReviewsQuery,
  useGetServicesQuery,
  useGetUserOrdersQuery,
  useGetUsersQuery,
  useInitiateDisputeMutation,
  useInitiateRefundMutation,
  usePromoteUserMutation,
  useUpdateAdminUserMutation,
  useUpdateExtendedCategoryMutation,
  useUpdateExtendedServiceMutation,
  useUpdateOrderStatusMutation,
  useUpdateReviewMutation,
} from "../store/extendedApiSlice";

// Search Hooks
export const useAdvancedSearch = (params, options) =>
  useAdvancedSearchQuery(params, options);

export const useSearchAnalytics = (params, options) =>
  useGetSearchAnalyticsQuery(params, options);

export const usePopularSearches = (params, options) =>
  useGetPopularSearchesQuery(params, options);

// Review Hooks
export const useReview = (reviewId, options) =>
  useGetReviewQuery(reviewId, {
    enabled: !!reviewId,
    ...options,
  });

export const useCreateReview = (options) => useCreateReviewMutation(options);

export const useUpdateReview = (options) => useUpdateReviewMutation(options);

export const useDeleteReview = (options) => useDeleteReviewMutation(options);

// Service Hooks
export const useServices = (params, options) =>
  useGetServicesQuery(params, options);

export const useService = (id, options) =>
  useGetServiceQuery(id, {
    enabled: !!id,
    ...options,
  });

export const useServiceReviews = (serviceId, options) =>
  useGetServiceReviewsQuery(serviceId, {
    enabled: !!serviceId,
    ...options,
  });

// Order Hooks
export const useOrders = (params, options) =>
  useGetAdminOrdersQuery(params, options);

export const useUserOrders = (options) =>
  useGetUserOrdersQuery(undefined, options);

// User Hooks
export const useUsers = (params, options) => useGetUsersQuery(params, options);

// Category Hooks
export const useCategories = (options) =>
  useGetCategoriesQuery(undefined, options);

// Admin Hooks
export const useAdminServices = (params, options) =>
  useGetExtendedServicesQuery(params, options);

export const useCreateService = (options) =>
  useCreateExtendedServiceMutation(options);

export const useUpdateService = (options) =>
  useUpdateExtendedServiceMutation(options);

export const useDeleteService = (options) =>
  useDeleteExtendedServiceMutation(options);

// Extended Services Hooks (using RTK Query)
export const useExtendedServices = (params, options) =>
  useGetExtendedServicesQuery(params, options);

export const useExtendedService = (id, options) =>
  useGetExtendedServiceQuery(id, options);

export const useCreateExtendedService = (options) =>
  useCreateExtendedServiceMutation(options);

export const useUpdateExtendedService = (options) =>
  useUpdateExtendedServiceMutation(options);

export const useDeleteExtendedService = (options) =>
  useDeleteExtendedServiceMutation(options);

// Extended Categories Hooks (using RTK Query)
export const useExtendedCategories = (options) =>
  useGetExtendedCategoriesQuery(undefined, options);

export const useExtendedCategory = (id, options) =>
  useGetExtendedCategoryQuery(id, options);

export const useCreateExtendedCategory = (options) =>
  useCreateExtendedCategoryMutation(options);

export const useUpdateExtendedCategory = (options) =>
  useUpdateExtendedCategoryMutation(options);

export const useDeleteExtendedCategory = (options) =>
  useDeleteExtendedCategoryMutation(options);

// Admin User Management Hooks (using RTK Query)
export const useAdminUsers = (options) =>
  useGetAdminUsersQuery(undefined, options);

export const useAdminUser = (id, options) => useGetAdminUserQuery(id, options);

export const useUpdateAdminUser = (options) =>
  useUpdateAdminUserMutation(options);

export const useDeleteAdminUser = (options) =>
  useDeleteAdminUserMutation(options);

export const usePromoteUser = (options) => usePromoteUserMutation(options);

// Admin Order Management Hooks (using RTK Query)
export const useAdminOrders = (options) =>
  useGetAdminOrdersQuery(undefined, options);

export const useUpdateOrderStatus = (options) =>
  useUpdateOrderStatusMutation(options);

// Payment Management Hooks (using RTK Query)
export const usePaymentAnalyticsRTK = (params, options) =>
  useGetPaymentAnalyticsQuery(params, options);

export const useInitiateRefundRTK = (options) =>
  useInitiateRefundMutation(options);

export const useInitiateDisputeRTK = (options) =>
  useInitiateDisputeMutation(options);

// Search Management Hooks (using RTK Query)
export const useAdvancedSearchRTK = (params, options) =>
  useAdvancedSearchQuery(params, options);

export const useSearchAnalyticsRTK = (params, options) =>
  useGetSearchAnalyticsQuery(params, options);

export const usePopularSearchesRTK = (params, options) =>
  useGetPopularSearchesQuery(params, options);
