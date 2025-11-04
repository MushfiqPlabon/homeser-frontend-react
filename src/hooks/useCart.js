import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  apiSlice,
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemQuantityMutation,
} from "../store/apiSlice";
import { createCartMap } from "../utils/cartUtils";

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const {
    data: cart,
    isLoading,
    isError,
    error: apiError,
    refetch,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated, // Skip fetching cart if user is not authenticated
  });

  // Create cart map for O(1) lookups
  const cartMap = createCartMap(cart?.items);

  // API mutations for authenticated users only
  const [addToCartMutation] = useAddToCartMutation();
  const [removeFromCartMutation] = useRemoveFromCartMutation();
  const [updateCartItemQuantityMutation] = useUpdateCartItemQuantityMutation();

  /**
   * Add to cart with optimistic updates and micro-interactions.
   * Only available for authenticated users.
   */
  const addToCart = async (args) => {
    if (!isAuthenticated) {
      showToast("Please log in to add items to your cart", "info");
      return;
    }

    // Optimistic update with rollback capability
    const patchResult = dispatch(
      apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
        if (!draft.items) draft.items = [];

        const existingItemIndex = draft.items.findIndex(
          (item) => item.service.id === args.service_id,
        );

        if (existingItemIndex >= 0) {
          draft.items[existingItemIndex].quantity += args.qty || 1;
        } else {
          draft.items.push({
            service: { id: args.service_id },
            quantity: args.qty || 1,
            unit_price: "0.00",
            total_price: "0.00",
          });
        }

        draft.total_items = (draft.total_items || 0) + (args.qty || 1);
      }),
    );

    // Immediate success feedback (micro-interaction)
    showToast("Adding to cart...", "loading");

    try {
      const result = await addToCartMutation(args).unwrap();
      showToast("✓ Item added to cart successfully!", "success");
      return result;
    } catch (error) {
      // Rollback optimistic update
      patchResult.undo();

      // Enhanced error handling with retry option
      const errorMessage = error?.data?.detail || "Failed to add item to cart";
      showToast(`❌ ${errorMessage}`, "error", {
        action: {
          label: "Retry",
          onClick: () => addToCart(args),
        },
      });
      throw error;
    }
  };

  const removeFromCart = async (args) => {
    if (!isAuthenticated) {
      showToast("Please log in to manage your cart", "info");
      return;
    }

    dispatch(
      apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
        if (!draft.items) return;

        const itemIndex = draft.items.findIndex(
          (item) => item.service.id === args.service_id,
        );

        if (itemIndex >= 0) {
          const removedItem = draft.items[itemIndex];
          draft.items.splice(itemIndex, 1);
          draft.total_items = Math.max(
            0,
            (draft.total_items || 0) - removedItem.quantity,
          );
        }
      }),
    );

    try {
      const result = await removeFromCartMutation(args).unwrap();
      showToast("Item removed from cart", "success");
      return result;
    } catch (error) {
      dispatch(apiSlice.util.invalidateTags(["Cart"]));
      showToast(
        error?.data?.detail || "Failed to remove item from cart",
        "error",
      );
      throw error;
    }
  };

  const updateCartItemQuantity = async (args) => {
    if (!isAuthenticated) {
      showToast("Please log in to manage your cart", "info");
      return;
    }

    dispatch(
      apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
        if (!draft.items) return;

        const itemIndex = draft.items.findIndex(
          (item) => item.service.id === args.service_id,
        );

        if (itemIndex >= 0) {
          const originalQuantity = draft.items[itemIndex].quantity;
          const quantityDiff = args.qty - originalQuantity;

          draft.items[itemIndex].quantity = args.qty;
          draft.total_items = Math.max(
            0,
            (draft.total_items || 0) + quantityDiff,
          );
        }
      }),
    );

    try {
      const result = await updateCartItemQuantityMutation(args).unwrap();
      showToast("Cart updated successfully!", "success");
      return result;
    } catch (error) {
      dispatch(apiSlice.util.invalidateTags(["Cart"]));
      showToast(error?.data?.detail || "Failed to update cart", "error");
      throw error;
    }
  };

  const isInCart = (serviceId) => {
    return cartMap.has(serviceId);
  };

  const getItemQuantity = (serviceId) => {
    return cartMap.get(serviceId)?.quantity || 0;
  };

  const getCartTotals = () => {
    return {
      totalItems: cart?.total_items || 0,
      totalPrice: cart?.total_price || 0,
      itemCount: cart?.items?.length || 0,
    };
  };

  return {
    cart,
    cartMap,
    isLoading,
    isError,
    error: apiError,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    isInCart,
    getItemQuantity,
    getCartTotals,
    removeFromCartMutation,
    updateCartItemQuantityMutation,
    addToCartMutation,
  };
};
