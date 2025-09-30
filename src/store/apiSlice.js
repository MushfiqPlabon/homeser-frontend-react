import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Determine the base URL for API requests
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Create API slice for cart operations
export const apiSlice = createApi({
  reducerPath: "api",
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
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // Get cart endpoint
    getCart: builder.query({
      query: () => "/cart/",
      providesTags: ["Cart"],
    }),

    // Add to cart endpoint with optimistic update
    addToCart: builder.mutation({
      query: ({ serviceId, quantity }) => ({
        url: "/cart/add/",
        method: "POST",
        body: { service_id: serviceId, qty: quantity },
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(
        { serviceId, quantity = 1, service },
        { dispatch, queryFulfilled },
      ) {
        // Optimistic update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
            const existingItemIndex = draft.items.findIndex(
              (item) => item.service.id === serviceId,
            );

            if (existingItemIndex >= 0) {
              // Update existing item
              draft.items[existingItemIndex].quantity += quantity;
              draft.items[existingItemIndex].total_price =
                draft.items[existingItemIndex].quantity *
                draft.items[existingItemIndex].price;
            } else {
              // Add new item
              draft.items.push({
                id: Date.now(), // Temporary ID
                service: service,
                quantity: quantity,
                price: service.price,
                total_price: service.price * quantity,
              });
            }

            // Recalculate totals
            draft.subtotal = draft.items.reduce(
              (sum, item) => sum + item.quantity * item.price,
              0,
            );
            draft.tax = draft.subtotal * 0.05;
            draft.total = draft.subtotal + draft.tax;
          }),
        );

        // Handle rollback if mutation fails
        try {
          await queryFulfilled;
        } catch (_error) {
          patchResult.undo();
        }
      },
    }),

    // Remove from cart endpoint with optimistic update
    removeFromCart: builder.mutation({
      query: (serviceId) => ({
        url: "/cart/remove/",
        method: "POST",
        body: { service_id: serviceId },
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(serviceId, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items = draft.items.filter(
              (item) => item.service.id !== serviceId,
            );

            // Recalculate totals
            draft.subtotal = draft.items.reduce(
              (sum, item) => sum + item.quantity * item.price,
              0,
            );
            draft.tax = draft.subtotal * 0.05;
            draft.total = draft.subtotal + draft.tax;
          }),
        );

        // Handle rollback if mutation fails
        try {
          await queryFulfilled;
        } catch (_error) {
          patchResult.undo();
        }
      },
    }),

    // Update cart item quantity endpoint with optimistic update
    updateCartItemQuantity: builder.mutation({
      query: ({ serviceId, quantity }) => ({
        url: "/cart/update-quantity/",
        method: "POST",
        body: { service_id: serviceId, qty: quantity },
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(
        { serviceId, quantity },
        { dispatch, queryFulfilled },
      ) {
        // Optimistic update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
            const existingItemIndex = draft.items.findIndex(
              (item) => item.service.id === serviceId,
            );

            if (existingItemIndex >= 0) {
              // Update existing item quantity
              draft.items[existingItemIndex].quantity = quantity;
              draft.items[existingItemIndex].total_price =
                draft.items[existingItemIndex].quantity *
                draft.items[existingItemIndex].price;

              // Recalculate totals
              draft.subtotal = draft.items.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0,
              );
              draft.tax = draft.subtotal * 0.05;
              draft.total = draft.subtotal + draft.tax;
            }
          }),
        );

        // Handle rollback if mutation fails
        try {
          await queryFulfilled;
        } catch (_error) {
          patchResult.undo();
        }
      },
    }),

    // Checkout endpoint
    checkout: builder.mutation({
      query: (checkoutData) => ({
        url: "/checkout/",
        method: "POST",
        body: checkoutData,
      }),
    }),

    // User orders endpoint
    getUserOrders: builder.query({
      query: () => "/user/orders/",
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemQuantityMutation,
  useCheckoutMutation,
  useGetUserOrdersQuery,
} = apiSlice;
