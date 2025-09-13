// Cart.jsx
// This page component displays the user's shopping cart, allowing them to view
// selected services, adjust quantities, remove items, and proceed to checkout.

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LazyImage from "../components/LazyImage";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { cart, loading, removeFromCart, addToCart, fetchCart } = useCart();
  const navigate = useNavigate();

  // Function to get fallback image based on service name
  const getFallbackImage = (serviceName) => {
    const serviceImages = {
      "House Cleaning": "/images/service_cleaning.png",
      "House Deep Cleaning": "/images/service_cleaning.png",
      "Bathroom Cleaning": "/images/service_cleaning.png",
      "Pipe Repair": "/images/service_plumbing.png",
      "Toilet Installation": "/images/service_plumbing.png",
      "Wiring Repair": "/images/service_electrical.png",
      "Garden Maintenance": "/images/service_plumbing.png",
      "Wall Painting": "/images/service_cleaning.png",
    };

    // Return specific image if service name matches, otherwise return a default image
    return serviceImages[serviceName] || "/images/service_cleaning.png";
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    fetchCart();
  }, [isAuthenticated, fetchCart, navigate]);

  const handleRemoveItem = async (serviceId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?",
      )
    ) {
      await removeFromCart(serviceId);
    }
  };

  const _handleUpdateQuantity = async (serviceId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      handleRemoveItem(serviceId);
      return;
    }

    // For any quantity change, remove the item and re-add with the new quantity
    // This simplifies the logic and ensures consistency
    await removeFromCart(serviceId);
    await addToCart(serviceId, newQuantity);
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            role="img"
            aria-label={`${rating} out of 5 stars`}
          >
            <title>{star <= rating ? `${star} star` : "Empty star"}</title>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200/50">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ShoppingBagIcon className="h-8 w-8 mr-3 text-primary-600" />
              Shopping Cart
            </h1>
          </div>

          {isEmpty ? (
            /* Empty Cart */
            <div className="px-6 py-12 text-center">
              <img
                src="/images/empty_cart_illustration.png"
                alt="Empty Cart"
                className="h-48 w-48 mx-auto mb-4 object-contain" // Increased size for illustration
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any services to your cart yet.
              </p>
              <button
                type="button"
                onClick={() => navigate("/services")}
                className="btn-primary"
              >
                Browse Services
              </button>
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

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary-600">
                            ৳{item.price}
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
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="px-6 py-4 border-t border-gray-300/50 bg-gray-50/50 backdrop-blur-sm">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">৳{cart.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%):</span>
                    <span className="font-semibold">৳{cart.tax}</span>
                  </div>
                  <div className="border-t border-gray-300/50 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">৳{cart.total}</span>
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
