import { useDispatch } from "react-redux";
import { extendedApiSlice } from "../store/extendedApiSlice"; // For other operations

export const useWebSocketRTKSync = () => {
  const dispatch = useDispatch();

  const updateOrderInCache = (orderData) => {
    // Update the specific order in the cache
    dispatch(
      extendedApiSlice.util.updateQueryData(
        "getAdminOrders", // update all orders query
        undefined,
        (draft) => {
          const orderIndex = draft.findIndex(
            (order) => order.id === orderData.order_id,
          );
          if (orderIndex !== -1) {
            draft[orderIndex] = { ...draft[orderIndex], ...orderData };
          }
          return draft;
        },
      ),
    );

    // Also update user orders if applicable
    dispatch(
      extendedApiSlice.util.updateQueryData(
        "getUserOrders",
        undefined,
        (draft) => {
          const orderIndex = draft.findIndex(
            (order) => order.id === orderData.order_id,
          );
          if (orderIndex !== -1) {
            draft[orderIndex] = { ...draft[orderIndex], ...orderData };
          }
          return draft;
        },
      ),
    );
  };

  const updatePaymentInCache = (_paymentData) => {
    // Update payment-related data in cache if needed
    // Implementation depends on payment-related queries
  };

  const updateReviewInCache = (reviewData) => {
    // Update specific review in cache
    if (reviewData.service_id) {
      dispatch(
        extendedApiSlice.util.updateQueryData(
          "getServiceReviews",
          { id: reviewData.service_id }, // Assuming serviceId is needed as param
          (draft) => {
            // Update or add the review in the list
            const reviewIndex = draft.findIndex(
              (review) => review.id === reviewData.review_id,
            );
            if (reviewIndex !== -1) {
              draft[reviewIndex] = { ...draft[reviewIndex], ...reviewData };
            } else {
              // If not found, append to list (for new reviews)
              draft.push(reviewData);
            }
            return draft;
          },
        ),
      );
    }
  };

  return {
    updateOrderInCache,
    updatePaymentInCache,
    updateReviewInCache,
  };
};
