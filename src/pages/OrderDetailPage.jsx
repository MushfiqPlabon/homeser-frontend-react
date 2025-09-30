// OrderDetailPage.jsx
// This component displays detailed information for a specific order

import {
  ArrowLeftIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  useCreateReview,
  useUpdateReview,
  useUserOrders,
} from "../hooks/useApi";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const reviewTextId = useId();

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    text: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { data: orders, isLoading, isError, error } = useUserOrders();
  const [_updateReview] = useUpdateReview();
  const [createReview] = useCreateReview();

  // Check authentication
  if (!isAuthenticated) {
    navigate("/login", {
      state: { from: { pathname: `/dashboard/orders/${orderId}` } },
    });
    return null;
  }

  // Find the specific order
  const order = orders?.find((o) => o.id === parseInt(orderId, 10));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="text-center card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Order
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message ||
              "Failed to load the order details. Please try again."}
          </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/orders")}
              className="btn-primary"
            >
              Back to Orders
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="text-center card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The order with ID #{orderId} could not be found.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/orders")}
            className="btn-primary"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // Get the service ID from the first item (assuming single service per order)
      const serviceId = order.items?.[0]?.service?.id;

      if (!serviceId) {
        throw new Error("Could not find service ID for review");
      }

      await createReview({
        serviceId,
        reviewData: {
          rating: reviewForm.rating,
          text: reviewForm.text,
        },
      });

      setReviewForm({ rating: 5, text: "" });
      setShowReviewForm(false);
      setMessage({ type: "success", text: "Review submitted successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to submit review",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      in_progress: "bg-indigo-100 text-indigo-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  // Render payment status badge
  const renderPaymentStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-blue-100 text-blue-800",
      disputed: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/orders")}
            className="flex items-center text-primary-600 hover:text-primary-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Orders
          </button>
        </div>

        <div className="flex items-center space-x-3 mb-8">
          <ClipboardDocumentListIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.id}
          </h1>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Status
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Status:</span>
                  {renderStatusBadge(order.status)}
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Payment:</span>
                  {renderPaymentStatusBadge(order.payment_status)}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex border-b border-gray-200/50 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                      <img
                        src={item.service?.image_url}
                        alt={item.service?.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.service?.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-primary-600 mt-1">
                        ৳{(item.service?.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ৳{parseFloat(order.subtotal || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Tax (5%):</span>
                  <span className="font-medium">
                    ৳{parseFloat(order.tax || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200/50">
                  <span>Total:</span>
                  <span className="text-primary-600">
                    ৳{parseFloat(order.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Customer Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <title>Customer</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {order.customer_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.customer_email}
                    </p>
                    {order.customer_phone && (
                      <p className="text-sm text-gray-600">
                        {order.customer_phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-900">
                      {order.customer_address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-900">Ordered on</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>

                {order.transaction_id && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-900">Transaction ID</p>
                      <p className="text-sm text-gray-600 font-mono">
                        {order.transaction_id}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Review Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>

              {order.status === "completed" ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(true)}
                    className="w-full btn-primary"
                  >
                    Leave a Review
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">
                    Reviews can be left after the order is completed.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Current status: {order.status.replace("_", " ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Leave a Review
              </h3>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <div className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm({ ...reviewForm, rating: star })
                        }
                        className="focus:outline-none"
                        aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                      >
                        {star <= reviewForm.rating ? (
                          <StarIconSolid className="h-6 w-6 text-yellow-400" />
                        ) : (
                          <StarIcon className="h-6 w-6 text-gray-300" />
                        )}
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {reviewForm.rating} out of 5
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={reviewTextId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Review
                  </label>
                  <textarea
                    id={reviewTextId}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                    value={reviewForm.text}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, text: e.target.value })
                    }
                    placeholder="Share your experience with this service..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-secondary"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
