import { store } from "../store";
import { extendedApiSlice } from "../store/extendedApiSlice";

// Service to handle WebSocket to RTK Query cache synchronization
export const webSocketCacheSync = {
  handleOrderUpdate: (orderData) => {
    const { dispatch } = store;

    // Update the specific order in any cached order lists
    dispatch(
      extendedApiSlice.util.updateQueryData(
        "getUserOrders",
        undefined,
        (draft) => {
          const orderIndex = draft.findIndex(
            (order) => order.id === orderData.order_id,
          );
          if (orderIndex !== -1) {
            draft[orderIndex] = {
              ...draft[orderIndex],
              status: orderData.status,
              payment_status: orderData.payment_status,
              updated_at: orderData.timestamp,
            };
          }
          return draft;
        },
      ),
    );

    // Also update admin orders if applicable
    dispatch(
      extendedApiSlice.util.updateQueryData(
        "getAdminOrders",
        undefined,
        (draft) => {
          const orderIndex = draft.findIndex(
            (order) => order.id === orderData.order_id,
          );
          if (orderIndex !== -1) {
            draft[orderIndex] = {
              ...draft[orderIndex],
              status: orderData.status,
              payment_status: orderData.payment_status,
              updated_at: orderData.timestamp,
            };
          }
          return draft;
        },
      ),
    );

    // If the specific order query exists, update that too
    dispatch(
      extendedApiSlice.util.updateQueryData(
        "getAdminOrder", // Assuming this exists for a specific order
        { id: orderData.order_id },
        (draft) => {
          return {
            ...draft,
            status: orderData.status,
            payment_status: orderData.payment_status,
            updated_at: orderData.timestamp,
          };
        },
      ),
    );
  },

  handlePaymentUpdate: (_paymentData) => {
    // Update payment-related cached data
    // Implementation depends on payment-specific queries
  },

  handleReviewUpdate: (reviewData) => {
    const { dispatch } = store;

    // Update the reviews list for the specific service
    if (reviewData.service_id) {
      dispatch(
        extendedApiSlice.util.updateQueryData(
          "getServiceReviews",
          { id: reviewData.service_id },
          (draft) => {
            // Find and update the specific review in the list
            const reviewIndex = draft.findIndex(
              (review) => review.id === reviewData.review_id,
            );
            if (reviewIndex !== -1) {
              draft[reviewIndex] = { ...draft[reviewIndex], ...reviewData };
            } else {
              // If it's a new review, add it to the list
              draft.push(reviewData);
            }
            return draft;
          },
        ),
      );
    }
  },
};
