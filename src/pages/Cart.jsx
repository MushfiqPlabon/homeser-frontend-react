// Cart.jsx - using RTK Query hooks
// This component displays the user's cart and allows modification of items

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LazyImage from "../components/LazyImage";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import { getFallbackImage } from "../utils/imageUtils";
import { renderStars } from "../utils/uiUtils.jsx";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    items,
    subtotal,
    tax,
    total,
    isLoading,
    isError,
    error,
    removeFromCart,
    updateCartItemQuantity,
  } = useCart();

  const [updatingQuantities, setUpdatingQuantities] = useState({});

  // Check authentication
  if (!isAuthenticated) {
    navigate("/login", { state: { from: { pathname: "/cart" } } });
    return null;
  }

  const handleRemoveItem = async (serviceId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?",
      )
    ) {
      await removeFromCart(serviceId);
    }
  };

  const handleUpdateQuantity = async (serviceId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      handleRemoveItem(serviceId);
      return;
    }

    await handleQuantityChange(serviceId, newQuantity);
  };

  const handleQuantityChange = async (serviceId, newQuantity) => {
    // Validate quantity
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;

    // Set loading state for this item
    setUpdatingQuantities((prev) => ({ ...prev, [serviceId]: true }));

    try {
      await updateCartItemQuantity({ serviceId, quantity: newQuantity });
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      // Clear loading state for this item
      setUpdatingQuantities((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          Failed to load cart: {error?.message || "Unknown error"}
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  const cartItems = items || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <ShoppingBagIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Your cart is empty
              </h3>
              <p className="mt-1 text-gray-500">
                Start adding some services to your cart
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/services")}
                  className="btn-primary"
                >
                  Browse Services
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200/50 rounded-lg backdrop-blur-sm bg-white/50"
                    >
                      {/* Service Image */}
                      <div className="flex-shrink-0">
                        {item.service.image_url ? (
                          <LazyImage
                            src={item.service.image_url}
                            alt={item.service.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <LazyImage
                            src={getFallbackImage(item.service.name)}
                            alt={item.service.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                      </div>

                      {/* Service Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.service.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.service.short_desc}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center justify-between">
                          {item.service.avg_rating > 0 ? (
                            renderStars(item.service.avg_rating)
                          ) : (
                            <span className="text-sm text-gray-500">
                              No ratings yet
                            </span>
                          )}
                          <span className="text-sm text-gray-500">
                            {item.service.review_count} review
                            {item.service.review_count !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.service.id,
                                  item.quantity,
                                  -1,
                                )
                              }
                              disabled={updatingQuantities[item.service.id]}
                              className="btn-secondary w-8 h-8 flex items-center justify-center disabled:opacity-50"
                            >
                              -
                            </button>
                            <span className="w-10 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.service.id,
                                  item.quantity,
                                  1,
                                )
                              }
                              disabled={updatingQuantities[item.service.id]}
                              className="btn-secondary w-8 h-8 flex items-center justify-center disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-lg font-semibold text-gray-900">
                            ৳{item.total_price}
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          ৳{(item.service.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.service.id)}
                          className="btn-primary"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="px-6 py-4 border-t border-gray-300/50 bg-gray-50/50 backdrop-blur-sm">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">
                      ৳{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%):</span>
                    <span className="font-semibold">৳{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300/50 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">
                        ৳{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/services")}
                    className="btn-secondary flex-1 text-center backdrop-blur-sm"
                  >
                    Continue Shopping
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/checkout")}
                    className="btn-primary flex-1 text-center backdrop-blur-sm"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
