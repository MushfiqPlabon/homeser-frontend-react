// ReviewManagement.jsx
// Component for managing reviews in admin panel

import { PencilIcon, StarIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useEffect, useId, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import {
  useDeleteReviewMutation,
  useGetReviewsQuery,
  useUpdateReviewMutation,
} from "../store/extendedApiSlice";

const ReviewManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { isConnected } = useWebSocket();

  const [realTimeReviews, setRealTimeReviews] = useState([]);
  const [reviewUpdates, setReviewUpdates] = useState(new Map());

  const isApprovedCheckboxId = useId();

  const { data: reviews, isLoading, isError, refetch } = useGetReviewsQuery();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const [editFormData, setEditFormData] = useState({
    rating: 0,
    text: "",
    is_approved: true,
  });

  // Update real-time reviews when the API data changes
  useEffect(() => {
    if (reviews) {
      // Apply any real-time updates to the reviews
      const updatedReviews = reviews.map((review) => {
        const update = reviewUpdates.get(review.id);
        return update ? { ...review, ...update } : review;
      });
      setRealTimeReviews(updatedReviews);
    }
  }, [reviews, reviewUpdates]);

  // Subscribe to WebSocket events for review updates
  useEffect(() => {
    if (!isConnected) return;

    // Handle review updates
    const handleReviewUpdate = (data) => {
      setReviewUpdates((prev) => {
        const newUpdates = new Map(prev);
        newUpdates.set(data.review_id, {
          ...data,
          isUpdated: true,
        });
        return newUpdates;
      });
    };

    // Handle review creation
    const handleReviewCreate = (_data) => {
      // For new reviews, refetch the reviews list
      refetch();
    };

    // Handle review deletion
    const handleReviewDelete = (_data) => {
      // For deletions, refetch the reviews list
      refetch();
    };

    // Add event listeners for WebSocket events
    window.addEventListener("reviewUpdate", (e) => {
      handleReviewUpdate(e.detail);
    });

    window.addEventListener("reviewCreate", (e) => {
      handleReviewCreate(e.detail);
    });

    window.addEventListener("reviewDelete", (e) => {
      handleReviewDelete(e.detail);
    });

    // Cleanup on unmount
    return () => {
      window.removeEventListener("reviewUpdate", handleReviewUpdate);
      window.removeEventListener("reviewCreate", handleReviewCreate);
      window.removeEventListener("reviewDelete", handleReviewDelete);
    };
  }, [isConnected, refetch]);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        refetch();
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const handleUpdateReview = async () => {
    try {
      await updateReview({ id: editingReview.id, reviewData: editFormData });
      setEditingReview(null);
      setEditFormData({ rating: 0, text: "", is_approved: true });
      setShowEditModal(false);
      refetch();
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  const handleStarClick = (rating) => {
    setEditFormData({ ...editFormData, rating });
  };

  // Function to render stars
  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} className="text-yellow-400">
        {star <= rating ? (
          <StarIconSolid className="h-5 w-5" />
        ) : (
          <StarIcon className="h-5 w-5" />
        )}
      </span>
    ));
  };

  // Filter reviews based on search term
  const filteredReviews =
    realTimeReviews?.filter(
      (review) =>
        review.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user?.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.service?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Reviews</h2>
        <div>
          <input
            type="text"
            placeholder="Search reviews..."
            className="px-4 py-2 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Failed to load reviews</div>
          <button
            type="button"
            onClick={() => refetch()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200/50">
                {filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className={`hover:bg-gray-50/30 ${
                      reviewUpdates.get(review.id)?.isUpdated
                        ? "bg-blue-50/30 ring-1 ring-blue-200 animate-pulse"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {review.user?.username || "Anonymous"}
                        {reviewUpdates.get(review.id)?.isUpdated && (
                          <span className="ml-2 text-xs text-blue-600 animate-pulse">
                            (Updated)
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {review.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {review.service?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {review.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            review.is_approved
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {review.is_approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReview(review);
                            setEditFormData({
                              rating: review.rating,
                              text: review.text,
                              is_approved: review.is_approved,
                            });
                            setShowEditModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-indigo-900 disabled:opacity-50"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {showEditModal && editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Review
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  User: {editingReview.user?.username}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Service: {editingReview.service?.name}
                </div>
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none"
                    >
                      <span className="text-yellow-400">
                        {star <= editFormData.rating ? (
                          <StarIconSolid className="h-6 w-6" />
                        ) : (
                          <StarIcon className="h-6 w-6" />
                        )}
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {editFormData.rating}/5
                  </span>
                </div>
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700 mb-1">
                  Review Text
                </div>
                <textarea
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={editFormData.text}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, text: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={isApprovedCheckboxId}
                  checked={editFormData.is_approved}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      is_approved: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={isApprovedCheckboxId}
                  className="ml-2 block text-sm text-gray-900"
                >
                  Approved
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingReview(null);
                  setEditFormData({ rating: 0, text: "", is_approved: true });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateReview}
                disabled={isUpdating}
                className="btn-primary"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
