import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { cartAPI } from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  // Ensure the hook is used within its Provider.
  // If not, it indicates a developer error and throws an informative error.
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null); // Clear cart data if user is not authenticated.
    }
  }, [isAuthenticated, fetchCart]); // Dependency array: effect re-runs when 'isAuthenticated' changes.

  const addToCart = async (serviceId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error("Please login to add items to cart");
    }

    try {
      const response = await cartAPI.addToCart(serviceId, quantity);
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to add to cart",
      };
    }
  };

  const removeFromCart = async (serviceId) => {
    if (!isAuthenticated) return;

    try {
      const response = await cartAPI.removeFromCart(serviceId);
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to remove from cart",
      };
    }
  };

  const getCartItemCount = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart?.total || 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    fetchCart,
    getCartItemCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
