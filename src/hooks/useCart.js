import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
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

export const useCart = () => {
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

  // Wrapper functions with toast notifications
  const addToCart = async (args) => {
    if (isAuthenticated) {
      try {
        const result = await addToCartMutation(args).unwrap();
        showToast("Item added to cart successfully!", "success");
        return result;
      } catch (error) {
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
      try {
        const result = await removeFromCartMutation(args).unwrap();
        showToast("Item removed from cart", "success");
        return result;
      } catch (error) {
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
      try {
        const result = await updateCartItemQuantityMutation(args).unwrap();
        showToast("Cart updated successfully!", "success");
        return result;
      } catch (error) {
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
