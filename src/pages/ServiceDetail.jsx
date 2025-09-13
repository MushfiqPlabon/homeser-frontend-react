// ServiceDetail.jsx
// This page component displays the detailed information for a single service,
// including its description, price, and customer reviews. It also allows users
// to add the service to their cart and submit new reviews.

import {
  CalendarIcon,
  ShoppingCartIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LazyImage from "../components/LazyImage";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { servicesAPI } from "../utils/api";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

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

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Generate unique IDs for form elements
  const quantitySelectId = useId();
  const reviewTextId = useId();
  const ratingId = useId();

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    text: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Define functions before useEffect
  const fetchServiceDetail = useCallback(async () => {
    try {
      const response = await servicesAPI.getService(id);
      setService(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load service details.");
      console.error("Error fetching service:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await servicesAPI.getServiceReviews(id);
      setReviews(response.data.results || response.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchServiceDetail();
    fetchReviews();
  }, [fetchReviews, fetchServiceDetail]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/services/${id}` } } });
      return;
    }

    setAddingToCart(true);
    setError("");
    setSuccessMessage("");
    try {
      const result = await addToCart(service.id, quantity);
      if (result.success) {
        setSuccessMessage("Service added to cart successfully!");
      } else {
        setError(result.error || "Failed to add to cart");
      }
    } catch (_err) {
      setError("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSubmittingReview(true);
    setError("");
    setSuccessMessage("");
    try {
      await servicesAPI.createReview(id, reviewForm);
      setReviewForm({ rating: 5, text: "" });
      setShowReviewForm(false);
      fetchReviews(); // Refresh reviews
      fetchServiceDetail(); // Refresh service to update average rating
      setSuccessMessage("Review submitted successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Failed to submit review";
      setError(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onRatingChange(star) : undefined}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            {star <= rating ? (
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
        {!interactive && (
          <span className="ml-2 text-sm text-gray-600">
            ({rating}) - {reviews.length} review
            {reviews.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="text-center card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Service Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The requested service could not be found."}
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
            {service.image_url ? (
              <LazyImage
                src={service.image_url}
                alt={service.name}
                className="w-full h-96 rounded-lg shadow-md"
              />
            ) : (
              <LazyImage
                src={getFallbackImage(service.name)}
                alt={service.name}
                className="w-full h-96 rounded-lg shadow-md"
              />
            )}
          </div>

          {/* Service Info */}
          <div className="space-y-6 card">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {service.name}
              </h1>
              <p className="text-lg text-gray-600">{service.short_desc}</p>
            </div>

            {/* Rating */}
            <div>
              {service.avg_rating > 0 ? (
                renderStars(service.avg_rating)
              ) : (
                <span className="text-gray-500">No ratings yet</span>
              )}
              <span className="text-sm text-gray-500 ml-4">
                {service.review_count} review
                {service.review_count !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Price */}
            <div className="bg-primary-50/50 p-4 rounded-lg backdrop-blur-sm border border-primary-100/50">
              <span className="text-3xl font-bold text-primary-600">
                ৳{service.price}
              </span>
              <span className="text-gray-600 ml-2">per service</span>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label
                  htmlFor={quantitySelectId}
                  className="text-sm font-medium text-gray-700"
                >
                  Quantity:
                </label>
                <select
                  id={quantitySelectId}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  className="border border-gray-300/50 rounded-lg px-3 py-1 backdrop-blur-sm bg-white/50"
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
                disabled={addingToCart}
                className="w-full btn-primary flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>
                  {addingToCart ? "Adding to Cart..." : "Add to Cart"}
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
              Reviews ({reviews.length})
            </h2>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
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

          {/* Review Form */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-8 p-4 bg-gray-50/50 rounded-lg backdrop-blur-sm border border-gray-200/50"
            >
              <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>

              <div className="mb-4">
                <label
                  htmlFor={ratingId}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Rating
                </label>
                {renderStars(reviewForm.rating, true, (rating) =>
                  setReviewForm({ ...reviewForm, rating }),
                )}
              </div>

              <label
                htmlFor={reviewTextId}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Review
              </label>
              <textarea
                id={reviewTextId}
                value={reviewForm.text}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, text: e.target.value })
                }
                rows={4}
                className="input-field"
                placeholder="Share your experience with this service..."
                required
              />

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-primary backdrop-blur-sm"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn-secondary backdrop-blur-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No reviews yet. Be the first to review this service!
              </p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200/50 pb-6 last:border-b-0"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-300/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <UserIcon className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {review.user_name || "Anonymous"}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500 flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  </div>
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
