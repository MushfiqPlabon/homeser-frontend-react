import { useAuth } from "../context/AuthContext";
import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemQuantityMutation,
} from "../store/apiSlice";

export const useCart = () => {
  const { isAuthenticated } = useAuth();

  const {
    data: cart,
    isLoading,
    isError,
    error,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated, // Only fetch cart data for authenticated users
  });

  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItemQuantity] = useUpdateCartItemQuantityMutation();
  const [addToCart] = useAddToCartMutation();

  const items = (isAuthenticated && cart?.items) || [];
  const subtotal = (isAuthenticated && cart?.subtotal) || 0;
  const tax = (isAuthenticated && cart?.tax) || 0;
  const total = (isAuthenticated && cart?.total) || 0;

  return {
    cart,
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
  };
};
