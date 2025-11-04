import { useDispatch, useSelector } from "react-redux";
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

export const useOptimisticCart = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Track active operations to prevent race conditions
  // This prevents multiple concurrent operations on the same item
  const activeOperations = useSelector(
    (state) => state.cart?.activeOperations || {},
  );

  // Get cart data for authenticated users only
  const {
    data: cart,
    isLoading,
    isError,
    error,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated, // Skip if user is not authenticated
  });

  // Create O(1) lookup map for cart items
  const cartItemMap = createCartMap(cart?.items);

  // O(1) lookup function for cart items
  const getCartItem = (serviceId) => {
    return cartItemMap.get(serviceId);
  };

  // O(1) check if item exists in cart
  const isInCart = (serviceId) => {
    return cartItemMap.has(serviceId);
  };

  // Get item quantity from cart
  const getItemQuantity = (serviceId) => {
    const item = getCartItem(serviceId);
    return item ? item.quantity : 0;
  };

  // Get total cart items count for authenticated users
  const getTotalItems = () => {
    return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  // Check if an operation is active for a specific item
  const isActive = (operationKey) => {
    return !!activeOperations[operationKey];
  };

  // Optimistic mutations - only available for authenticated users
  const [addToCartMutation] = useAddToCartMutation();
  const [removeFromCartMutation] = useRemoveFromCartMutation();
  const [updateCartItemQuantityMutation] = useUpdateCartItemQuantityMutation();

  // Add to cart with optimistic updates - only for authenticated users
  const addToCart = async (args) => {
    if (!isAuthenticated) {
      showToast("Please log in to add to cart", "info");
      return;
    }

    // Check if operation is already active
    const operationKey = `add_${args.service_id}_${Date.now()}`;
    if (isActive(operationKey)) {
      return; // Prevent duplicate operations
    }

    // Optimistic update: add item to cart in the UI while request is pending
    const patchResult = dispatch(
      apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
        if (!draft.items) draft.items = [];

        // Find if item already exists in cart
        const existingItemIndex = draft.items.findIndex(
          (item) => item.service.id === args.service_id,
        );

        if (existingItemIndex >= 0) {
          // If item exists, update quantity
          draft.items[existingItemIndex].quantity += args.qty || 1;
        } else {
          // If item doesn't exist, add it to cart
          draft.items.push({
            service: { id: args.service_id },
            quantity: args.qty || 1,
            unit_price: args.unit_price || "0.00",
            total_price: args.total_price || "0.00",
          });
        }

        // Update totals
        draft.total_items = (draft.total_items || 0) + (args.qty || 1);
      }),
    );

    try {
      const result = await addToCartMutation(args).unwrap();
      showToast("Item added to cart!", "success");
      return result;
    } catch (error) {
      // Rollback optimistic update
      patchResult.undo();
      showToast(error?.data?.detail || "Failed to add to cart", "error");
      throw error;
    }
  };

  // Remove from cart with optimistic updates - only for authenticated users
  const removeFromCart = async (args) => {
    if (!isAuthenticated) {
      showToast("Please log in to manage your cart", "info");
      return;
    }

    const operationKey = `remove_${args.service_id}_${Date.now()}`;
    if (isActive(operationKey)) {
      return;
    }

    // Optimistic update: remove item from cart in the UI while request is pending
    const patchResult = dispatch(
      apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
        if (!draft.items) return;

        // Find the item's index
        const itemIndex = draft.items.findIndex(
          (item) => item.service.id === args.service_id,
        );

        if (itemIndex >= 0) {
          const removedItem = draft.items[itemIndex];

          // Remove the item from cart
          draft.items.splice(itemIndex, 1);

          // Update totals
          draft.total_items = Math.max(
            0,
            (draft.total_items || 0) - removedItem.quantity,
          );
        }
      }),
    );

    try {
      const result = await removeFromCartMutation(args).unwrap();
      showToast("Item removed from cart", "info");
      return result;
    } catch (error) {
      // Rollback optimistic update
      patchResult.undo();
      showToast(error?.data?.detail || "Failed to remove from cart", "error");
      throw error;
    }
  };

  // Update item quantity with optimistic updates - only for authenticated users
  const updateItemQuantity = async (args) => {
    if (!isAuthenticated) {
      showToast("Please log in to manage your cart", "info");
      return;
    }

    const operationKey = `update_${args.service_id}_${Date.now()}`;
    if (isActive(operationKey)) {
      return;
    }

    // Optimistic update: update item quantity in the UI while request is pending
    const patchResult = dispatch(
      apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
        if (!draft.items) return;

        // Find the item's index
        const itemIndex = draft.items.findIndex(
          (item) => item.service.id === args.service_id,
        );

        if (itemIndex >= 0) {
          const originalQuantity = draft.items[itemIndex].quantity;
          const quantityDiff = args.qty - originalQuantity;

          // Update the item's quantity
          draft.items[itemIndex].quantity = args.qty;

          // Update totals
          draft.total_items = Math.max(
            0,
            (draft.total_items || 0) + quantityDiff,
          );
        }
      }),
    );

    try {
      const result = await updateCartItemQuantityMutation(args).unwrap();
      showToast("Cart updated!", "success");
      return result;
    } catch (error) {
      // Rollback optimistic update
      patchResult.undo();
      showToast(error?.data?.detail || "Failed to update cart", "error");
      throw error;
    }
  };

  // Calculate cart totals - only for authenticated users
  const getCartTotals = () => {
    return {
      totalItems: cart?.total_items || 0,
      totalPrice: cart?.total_price || 0,
      itemCount: cart?.items?.length || 0,
      isLoading: isLoading,
      isErrored: isError,
    };
  };

  return {
    // Cart data - only for authenticated users
    cart,
    cartItemMap,
    items: cart?.items || [],

    // Status
    isLoading,
    isError,
    error,

    // Cart operations
    addToCart,
    removeFromCart,
    updateItemQuantity,

    // Utility functions
    getCartItem,
    isInCart,
    getItemQuantity,
    getTotalItems,
    getCartTotals,

    // Operation tracking
    isActive,
    activeOperations,
  };
};
