// ServiceDetail.jsx
// This page component displays the detailed information for a single service,
// including its description, price, and customer reviews. It also allows users
// to add the service to their cart and submit new reviews.

import { StarIcon } from "@heroicons/react/24/outline";
// Import required icons
import {
  ShoppingCartIcon,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
// Import UI components and utilities
import LazyImage from "../components/LazyImage";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../context/WebSocketContext";
// Import required hooks
import {
  useCreateReview,
  useDeleteReview,
  useUpdateReview,
} from "../hooks/useApi";
import { useCart } from "../hooks/useCart";
import {
  useGetServiceQuery,
  useGetServiceReviewsQuery,
} from "../store/extendedApiSlice";
import { getFallbackImage } from "../utils/imageUtils";
import { usePerformanceMonitor } from "../utils/performanceMonitoring";
import { formatDate, renderStars } from "../utils/uiUtils.jsx";

// Define review schema
const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating is required")
    .max(5, "Rating cannot be more than 5"),
  text: z.string().min(1, "Review text is required"),
});

const ServiceDetail = () => {
  const performanceMonitor = usePerformanceMonitor();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isConnected } = useWebSocket();

  const _quantitySelectId = useId();
  const reviewRatingId = useId();
  const reviewTextId = useId();
  const editReviewTextId = useId();

  // State for real-time updates
  const [realTimeService, setRealTimeService] = useState(null);
  const [realTimeReviews, setRealTimeReviews] = useState([]);
  const [serviceUpdates, setServiceUpdates] = useState(new Map());

  // Start timing service load
  const serviceLoadId = `service_load_${id}_${Date.now()}`;
  performanceMonitor.startTiming(serviceLoadId);

  // Fetch service and reviews data
  const {
    data: service,
    isLoading: isLoadingService,
    error: errorService,
  } = useGetServiceQuery(id);
  const {
    data: reviews,
    error: reviewsError,
    isLoading: isLoadingReviews,
  } = useGetServiceReviewsQuery(id);

  // Combine base service with real-time updates
  useEffect(() => {
    if (service) {
      const update = serviceUpdates.get(id);
      if (update) {
        setRealTimeService({ ...service, ...update });
      } else {
        setRealTimeService(service);
      }
    }
  }, [service, id, serviceUpdates]);

  // Set reviews when they load - handle paginated response with real-time updates
  useEffect(() => {
    if (reviews) {
      // Check if the response is paginated (has 'results' field)
      let reviewsList;
      if (reviews.results !== undefined) {
        // Handle paginated response
        reviewsList = reviews.results;
      } else if (Array.isArray(reviews)) {
        // Handle direct array response
        reviewsList = reviews;
      } else {
        // Default to empty array
        reviewsList = [];
      }
      setRealTimeReviews(reviewsList);
    } else {
      setRealTimeReviews([]); // Ensure it's always an array
    }
  }, [reviews]);

  // Subscribe to WebSocket events for service updates
  useEffect(() => {
    if (!isConnected || !id) return;

    // Handle service updates
    const handleServiceUpdate = (data) => {
      if (data.service_id === parseInt(id, 10)) {
        setServiceUpdates((prev) => {
          const newUpdates = new Map(prev);
          newUpdates.set(data.service_id, {
            ...data,
            isUpdated: true,
          });
          return newUpdates;
        });
      }
    };

    // Handle review updates
    const handleReviewUpdate = (data) => {
      // This would update the reviews list based on review changes
      // Implementation depends on how review update messages are structured
      console.log("Review update received:", data);

      // For now, we'll refetch reviews when a review update comes
      // In a more optimized system, we would update the specific review in the list
    };

    // Add event listeners for WebSocket events
    window.addEventListener("serviceUpdate", (e) => {
      handleServiceUpdate(e.detail);
    });

    window.addEventListener("reviewUpdate", (e) => {
      handleReviewUpdate(e.detail);
    });

    // Cleanup on unmount
    return () => {
      window.removeEventListener("serviceUpdate", handleServiceUpdate);
      window.removeEventListener("reviewUpdate", handleReviewUpdate);
    };
  }, [isConnected, id]);

  // Record service load time when service data arrives
  useEffect(() => {
    if (service && !isLoadingService) {
      const duration = performanceMonitor.endTiming(
        serviceLoadId,
        "service_detail_load",
      );
      performanceMonitor.recordMetric("service_detail_load_time", duration);
    }
  }, [service, isLoadingService, performanceMonitor, serviceLoadId]);

  // Cart functionality
  const { addToCart, isLoading: isAddingToCart } = useCart();

  // Review mutations
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  // State variables
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewForm, setEditReviewForm] = useState({ rating: 5, text: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [_reviewsList, setReviews] = useState([]);

  // Initialize form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      text: "",
    },
  });

  // Set reviews when they load - handle paginated response
  useEffect(() => {
    if (reviews) {
      // Check if the response is paginated (has 'results' field)
      if (reviews.results !== undefined) {
        // Handle paginated response
        setReviews(reviews.results);
      } else if (Array.isArray(reviews)) {
        // Handle direct array response
        setReviews(reviews);
      } else {
        // Default to empty array
        setReviews([]);
      }
    } else {
      setReviews([]); // Ensure it's always an array
    }
  }, [reviews]);

  // Handle reviews error
  useEffect(() => {
    if (reviewsError) {
      setError(
        "Failed to load reviews: " +
          (reviewsError.data?.message ||
            reviewsError.message ||
            "Unknown error"),
      );
    }
  }, [reviewsError]);

  // Handle adding service to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/services/${id}` } } });
      return;
    }

    try {
      await addToCart({ serviceId: service.id, quantity });
      setSuccessMessage("Service added to cart successfully!");
    } catch (_error) {
      setError("Failed to add service to cart");
    }
  };

  // Handle review submission
  const onReviewSubmit = async (data) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSubmittingReview(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingReview) {
        // Update existing review
        await updateReview({
          reviewId: editingReview.id,
          serviceId: id,
          reviewData: data,
        });
        setSuccessMessage("Review updated successfully!");

        // Update the review in the local state
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === editingReview.id
              ? { ...review, ...data, updated_at: new Date().toISOString() }
              : review,
          ),
        );

        setEditingReview(null);
      } else {
        // Create new review
        await createReview({ serviceId: id, reviewData: data });
        setSuccessMessage("Review submitted successfully!");

        // Refetch reviews to include the new one
        // Note: In a real app, you would likely append the new review to the list
      }

      reset();
      setShowReviewForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle edit review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditReviewForm({
      rating: review.rating,
      text: review.text,
    });
    setValue("rating", review.rating);
    setValue("text", review.text);
  };

  // Handle update review (using RTK Query)
  const handleUpdateReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setError("");
    setSuccessMessage("");

    try {
      await updateReview({
        reviewId: editingReview.id,
        serviceId: id,
        reviewData: editReviewForm,
      });

      // Update the review in the reviews list
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === editingReview.id
            ? {
                ...review,
                ...editReviewForm,
                updated_at: new Date().toISOString(),
              }
            : review,
        ),
      );

      setEditingReview(null);
      setEditReviewForm({ rating: 5, text: "" });
      setSuccessMessage("Review updated successfully!");
      reset();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update review";
      setError(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await deleteReview({ reviewId, serviceId: id });
      setSuccessMessage("Review deleted successfully!");

      // Remove the review from the reviews list
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId),
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete review";
      setError(errorMessage);
    }
  };

  // Loading state
  if (isLoadingService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
      </div>
    );
  }

  // Error state
  if (errorService || !realTimeService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="text-center card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Service Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {errorService?.message ||
              "The requested service could not be found."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/services")}
            className="btn-primary"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Service Image */}
          <div className="card">
            {realTimeService.image_url ? (
              <LazyImage
                src={realTimeService.image_url}
                alt={realTimeService.name}
                className="w-full h-96 rounded-lg shadow-md object-cover"
              />
            ) : (
              <LazyImage
                src={getFallbackImage(realTimeService.name)}
                alt={realTimeService.name}
                className="w-full h-96 rounded-lg shadow-md object-cover"
              />
            )}
          </div>

          {/* Service Info */}
          <div className="space-y-6 card">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                {realTimeService.name}
                {serviceUpdates.get(parseInt(id, 10))?.isUpdated && (
                  <span className="ml-2 text-sm text-blue-600 animate-pulse">
                    (Updated)
                  </span>
                )}
              </h1>
              <p className="text-lg text-gray-600">
                {realTimeService.short_desc}
              </p>
            </div>

            {/* Rating */}
            <div>
              {realTimeService.avg_rating > 0 ? (
                renderStars(realTimeService.avg_rating)
              ) : (
                <span className="text-gray-500">No ratings yet</span>
              )}
              <span className="text-sm text-gray-500 ml-4">
                {realTimeService.review_count} review
                {realTimeService.review_count !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Price */}
            <div className="bg-primary-50/50 p-4 rounded-lg backdrop-blur-sm border border-primary-100/50">
              <span className="text-3xl font-bold text-primary-600">
                ৳{realTimeService.price}
              </span>
              <span className="text-gray-600 ml-2">per service</span>
              {serviceUpdates.get(parseInt(id, 10))?.isUpdated && (
                <span className="ml-2 text-sm text-blue-600 animate-pulse">
                  (Updated just now)
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label
                  htmlFor={_quantitySelectId}
                  className="text-sm font-medium text-gray-700"
                >
                  Quantity:
                </label>
                <select
                  id={_quantitySelectId}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  className="border border-gray-300/50 rounded-lg px-3 py-1 backdrop-blur-sm bg-white/50"
                  autoComplete="off"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`w-full btn-primary flex items-center justify-center space-x-2 backdrop-blur-sm ${
                  isAddingToCart ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>
                  {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Service Description */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{service.description}</p>
        </div>

        {/* Reviews Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Reviews ({realTimeReviews.length})
            </h2>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(!showReviewForm);
                  setEditingReview(null); // Reset editing state when toggling form
                }}
                className="btn-primary backdrop-blur-sm"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50/80 border border-red-200/50 text-red-600 px-4 py-3 rounded-md mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50/80 border border-green-200/50 text-green-600 px-4 py-3 rounded-md mb-6 backdrop-blur-sm">
              {successMessage}
            </div>
          )}

          {/* Loading indicator for reviews */}
          {isLoadingReviews && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && !editingReview && (
            <form
              onSubmit={handleSubmit(onReviewSubmit)}
              className="mb-8 p-4 bg-gray-50/50 rounded-lg backdrop-blur-sm border border-gray-200/50"
            >
              <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>

              <div className="mb-4">
                <div
                  htmlFor={reviewRatingId}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Rating
                </div>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            onChange(star);
                            setValue("rating", star);
                          }}
                          className="cursor-pointer"
                          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                        >
                          {star <= value ? (
                            <StarIconSolid className="h-6 w-6 text-yellow-400" />
                          ) : (
                            <StarIcon className="h-6 w-6 text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                />
                {errors.rating && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor={reviewTextId}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Review
                </label>
                <Controller
                  name="text"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      id={reviewTextId}
                      rows="4"
                      className="w-full border border-gray-300/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                      placeholder="Share your experience with this service..."
                    />
                  )}
                />
                {errors.text && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.text.message}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className={`btn-primary backdrop-blur-sm ${
                    submittingReview ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    reset();
                  }}
                  className="btn-secondary backdrop-blur-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Edit Review Form */}
          {editingReview && (
            <form
              onSubmit={handleUpdateReview}
              className="mb-8 p-4 bg-blue-50/50 rounded-lg backdrop-blur-sm border border-blue-200/50"
            >
              <h3 className="text-lg font-semibold mb-4">Edit Your Review</h3>

              <div className="mb-4">
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setEditReviewForm({ ...editReviewForm, rating: star })
                      }
                      className="cursor-pointer"
                      aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                    >
                      {star <= editReviewForm.rating ? (
                        <StarIconSolid className="h-6 w-6 text-yellow-400" />
                      ) : (
                        <StarIcon className="h-6 w-6 text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor={editReviewTextId}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Review
                </label>
                <textarea
                  id={editReviewTextId}
                  value={editReviewForm.text}
                  onChange={(e) =>
                    setEditReviewForm({
                      ...editReviewForm,
                      text: e.target.value,
                    })
                  }
                  rows="4"
                  className="w-full border border-gray-300/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  placeholder="Update your review..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className={`btn-primary backdrop-blur-sm ${
                    submittingReview ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {submittingReview ? "Updating..." : "Update Review"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingReview(null);
                    setEditReviewForm({ rating: 5, text: "" });
                  }}
                  className="btn-secondary backdrop-blur-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {isLoadingReviews ? (
              <p className="text-gray-500 text-center py-8">
                Loading reviews...
              </p>
            ) : realTimeReviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No reviews yet. Be the first to review this service!
              </p>
            ) : (
              realTimeReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200/50 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {review.user?.first_name ||
                          review.user?.username ||
                          "Anonymous"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(review.created)}
                      </div>
                    </div>
                    {isAuthenticated &&
                      user &&
                      (user.id === review.user_id || user.is_staff) && (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditReview(review)}
                            className="text-sm text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-sm text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                  </div>

                  <div className="mt-2 flex items-center">
                    {renderStars(review.rating)}
                  </div>

                  <p className="mt-2 text-gray-700">{review.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ServiceDetail);
