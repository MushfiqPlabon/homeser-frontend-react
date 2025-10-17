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
import { useLocalStorageCart } from "./useLocalStorageCart";

// Create a Map for O(1) cart item lookup
const createCartMap = (items) => {
  const map = new Map();
  items?.forEach((item) => {
    map.set(item.service.id, item);
  });
  return map;
};

export const useOptimisticCart = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const localStorageCart = useLocalStorageCart();

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

  // Optimistic update functions
  const addToCart = async (args) => {
    if (isAuthenticated) {
      // Optimistic update: Add item to cart immediately in the store
      const newItem = {
        service: args.service,
        quantity: args.quantity || 1,
        total_price: (args.service.price * (args.quantity || 1)).toFixed(2),
      };

      // Calculate new totals
      const currentSubtotal = cart?.subtotal || 0;
      const newSubtotal =
        currentSubtotal + args.service.price * (args.quantity || 1);
      const tax = newSubtotal * 0.05;
      const total = newSubtotal * 1.05;

      // Optimistic update to the store
      dispatch(
        apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
          draft.items = draft.items ? [...draft.items, newItem] : [newItem];
          draft.subtotal = newSubtotal;
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
        dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items =
              draft.items?.filter(
                (item) => item.service.id !== args.service.id,
              ) || [];
            draft.subtotal = currentSubtotal;
            draft.tax = currentSubtotal * 0.05;
            draft.total = currentSubtotal * 1.05;
          }),
        );
        showToast(error?.data?.detail || "Failed to add item to cart", "error");
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
      // Find the item that's being removed for potential revert
      const itemToRemove = cart?.items?.find(
        (item) => item.service.id === args.serviceId,
      );
      if (!itemToRemove) return;

      const itemPrice = itemToRemove.service.price * itemToRemove.quantity;
      const currentSubtotal = cart?.subtotal || 0;
      const newSubtotal = currentSubtotal - itemPrice;
      const tax = newSubtotal * 0.05;
      const total = newSubtotal * 1.05;

      // Optimistic update: Remove item from cart immediately in the store
      dispatch(
        apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
          draft.items =
            draft.items?.filter((item) => item.service.id !== args.serviceId) ||
            [];
          draft.subtotal = newSubtotal;
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
        dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items = [...(draft.items || []), itemToRemove];
            draft.subtotal = currentSubtotal;
            draft.tax = currentSubtotal * 0.05;
            draft.total = currentSubtotal * 1.05;
          }),
        );
        showToast(
          error?.data?.detail || "Failed to remove item from cart",
          "error",
        );
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
      // Find the item to update and calculate price difference
      const itemToUpdate = cart?.items?.find(
        (item) => item.service.id === args.serviceId,
      );
      if (!itemToUpdate) return;

      const oldQuantity = itemToUpdate.quantity;
      const priceDifference =
        itemToUpdate.service.price * (args.quantity - oldQuantity);
      const currentSubtotal = cart?.subtotal || 0;
      const newSubtotal = currentSubtotal + priceDifference;
      const tax = newSubtotal * 0.05;
      const total = newSubtotal * 1.05;

      // Optimistic update: update quantity immediately in the store
      dispatch(
        apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
          draft.items =
            draft.items?.map((item) => {
              if (item.service.id === args.serviceId) {
                return {
                  ...item,
                  quantity: args.quantity,
                  total_price: (item.service.price * args.quantity).toFixed(2),
                };
              }
              return item;
            }) || [];
          draft.subtotal = newSubtotal;
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
        dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items =
              draft.items?.map((item) => {
                if (item.service.id === args.serviceId) {
                  return {
                    ...item,
                    quantity: oldQuantity,
                    total_price: (item.service.price * oldQuantity).toFixed(2),
                  };
                }
                return item;
              }) || [];
            draft.subtotal = currentSubtotal;
            draft.tax = currentSubtotal * 0.05;
            draft.total = currentSubtotal * 1.05;
          }),
        );
        showToast(error?.data?.detail || "Failed to update cart", "error");
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
    // O(1) helper functions
    getCartItem,
    isInCart,
    getItemQuantity,
  };
};
