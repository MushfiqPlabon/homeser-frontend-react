import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithToastsAndNotifications } from "./baseQueryWithToasts";

// Create API slice with optimized caching
export const extendedApiSlice = createApi({
  reducerPath: "extendedApi",
  baseQuery: baseQueryWithToastsAndNotifications,
  tagTypes: [
    "Service",
    "ExtendedService",
    "Category",
    "ExtendedCategory",
    "Review",
    "User",
    "Order",
    "Payment",
    "Search",
    "Settings",
  ],
  // Global cache configuration
  keepUnusedDataFor: 60, // 1 minute default
  endpoints: (builder) => ({
    // Static data - long cache
    getExtendedServices: builder.query({
      query: (params) => ({
        url: "/ext/services/",
        params,
      }),
      providesTags: ["ExtendedService"],
      keepUnusedDataFor: 300, // 5 minutes for services list
    }),

    getExtendedService: builder.query({
      query: (id) => `/ext/services/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "ExtendedService", id }],
      keepUnusedDataFor: 300, // 5 minutes for individual service
    }),

    createExtendedService: builder.mutation({
      query: (serviceData) => ({
        url: "/ext/services/",
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: ["ExtendedService", "Service"],
    }),

    updateExtendedService: builder.mutation({
      query: ({ id, serviceData }) => ({
        url: `/ext/services/${id}/`,
        method: "PUT",
        body: serviceData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ExtendedService", id },
        "ExtendedService",
      ],
    }),

    partialUpdateExtendedService: builder.mutation({
      query: ({ id, serviceData }) => ({
        url: `/ext/services/${id}/`,
        method: "PATCH",
        body: serviceData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ExtendedService", id },
        "ExtendedService",
      ],
    }),

    deleteExtendedService: builder.mutation({
      query: (id) => ({
        url: `/ext/services/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExtendedService", "Service"],
    }),

    // Services Endpoints
    getServices: builder.query({
      query: (params) => ({
        url: "/services/",
        params,
      }),
      providesTags: ["Service"],
    }),

    getService: builder.query({
      query: (id) => `/services/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Service", id }],
    }),

    createService: builder.mutation({
      query: (serviceData) => ({
        url: "/services/",
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: ["Service"],
    }),

    updateService: builder.mutation({
      query: ({ id, serviceData }) => ({
        url: `/services/${id}/`,
        method: "PUT",
        body: serviceData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id },
        "Service",
      ],
    }),

    partialUpdateService: builder.mutation({
      query: ({ id, serviceData }) => ({
        url: `/services/${id}/`,
        method: "PATCH",
        body: serviceData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id },
        "Service",
      ],
    }),

    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),

    // Service Provider Services Endpoints
    getServiceProviderServices: builder.query({
      query: (params) => ({
        url: "/provider/services/",
        params,
      }),
      providesTags: ["Service"],
    }),

    getServiceProviderService: builder.query({
      query: (id) => `/provider/services/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Service", id }],
    }),

    createServiceProviderService: builder.mutation({
      query: (serviceData) => ({
        url: "/provider/services/",
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: ["Service"],
    }),

    updateServiceProviderService: builder.mutation({
      query: ({ id, serviceData }) => ({
        url: `/provider/services/${id}/`,
        method: "PUT",
        body: serviceData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id },
        "Service",
      ],
    }),

    partialUpdateServiceProviderService: builder.mutation({
      query: ({ id, serviceData }) => ({
        url: `/provider/services/${id}/`,
        method: "PATCH",
        body: serviceData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id },
        "Service",
      ],
    }),

    deleteServiceProviderService: builder.mutation({
      query: (id) => ({
        url: `/provider/services/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),

    // Service Reviews Endpoints
    getServiceReviews: builder.query({
      query: (serviceId) => `/services/${serviceId}/reviews/`,
      providesTags: (_result, _error, serviceId) => [
        { type: "Review", id: `SERVICE_REVIEWS_${serviceId}` },
        "Review",
      ],
    }),

    createServiceReview: builder.mutation({
      query: ({ serviceId, reviewData }) => ({
        url: `/services/${serviceId}/reviews/`,
        method: "POST",
        body: reviewData,
      }),
      onQueryStarted: async (
        { serviceId, reviewData },
        { dispatch, queryFulfilled },
      ) => {
        // Optimistically update the cache
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getServiceReviews",
            serviceId,
            (draft) => {
              // Add the new review with a temporary ID
              draft.unshift({
                id: Date.now(), // temporary ID
                ...reviewData,
                user: {
                  id: reviewData.user_id || null,
                  username: reviewData.username || "Current User",
                  first_name: reviewData.first_name || "",
                },
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                isOptimistic: true, // flag to identify optimistic update
              });
            },
          ),
        );

        try {
          const result = await queryFulfilled;
          // Update the cache with the server response
          dispatch(
            extendedApiSlice.util.updateQueryData(
              "getServiceReviews",
              serviceId,
              (draft) => {
                const optimisticReviewIndex = draft.findIndex(
                  (review) => review.isOptimistic,
                );
                if (optimisticReviewIndex !== -1) {
                  // Replace the optimistic review with the server response
                  draft[optimisticReviewIndex] = {
                    ...draft[optimisticReviewIndex],
                    ...result.data,
                    isOptimistic: false, // remove the optimistic flag
                  };
                }
              },
            ),
          );
        } catch (_error) {
          // Undo the optimistic update if the mutation fails
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { serviceId }) => [
        { type: "Review", id: `SERVICE_REVIEWS_${serviceId}` },
        "Review",
      ],
    }),

    updateServiceReview: builder.mutation({
      query: ({ reviewId, /* serviceId, */ reviewData }) => ({
        url: `/reviews/${reviewId}/`,
        method: "PUT",
        body: reviewData,
      }),
      onQueryStarted: async (
        { reviewId, serviceId, reviewData },
        { dispatch, queryFulfilled },
      ) => {
        // Optimistically update the cache
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getServiceReviews",
            serviceId,
            (draft) => {
              const reviewIndex = draft.findIndex(
                (review) => review.id === reviewId,
              );
              if (reviewIndex !== -1) {
                draft[reviewIndex] = {
                  ...draft[reviewIndex],
                  ...reviewData,
                  updated: new Date().toISOString(),
                };
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (_error) {
          // Undo the optimistic update if the mutation fails
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { serviceId }) => [
        { type: "Review", id: `SERVICE_REVIEWS_${serviceId}` },
        "Review",
      ],
    }),

    partialUpdateServiceReview: builder.mutation({
      query: ({ reviewId, /* serviceId, */ reviewData }) => ({
        url: `/reviews/${reviewId}/`,
        method: "PATCH",
        body: reviewData,
      }),
      invalidatesTags: (_result, _error, { serviceId }) => [
        { type: "Review", id: `SERVICE_REVIEWS_${serviceId}` },
        "Review",
      ],
    }),

    deleteServiceReview: builder.mutation({
      query: ({ reviewId /* serviceId */ }) => ({
        url: `/reviews/${reviewId}/`,
        method: "DELETE",
      }),
      onQueryStarted: async (
        { reviewId, serviceId },
        { dispatch, queryFulfilled },
      ) => {
        // Optimistically update the cache
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getServiceReviews",
            serviceId,
            (draft) => {
              const reviewIndex = draft.findIndex(
                (review) => review.id === reviewId,
              );
              if (reviewIndex !== -1) {
                draft.splice(reviewIndex, 1); // Remove the review
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (_error) {
          // Undo the optimistic update if the mutation fails
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { serviceId }) => [
        { type: "Review", id: `SERVICE_REVIEWS_${serviceId}` },
        "Review",
      ],
    }),

    // Extended Categories Endpoints
    getExtendedCategories: builder.query({
      query: () => "/ext/categories/",
      providesTags: ["ExtendedCategory"],
    }),

    getExtendedCategory: builder.query({
      query: (id) => `/ext/categories/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "ExtendedCategory", id }],
    }),

    createExtendedCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/ext/categories/",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["ExtendedCategory", "Category"],
    }),

    updateExtendedCategory: builder.mutation({
      query: ({ id, categoryData }) => ({
        url: `/ext/categories/${id}/`,
        method: "PUT",
        body: categoryData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ExtendedCategory", id },
        "ExtendedCategory",
      ],
    }),

    partialUpdateExtendedCategory: builder.mutation({
      query: ({ id, categoryData }) => ({
        url: `/ext/categories/${id}/`,
        method: "PATCH",
        body: categoryData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ExtendedCategory", id },
        "ExtendedCategory",
      ],
    }),

    deleteExtendedCategory: builder.mutation({
      query: (id) => ({
        url: `/ext/categories/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExtendedCategory", "Category"],
    }),

    // Review Endpoints
    getReviews: builder.query({
      query: () => "/admin/reviews/",
      providesTags: ["Review"],
    }),

    getReview: builder.query({
      query: (id) => `/reviews/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Review", id }],
    }),

    createReview: builder.mutation({
      query: ({ serviceId, reviewData }) => ({
        url: `/services/${serviceId}/reviews/`,
        method: "POST",
        body: reviewData,
      }),
      onQueryStarted: async (
        { serviceId, reviewData },
        { dispatch, queryFulfilled },
      ) => {
        // Optimistically update the cache
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getServiceReviews",
            serviceId,
            (draft) => {
              // Add the new review with a temporary ID
              draft.unshift({
                id: Date.now(), // temporary ID
                ...reviewData,
                user: {
                  id: reviewData.user_id || null,
                  username: reviewData.username || "Current User",
                  first_name: reviewData.first_name || "",
                },
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                isOptimistic: true, // flag to identify optimistic update
              });
            },
          ),
        );

        try {
          const result = await queryFulfilled;
          // Update the cache with the server response
          dispatch(
            extendedApiSlice.util.updateQueryData(
              "getServiceReviews",
              serviceId,
              (draft) => {
                const optimisticReviewIndex = draft.findIndex(
                  (review) => review.isOptimistic,
                );
                if (optimisticReviewIndex !== -1) {
                  // Replace the optimistic review with the server response
                  draft[optimisticReviewIndex] = {
                    ...draft[optimisticReviewIndex],
                    ...result.data,
                    isOptimistic: false, // remove the optimistic flag
                  };
                }
              },
            ),
          );
        } catch (_error) {
          // Undo the optimistic update if the mutation fails
          patchResult.undo();
        }
      },
      invalidatesTags: ["Review"],
    }),

    updateReview: builder.mutation({
      query: ({ id, reviewData }) => ({
        url: `/reviews/${id}/`,
        method: "PUT",
        body: reviewData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Review", id },
        "Review",
      ],
    }),

    partialUpdateReview: builder.mutation({
      query: ({ id, reviewData }) => ({
        url: `/reviews/${id}/`,
        method: "PATCH",
        body: reviewData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Review", id },
        "Review",
      ],
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),

    // Admin Endpoints
    promoteUser: builder.mutation({
      query: (userId) => ({
        url: "/admin/promote/",
        method: "POST",
        body: { user_id: userId },
      }),
      invalidatesTags: ["User"],
    }),

    getAdminUsers: builder.query({
      query: () => "/admin/users/",
      providesTags: ["User"],
    }),

    getAdminUser: builder.query({
      query: (id) => `/admin/users/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    updateAdminUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/admin/users/${id}/`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),

    deleteAdminUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Order Endpoints
    getAdminOrders: builder.query({
      query: () => "/admin/orders/",
      providesTags: ["Order"],
    }),

    getUserOrders: builder.query({
      query: () => "/user/orders/",
      providesTags: ["Order"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, statusData }) => ({
        url: `/admin/orders/${id}/status/`,
        method: "POST",
        body: statusData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        "Order",
      ],
    }),

    // Payment Endpoints
    handlePaymentIPN: builder.mutation({
      query: (data) => ({
        url: "/payments/ipn/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),

    // Search Endpoints
    advancedSearch: builder.query({
      query: (params) => ({
        url: "/search/advanced/",
        params,
      }),
      providesTags: ["Search"],
    }),

    getSearchAnalytics: builder.query({
      query: (params) => ({
        url: "/search/analytics/",
        params,
      }),
      providesTags: ["Search"],
    }),

    getPopularSearches: builder.query({
      query: (params) => ({
        url: "/search/popular/",
        params,
      }),
      providesTags: ["Search"],
    }),

    // Email Analytics Endpoints
    getEmailStats: builder.query({
      query: (params) => ({
        url: "/analytics/email/",
        params,
      }),
      providesTags: ["Payment"], // Using same tag as other analytics
    }),

    // Sentiment Analytics Endpoints
    getSentimentStats: builder.query({
      query: (params) => ({
        url: "/analytics/sentiment/",
        params,
      }),
      providesTags: ["Review"], // Using same tag as other review-related data
    }),

    // Payment Analytics Endpoints
    getPaymentAnalytics: builder.query({
      query: (params) => ({
        url: "/payments/analytics/",
        params,
      }),
      providesTags: ["Payment"],
    }),

    // Settings Management Endpoints
    getSettings: builder.query({
      query: () => "/settings/",
      providesTags: ["Settings"],
    }),

    updateSettings: builder.mutation({
      query: (settingsData) => ({
        url: "/settings/",
        method: "PUT",
        body: settingsData,
      }),
      invalidatesTags: ["Settings"],
    }),

    clearCache: builder.mutation({
      query: () => ({
        url: "/settings/cache/clear/",
        method: "POST",
      }),
      invalidatesTags: ["Settings"],
    }),

    // Payment Refund Endpoints
    initiateRefund: builder.mutation({
      query: ({ paymentId, reason }) => ({
        url: `/payments/refund/${paymentId}/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Payment"],
    }),

    // Payment Dispute Endpoints
    initiateDispute: builder.mutation({
      query: ({ paymentId, reason }) => ({
        url: `/payments/dispute/${paymentId}/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

// Export hooks for all endpoints
export const {
  // Services
  useGetServicesQuery,
  useGetServiceQuery,
  useGetServiceReviewsQuery,
  useCreateServiceReviewMutation,

  // Categories
  useGetCategoriesQuery,

  // Users
  useGetUsersQuery,
  useGetAdminUserQuery,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,

  // Reviews
  useGetReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  usePartialUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetUserReviewsQuery,

  // Extended Services
  useGetExtendedServicesQuery,
  useGetExtendedServiceQuery,
  useCreateExtendedServiceMutation,
  useUpdateExtendedServiceMutation,
  usePartialUpdateExtendedServiceMutation,
  useDeleteExtendedServiceMutation,

  // Extended Categories
  useGetExtendedCategoriesQuery,
  useGetExtendedCategoryQuery,
  useCreateExtendedCategoryMutation,
  useUpdateExtendedCategoryMutation,
  usePartialUpdateExtendedCategoryMutation,
  useDeleteExtendedCategoryMutation,

  // Admin
  usePromoteUserMutation,
  useGetAdminUsersQuery,

  // Orders
  useGetAdminOrdersQuery,
  useGetUserOrdersQuery,
  useUpdateOrderStatusMutation,

  // Payments
  useHandlePaymentIPNMutation,
  useGetPaymentAnalyticsQuery,
  useInitiateRefundMutation,
  useInitiateDisputeMutation,

  // Search
  useAdvancedSearchQuery,
  useGetSearchAnalyticsQuery,
  useGetPopularSearchesQuery,

  // Email Analytics
  useGetEmailStatsQuery,

  // Sentiment Analytics
  useGetSentimentStatsQuery,

  // Settings Management
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useClearCacheMutation,

  // Service Provider API hooks
  useGetServiceProviderServicesQuery,
  useGetServiceProviderServiceQuery,
  useCreateServiceProviderServiceMutation,
  useUpdateServiceProviderServiceMutation,
  usePartialUpdateServiceProviderServiceMutation,
  useDeleteServiceProviderServiceMutation,
} = extendedApiSlice;
