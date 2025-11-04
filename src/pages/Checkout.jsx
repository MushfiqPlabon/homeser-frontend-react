// Checkout.jsx
// This page component guides the user through the final steps of placing an order,
// collecting delivery information and initiating the payment process.

import {
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import LazyImage from "../components/LazyImage";
import { useAuth } from "../context/AuthContext";
import { useCheckoutMutation, useGetCartQuery } from "../store/apiSlice";
import { getFallbackImage } from "../utils/imageUtils";
import { usePerformanceMonitor } from "../utils/performanceMonitoring";

const schema = z.object({
  name: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Service address is required"),
  payment_method: z.string().min(1, "Payment method is required"),
});

const Checkout = () => {
  const performanceMonitor = usePerformanceMonitor();
  const nameId = useId();
  const phoneId = useId();
  const addressId = useId();
  const paymentMethodId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      payment_method: "sslcommerz",
    },
  });
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Record checkout load time
  const checkoutLoadId = `checkout_load_${Date.now()}`;
  performanceMonitor.startTiming(checkoutLoadId);

  // Use RTK Query to get cart data only for authenticated users
  const {
    data: cartData,
    isLoading,
    isError,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated, // Only fetch cart data for authenticated users
  });
  const [checkout, { isLoading: isCheckoutLoading }] = useCheckoutMutation();

  const [_formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    payment_method: "sslcommerz",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }

    // Record authentication check completion
    const duration = performanceMonitor.endTiming(
      checkoutLoadId,
      "checkout_auth_check",
    );
    performanceMonitor.recordMetric("checkout_auth_check_time", duration);

    // Pre-fill form with user data if available
    if (user) {
      const fullName =
        `${user.first_name || ""} ${user.last_name || ""}`.trim();
      setFormData((prev) => ({
        ...prev,
        name: fullName || user.username || "",
      }));
      setValue("name", fullName || user.username || "");
    }
  }, [
    isAuthenticated,
    user,
    navigate,
    setValue,
    performanceMonitor,
    checkoutLoadId,
  ]);

  // Update form values when cartData changes
  useEffect(() => {
    if (cartData) {
      // Record cart data fetch completion
      const duration = performanceMonitor.endTiming(
        checkoutLoadId,
        "checkout_cart_fetch",
      );
      performanceMonitor.recordMetric("checkout_cart_fetch_time", duration);

      // Update the react-hook-form values if needed
    } else if (isError) {
      // Record cart data fetch failure
      const duration = performanceMonitor.endTiming(
        checkoutLoadId,
        "checkout_cart_fetch",
      );
      performanceMonitor.recordMetric("checkout_cart_fetch_time", duration);
    }
  }, [cartData, isError, performanceMonitor, checkoutLoadId]);

  const _handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (data) => {
    const cartItems = cartData?.items || [];
    if (!cartItems?.length) {
      setError("Your cart is empty");
      return;
    }

    try {
      const checkoutData = {
        customer_name: data.name,
        customer_phone: data.phone,
        customer_address: data.address,
        payment_method: data.payment_method,
      };

      // Record checkout initiation
      const checkoutOperationId = `checkout_${Date.now()}`;
      performanceMonitor.startTiming(checkoutOperationId);

      const response = await checkout(checkoutData);

      // Record checkout completion
      const duration = performanceMonitor.endTiming(
        checkoutOperationId,
        "checkout",
      );
      performanceMonitor.recordMetric("checkout_time", duration);

      if (response.data?.gateway_url) {
        window.location.href = response.data.gateway_url;
      } else {
        setError(response.error?.message || "Payment gateway URL not received");
      }
    } catch (err) {
      // Record checkout failure
      const duration = performanceMonitor.endTiming(
        checkoutOperationId,
        "checkout",
      );
      performanceMonitor.recordMetric("checkout_time", duration);

      const errorMessage =
        err.response?.data?.error || "Checkout failed. Please try again.";
      setError(errorMessage);
    }
  };

  if (!isAuthenticated) {
    // Don't return null; instead show a loading state while redirect happens in useEffect
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="text-center card">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="text-center card">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="text-center card">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Cart
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load your cart. Please try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const cartItems = cartData?.items || [];
  const isEmpty = cartItems.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
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

  const subtotal = cartData?.subtotal || 0;
  const tax = cartData?.tax || 0;
  const total = cartData?.total || 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Delivery Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={nameId}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      id={nameId}
                      type="text"
                      autoComplete="name"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.name ? "border-red-500" : "border-gray-300/50"
                      } backdrop-blur-sm bg-white/50`}
                      placeholder="Enter your full name"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={phoneId}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      id={phoneId}
                      type="tel"
                      autoComplete="tel"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.phone ? "border-red-500" : "border-gray-300/50"
                      } backdrop-blur-sm bg-white/50`}
                      placeholder="Enter your phone number"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={addressId}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Service Address *
                    </label>
                    <textarea
                      id={addressId}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.address ? "border-red-500" : "border-gray-300/50"
                      } backdrop-blur-sm bg-white/50`}
                      placeholder="Enter your complete service address"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
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
                      id={paymentMethodId}
                      type="radio"
                      value="sslcommerz"
                      {...register("payment_method")}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor={paymentMethodId} className="ml-3 flex-1">
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
                disabled={isCheckoutLoading}
                className={`w-full btn-primary py-3 text-lg backdrop-blur-sm ${
                  isCheckoutLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isCheckoutLoading ? "Processing..." : `Pay ৳${total}`}
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
                  <div className="shrink-0">
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
                <span className="font-semibold">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (5%):</span>
                <span className="font-semibold">৳{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300/50 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">৳{total.toFixed(2)}</span>
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
