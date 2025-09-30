// ReviewsPage.jsx
// This component displays all reviews submitted by the user

import {
  ChatBubbleLeftRightIcon,
  PencilIcon,
  StarIcon as StarIconSolid,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  useDeleteReview,
  useUpdateReview,
  useUserReviews,
} from "../hooks/useApi";
import { renderStars } from "../utils/uiUtils.jsx";

const ReviewsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const editReviewTextId = useId();

  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, text: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deletingId, setDeletingId] = useState(null);

  const {
    data: reviews,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserReviews();
  const [updateReview] = useUpdateReview();
  const [deleteReview] = useDeleteReview();

  // Check authentication
  if (!isAuthenticated) {
    navigate("/login", { state: { from: { pathname: "/dashboard/reviews" } } });
    return null;
  }

  // Handle edit review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      text: review.text,
    });
  };

  // Handle update review
  const handleUpdateReview = async (e) => {
    e.preventDefault();

    try {
      await updateReview({
        reviewId: editingReview.id,
        reviewData: editForm,
      });

      setMessage({ type: "success", text: "Review updated successfully!" });
      setEditingReview(null);
      setEditForm({ rating: 5, text: "" });
      refetch();
    } catch (_err) {
      setMessage({
        type: "error",
        text: "Failed to update review. Please try again.",
      });
    }
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setDeletingId(reviewId);

    try {
      await deleteReview(reviewId);
      setMessage({ type: "success", text: "Review deleted successfully!" });
      refetch();
    } catch (_err) {
      setMessage({
        type: "error",
        text: "Failed to delete review. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
            Error Loading Reviews
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || "Failed to load your reviews. Please try again."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg backdrop-blur-sm ${
              message.type === "success"
                ? "bg-green-50/80 border border-green-200/50 text-green-600"
                : "bg-red-50/80 border border-red-200/50 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {reviews?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg backdrop-blur-sm bg-white/80 border border-gray-200/50">
            <ChatBubbleLeftRightIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No reviews yet
            </h3>
            <p className="mt-1 text-gray-500">
              You haven't submitted any reviews. Start by ordering a service!
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews?.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50 hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditReview(review)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={deletingId === review.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deletingId === review.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.text}</p>

                  <div className="border-t border-gray-200/50 pt-4">
                    <div className="flex items-center mb-2">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {review.service?.image_url ? (
                          <img
                            src={review.service.image_url}
                            alt={review.service.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-600">
                            {review.service?.name?.charAt(0) || "S"}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          {review.service?.name || "Service"}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Reviewed on {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center text-sm">
                      <span className="text-gray-500">Updated: </span>
                      <span className="ml-1 text-gray-900">
                        {formatDate(review.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Review Modal */}
        {editingReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Review
              </h3>

              <form onSubmit={handleUpdateReview} className="space-y-4">
                <div>
                  <div className="block text-sm font-medium text-gray-700 mb-2">
                    Service: {editingReview.service?.name}
                  </div>
                </div>

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
                          setEditForm({ ...editForm, rating: star })
                        }
                        className="focus:outline-none"
                        aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                      >
                        {star <= editForm.rating ? (
                          <StarIconSolid className="h-6 w-6 text-yellow-400" />
                        ) : (
                          <StarIcon className="h-6 w-6 text-gray-300" />
                        )}
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {editForm.rating} out of 5
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={editReviewTextId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Review
                  </label>
                  <textarea
                    id={editReviewTextId}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                    value={editForm.text}
                    onChange={(e) =>
                      setEditForm({ ...editForm, text: e.target.value })
                    }
                    placeholder="Update your review..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReview(null);
                      setEditForm({ rating: 5, text: "" });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Update Review
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

export default ReviewsPage;
