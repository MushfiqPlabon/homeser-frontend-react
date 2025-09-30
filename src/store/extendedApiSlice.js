import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Determine the base URL for API requests
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Create API slice for extended functionality
export const extendedApiSlice = createApi({
  reducerPath: "extendedApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // Get token from localStorage (matching existing auth pattern)
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
  ],
  endpoints: (builder) => ({
    // Extended Services Endpoints
    getExtendedServices: builder.query({
      query: (params) => ({
        url: "/ext/services/",
        params,
      }),
      providesTags: ["ExtendedService"],
    }),

    getExtendedService: builder.query({
      query: (id) => `/ext/services/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "ExtendedService", id }],
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
  }),
});

// Export hooks for all endpoints
export const {
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

  // Reviews
  useGetReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  usePartialUpdateReviewMutation,
  useDeleteReviewMutation,

  // Admin
  usePromoteUserMutation,
  useGetAdminUsersQuery,
  useGetAdminUserQuery,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,

  // Orders
  useGetAdminOrdersQuery,
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
} = extendedApiSlice;
