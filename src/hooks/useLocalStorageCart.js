import { useEffect, useState } from "react";

const LOCAL_STORAGE_CART_KEY = "homeser_guest_cart";

export const useLocalStorageCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      // Clear corrupted cart data
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [cartItems, isInitialized]);

  // Add item to cart
  const addToCart = (service, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.service.id === service.id,
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          total_price:
            (updatedItems[existingItemIndex].quantity + quantity) *
            service.price,
        };
        return updatedItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            id: Date.now(),
            service: service,
            quantity: quantity,
            price: service.price,
            total_price: service.price * quantity,
          },
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (serviceId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.service.id !== serviceId),
    );
  };

  // Update item quantity
  const updateCartItemQuantity = (serviceId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }

    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      const itemIndex = updatedItems.findIndex(
        (item) => item.service.id === serviceId,
      );

      if (itemIndex >= 0) {
        const service = updatedItems[itemIndex].service;
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: quantity,
          total_price: quantity * service.price,
        };
      }

      return updatedItems;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
    const tax = subtotal * 0.15; // 15% tax (consistent with backend)
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  // Check if cart has items
  const isEmpty = cartItems.length === 0;

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    calculateTotals,
    isEmpty,
    isInitialized,
  };
};
