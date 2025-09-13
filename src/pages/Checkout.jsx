// Checkout.jsx
// This page component guides the user through the final steps of placing an order,
// collecting delivery information and initiating the payment process.

import {
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import LazyImage from "../components/LazyImage";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ordersAPI } from "../utils/api";

const Checkout = () => {
  const { isAuthenticated, user } = useAuth();
  const { cart, fetchCart } = useCart();
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

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    payment_method: "sslcommerz",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate unique IDs for form elements
  const nameInputId = useId();
  const phoneInputId = useId();
  const addressTextareaId = useId();
  const sslcommerzRadioId = useId();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }

    fetchCart();

    // Pre-fill form with user data
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.first_name} ${user.last_name}`.trim(),
      }));
    }
  }, [isAuthenticated, user, fetchCart, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart?.items?.length) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await ordersAPI.checkout(formData);
      const { gateway_url, _sessionkey, _order_id } = response.data;

      if (gateway_url) {
        // Redirect to SSLCOMMERZ payment gateway
        window.location.href = gateway_url;
      } else {
        setError("Payment gateway URL not received");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Checkout failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const cartItems = cart?.items || [];
  const isEmpty = cartItems.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="text-center card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cart is Empty
          </h2>
          <p className="text-gray-600 mb-4">
            Add some services to your cart before checkout.
          </p>
          <button
            type="button"
            onClick={() => navigate("/services")}
            className="btn-primary"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TruckIcon className="h-6 w-6 mr-2 text-primary-600" />
              Checkout Details
            </h2>

            {error && (
              <div className="bg-red-50/80 border border-red-200/50 text-red-600 px-4 py-3 rounded-md mb-6 backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Delivery Information
                </h3>

                <div className="space-y-4">
                  <label
                    htmlFor={nameInputId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    id={nameInputId}
                    type="text"
                    name="name"
                    required
                    className="input-field"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <label
                    htmlFor={phoneInputId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    id={phoneInputId}
                    type="tel"
                    name="phone"
                    required
                    className="input-field"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <label
                    htmlFor={addressTextareaId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Service Address *
                  </label>
                  <textarea
                    id={addressTextareaId}
                    name="address"
                    rows={3}
                    required
                    className="input-field"
                    placeholder="Enter your complete service address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Payment Method
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center p-4 border border-gray-200/50 rounded-lg bg-primary-50/50 backdrop-blur-sm">
                    <input
                      id={sslcommerzRadioId}
                      type="radio"
                      name="payment_method"
                      value="sslcommerz"
                      checked={formData.payment_method === "sslcommerz"}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor={sslcommerzRadioId} className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            SSLCOMMERZ Payment Gateway
                          </p>
                          <p className="text-sm text-gray-600">
                            Pay securely with credit card, debit card, or mobile
                            banking
                          </p>
                        </div>
                        <ShieldCheckIcon className="h-6 w-6 text-green-500" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-start">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">
                      Secure Payment
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your payment information is encrypted and secure. We use
                      SSLCOMMERZ for safe and reliable payment processing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg backdrop-blur-sm"
              >
                {loading ? "Processing..." : `Pay ৳${cart?.total || 0}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-3 border border-gray-200/50 rounded-lg backdrop-blur-sm bg-white/50"
                >
                  <div className="flex-shrink-0">
                    {item.service.image_url ? (
                      <LazyImage
                        src={item.service.image_url}
                        alt={item.service.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <LazyImage
                        src={getFallbackImage(item.service.name)}
                        alt={item.service.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.service.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-primary-600 font-semibold">
                      ৳{item.price} × {item.quantity} = ৳{item.total_price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-200/50 pt-4 space-y-2">
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

            {/* Service Note */}
            <div className="mt-6 p-4 bg-gray-50/50 rounded-lg backdrop-blur-sm border border-gray-200/50">
              <h4 className="font-semibold text-gray-900 mb-2">
                Service Information
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Our professional will contact you within 24 hours</li>
                <li>• Service will be scheduled at your convenience</li>
                <li>• All professionals are verified and insured</li>
                <li>• 100% satisfaction guarantee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
