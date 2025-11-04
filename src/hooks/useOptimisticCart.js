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
import { useLocalStorageCart } from "./useLocalStorageCart";

export const useOptimisticCart = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const localStorageCart = useLocalStorageCart();

  // Track active operations to prevent race conditions
  const { activeOperations } = useSelector(
    (state) => state.cart || { activeOperations: new Set() },
  );

  const {
    data: cart,
    isLoading,
    isError,
    error,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated, // Only fetch cart data for authenticated users
  });

  const [removeFromCartMutation] = useRemoveFromCartMutation();
  const [updateCartItemQuantityMutation] = useUpdateCartItemQuantityMutation();
  const [addToCartMutation] = useAddToCartMutation();

  // Helper function to calculate totals consistently with backend
  const calculateTotals = (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.service.price * item.quantity,
      0,
    );
    // Using 15% tax rate to match backend calculation
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  // Optimistic update functions
  const addToCart = async (args) => {
    if (isAuthenticated) {
      const operationKey = `add_${args.service.id}_${Date.now()}`;
      // Check if operation is already in progress
      if (activeOperations.has(operationKey)) return;

      // Optimistic update: Add item to cart immediately in the store
      const newItem = {
        service: args.service,
        quantity: args.quantity || 1,
        total_price: (args.service.price * (args.quantity || 1)).toFixed(2),
      };

      // Get current cart items and add the new item
      const currentItems = cart?.items ? [...cart.items] : [];
      const existingItemIndex = currentItems.findIndex(
        (item) => item.service.id === args.service.id,
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        currentItems[existingItemIndex].quantity += args.quantity || 1;
        currentItems[existingItemIndex].total_price = (
          currentItems[existingItemIndex].service.price *
          currentItems[existingItemIndex].quantity
        ).toFixed(2);
      } else {
        // Add new item
        currentItems.push(newItem);
      }

      const { subtotal, tax, total } = calculateTotals(currentItems);

      // Optimistic update to the store
      dispatch(
        apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
          draft.items = currentItems;
          draft.subtotal = subtotal;
          draft.tax = tax;
          draft.total = total;
        }),
      );

      try {
        const result = await addToCartMutation(args).unwrap();
        showToast("Item added to cart successfully!", "success");
        return result;
      } catch (error) {
        // Revert optimistic update on error
        const revertedItems = cart?.items ? [...cart.items] : [];
        const revertedTotals = calculateTotals(revertedItems);

        dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items = revertedItems;
            draft.subtotal = revertedTotals.subtotal;
            draft.tax = revertedTotals.tax;
            draft.total = revertedTotals.total;
          }),
        );
        const errorMessage =
          error?.data?.detail || "Failed to add item to cart";
        showToast(errorMessage, "error");
        throw error;
      }
    } else {
      // Use localStorage cart for unauthenticated users
      const { quantity = 1, service } = args;
      localStorageCart.addToCart(service, quantity);
      showToast("Item added to cart successfully!", "success");
      return Promise.resolve({ success: true });
    }
  };

  const removeFromCart = async (args) => {
    if (isAuthenticated) {
      const operationKey = `remove_${args.serviceId}_${Date.now()}`;
      // Check if operation is already in progress
      if (activeOperations.has(operationKey)) return;

      // Find the item that's being removed for potential revert
      const itemToRemove = cart?.items?.find(
        (item) => item.service.id === args.serviceId,
      );
      if (!itemToRemove) return;

      // Get current cart items and remove the specified item
      const currentItems = cart?.items
        ? cart.items.filter((item) => item.service.id !== args.serviceId)
        : [];
      const { subtotal, tax, total } = calculateTotals(currentItems);

      // Optimistic update: Remove item from cart immediately in the store
      dispatch(
        apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
          draft.items = currentItems;
          draft.subtotal = subtotal;
          draft.tax = tax;
          draft.total = total;
        }),
      );

      try {
        const result = await removeFromCartMutation(args).unwrap();
        showToast("Item removed from cart", "success");
        return result;
      } catch (error) {
        // Revert optimistic update on error
        const revertedItems = cart?.items ? [...cart.items] : [];
        const revertedTotals = calculateTotals(revertedItems);

        dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items = revertedItems;
            draft.subtotal = revertedTotals.subtotal;
            draft.tax = revertedTotals.tax;
            draft.total = revertedTotals.total;
          }),
        );
        const errorMessage =
          error?.data?.detail || "Failed to remove item from cart";
        showToast(errorMessage, "error");
        throw error;
      }
    } else {
      // Use localStorage cart for unauthenticated users
      const { serviceId } = args;
      localStorageCart.removeFromCart(serviceId);
      showToast("Item removed from cart", "success");
      return Promise.resolve({ success: true });
    }
  };

  const updateCartItemQuantity = async (args) => {
    if (isAuthenticated) {
      const operationKey = `update_${args.serviceId}_${Date.now()}`;
      // Check if operation is already in progress
      if (activeOperations.has(operationKey)) return;

      // Find the item to update
      const itemToUpdate = cart?.items?.find(
        (item) => item.service.id === args.serviceId,
      );
      if (!itemToUpdate) return;

      // Get current cart items and update the specified item quantity
      const currentItems = cart?.items
        ? cart.items.map((item) => {
            if (item.service.id === args.serviceId) {
              return {
                ...item,
                quantity: args.quantity,
                total_price: (item.service.price * args.quantity).toFixed(2),
              };
            }
            return item;
          })
        : [];

      const { subtotal, tax, total } = calculateTotals(currentItems);

      // Optimistic update: update quantity immediately in the store
      dispatch(
        apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
          draft.items = currentItems;
          draft.subtotal = subtotal;
          draft.tax = tax;
          draft.total = total;
        }),
      );

      try {
        const result = await updateCartItemQuantityMutation(args).unwrap();
        showToast("Cart updated successfully!", "success");
        return result;
      } catch (error) {
        // Revert optimistic update on error
        const revertedItems = cart?.items ? [...cart.items] : [];
        const revertedTotals = calculateTotals(revertedItems);

        dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items = revertedItems;
            draft.subtotal = revertedTotals.subtotal;
            draft.tax = revertedTotals.tax;
            draft.total = revertedTotals.total;
          }),
        );
        const errorMessage = error?.data?.detail || "Failed to update cart";
        showToast(errorMessage, "error");
        throw error;
      }
    } else {
      // Use localStorage cart for unauthenticated users
      const { serviceId, quantity } = args;
      localStorageCart.updateCartItemQuantity(serviceId, quantity);
      showToast("Cart updated successfully!", "success");
      return Promise.resolve({ success: true });
    }
  };

  // Function to migrate localStorage cart to authenticated cart when user logs in
  const migrateGuestCartToAuthenticated = async () => {
    if (isAuthenticated && localStorageCart.cartItems.length > 0) {
      // Add all items from localStorage cart to authenticated cart
      for (const item of localStorageCart.cartItems) {
        try {
          await addToCart({
            service: item.service,
            quantity: item.quantity,
          });
        } catch (error) {
          console.error(
            `Failed to migrate cart item: ${item.service.id}`,
            error,
          );
        }
      }
      // Clear localStorage cart after migration
      localStorageCart.clearCart();
    }
  };

  // Determine which cart data to use based on authentication status
  const items = isAuthenticated
    ? cart?.items || []
    : localStorageCart.cartItems;

  const cartTotals = isAuthenticated
    ? {
        subtotal: cart?.subtotal || 0,
        tax: cart?.tax || 0,
        total: cart?.total || 0,
      }
    : localStorageCart.calculateTotals();

  const subtotal = cartTotals.subtotal;
  const tax = cartTotals.tax;
  const total = cartTotals.total;

  // Create O(1) lookup map for cart items
  const cartItemMap = createCartMap(items);

  // O(1) lookup function for cart items
  const getCartItem = (serviceId) => {
    return cartItemMap.get(serviceId);
  };

  // O(1) check if item exists in cart
  const isInCart = (serviceId) => {
    return cartItemMap.has(serviceId);
  };

  // O(1) get item quantity
  const getItemQuantity = (serviceId) => {
    const item = cartItemMap.get(serviceId);
    return item ? item.quantity : 0;
  };

  return {
    cart: isAuthenticated
      ? cart
      : { items: localStorageCart.cartItems, ...cartTotals },
    items,
    subtotal,
    tax,
    total,
    isLoading: isAuthenticated ? isLoading : false,
    isError: isAuthenticated ? isError : false,
    error: isAuthenticated ? error : null,
    removeFromCart,
    updateCartItemQuantity,
    addToCart,
    isEmpty: isAuthenticated
      ? !(cart?.items && cart.items.length > 0)
      : localStorageCart.isEmpty,
    isGuestCart: !isAuthenticated,
    // Migration function for guest to authenticated transition
    migrateGuestCartToAuthenticated,
    // O(1) helper functions
    getCartItem,
    isInCart,
    getItemQuantity,
  };
};
