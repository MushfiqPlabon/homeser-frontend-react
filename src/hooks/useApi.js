import {
  adminAPI,
  categoriesAPI,
  ordersAPI,
  paymentAPI,
  reviewsAPI,
  searchAPI,
  servicesAPI,
  usersAPI,
} from "../utils/api";
import { useApi, useSubmit } from "./useGenericApi";

// Search Hooks
export const useAdvancedSearch = (params, options) =>
  useApi(
    ["advancedSearch", params],
    () => searchAPI.advancedSearch(params),
    options,
  );

export const useSearchAnalytics = (params, options) =>
  useApi(
    ["searchAnalytics", params],
    () => searchAPI.getAnalytics(params),
    options,
  );

export const usePopularSearches = (params, options) =>
  useApi(
    ["popularSearches", params],
    () => searchAPI.getPopularSearches(params),
    options,
  );

// Review Hooks
export const useReview = (reviewId, options) =>
  useApi(["review", reviewId], () => reviewsAPI.getReview(reviewId), {
    enabled: !!reviewId,
    ...options,
  });

export const useCreateReview = (options) =>
  useSubmit(
    ({ serviceId, reviewData }) =>
      reviewsAPI.createReview(serviceId, reviewData),
    ["reviews"],
    options,
  );

export const useUpdateReview = (options) =>
  useSubmit(
    ({ reviewId, reviewData }) => reviewsAPI.updateReview(reviewId, reviewData),
    ["reviews"],
    options,
  );

export const useDeleteReview = (options) =>
  useSubmit(
    (reviewId) => reviewsAPI.deleteReview(reviewId),
    ["reviews"],
    options,
  );

// Service Hooks
export const useServices = (params, options) =>
  useApi(["services", params], () => servicesAPI.getServices(params), options);

export const useService = (id, options) =>
  useApi(["service", id], () => servicesAPI.getService(id), {
    enabled: !!id,
    ...options,
  });

export const useServiceReviews = (serviceId, options) =>
  useApi(
    ["serviceReviews", serviceId],
    () => servicesAPI.getServiceReviews(serviceId),
    { enabled: !!serviceId, ...options },
  );

// Order Hooks
export const useOrders = (params, options) =>
  useApi(["orders", params], () => ordersAPI.getOrders(params), options);

export const useUserOrders = (options) =>
  useApi(["userOrders"], () => ordersAPI.getUserOrders(), options);

// User Hooks
export const useUsers = (params, options) =>
  useApi(["users", params], () => usersAPI.getUsers(params), options);

// Category Hooks
export const useCategories = (options) =>
  useApi(["categories"], () => categoriesAPI.getCategories(), options);

// Admin Hooks
export const useAdminServices = (params, options) =>
  useApi(
    ["adminServices", params],
    () => adminAPI.getServices(params),
    options,
  );

export const useCreateService = (options) =>
  useSubmit(
    (serviceData) => adminAPI.createService(serviceData),
    ["adminServices", "services"],
    options,
  );

export const useUpdateService = (options) =>
  useSubmit(
    ({ serviceId, serviceData }) =>
      adminAPI.updateService(serviceId, serviceData),
    ["adminServices", "services"],
    options,
  );

export const useDeleteService = (options) =>
  useSubmit(
    (serviceId) => adminAPI.deleteService(serviceId),
    ["adminServices", "services"],
    options,
  );

// Extended Services Hooks (using RTK Query)
import {
  useCreateExtendedServiceMutation,
  useDeleteExtendedServiceMutation,
  useGetExtendedServiceQuery,
  useGetExtendedServicesQuery,
  useUpdateExtendedServiceMutation,
} from "../store/extendedApiSlice";

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
import {
  useCreateExtendedCategoryMutation,
  useDeleteExtendedCategoryMutation,
  useGetExtendedCategoriesQuery,
  useGetExtendedCategoryQuery,
  useUpdateExtendedCategoryMutation,
} from "../store/extendedApiSlice";

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
import {
  useDeleteAdminUserMutation,
  useGetAdminUserQuery,
  useGetAdminUsersQuery,
  usePromoteUserMutation,
  useUpdateAdminUserMutation,
} from "../store/extendedApiSlice";

export const useAdminUsers = (options) =>
  useGetAdminUsersQuery(undefined, options);

export const useAdminUser = (id, options) => useGetAdminUserQuery(id, options);

export const useUpdateAdminUser = (options) =>
  useUpdateAdminUserMutation(options);

export const useDeleteAdminUser = (options) =>
  useDeleteAdminUserMutation(options);

export const usePromoteUser = (options) => usePromoteUserMutation(options);

// Admin Order Management Hooks (using RTK Query)
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../store/extendedApiSlice";

export const useAdminOrders = (options) =>
  useGetAdminOrdersQuery(undefined, options);

export const useUpdateOrderStatus = (options) =>
  useUpdateOrderStatusMutation(options);

// Payment Management Hooks (using RTK Query)
import {
  useGetPaymentAnalyticsQuery,
  useInitiateDisputeMutation,
  useInitiateRefundMutation,
} from "../store/extendedApiSlice";

export const usePaymentAnalyticsRTK = (params, options) =>
  useGetPaymentAnalyticsQuery(params, options);

export const useInitiateRefundRTK = (options) =>
  useInitiateRefundMutation(options);

export const useInitiateDisputeRTK = (options) =>
  useInitiateDisputeMutation(options);

// Search Management Hooks (using RTK Query)
import {
  useAdvancedSearchQuery,
  useGetPopularSearchesQuery,
  useGetSearchAnalyticsQuery,
} from "../store/extendedApiSlice";

export const useAdvancedSearchRTK = (params, options) =>
  useAdvancedSearchQuery(params, options);

export const useSearchAnalyticsRTK = (params, options) =>
  useGetSearchAnalyticsQuery(params, options);

export const usePopularSearchesRTK = (params, options) =>
  useGetPopularSearchesQuery(params, options);


