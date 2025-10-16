// OrdersPage.jsx
// This component displays the user's order history with details and management options

import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  useCreateReviewMutation,
  useGetUserOrdersQuery,
  useUpdateReviewMutation,
} from "../store/extendedApiSlice";

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const searchInputId = useId();
  const statusSelectId = useId();
  const reviewTextId = useId();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [reviewForm, setReviewForm] = useState({
    orderId: null,
    serviceId: null,
    rating: 5,
    text: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: orders, isLoading, isError, error } = useGetUserOrdersQuery();
  const [updateReview] = useUpdateReviewMutation();
  const [createReview] = useCreateReviewMutation();

  // Check authentication
  if (!isAuthenticated) {
    navigate("/login", { state: { from: { pathname: "/dashboard/orders" } } });
    return null;
  }

  // Filter orders based on search and status
  let filteredOrders = orders || [];

  if (searchTerm) {
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.id.toString().includes(searchTerm) ||
        order.transaction_id
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (selectedStatus !== "all") {
    filteredOrders = filteredOrders.filter(
      (order) => order.status === selectedStatus,
    );
  }

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      if (reviewForm.orderId) {
        // This is for updating an existing review
        await updateReview({
          id: reviewForm.orderId,
          reviewData: {
            rating: reviewForm.rating,
            text: reviewForm.text,
          },
        });
      } else {
        // This is for creating a new review
        await createReview({
          serviceId: reviewForm.serviceId,
          reviewData: {
            rating: reviewForm.rating,
            text: reviewForm.text,
          },
        });
      }

      // Reset form
      setReviewForm({
        orderId: null,
        serviceId: null,
        rating: 5,
        text: "",
      });
      setShowReviewForm(false);

      // Show success message
      showToast("Review submitted successfully!", "success");
    } catch (err) {
      console.error("Failed to submit review:", err);
      showToast("Failed to submit review. Please try again.", "error");
    }
  };

  // Render order status badge
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
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}
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
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    );
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
            Error Loading Orders
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || "Failed to load your orders. Please try again."}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <ClipboardDocumentListIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm bg-white/80 border border-gray-200/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor={searchInputId}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Orders
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id={searchInputId}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-2 sm:text-sm border-gray-300/50 rounded-lg backdrop-blur-sm bg-white/50"
                  placeholder="Search by order ID, transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={statusSelectId}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Status
              </label>
              <select
                id={statusSelectId}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full py-2 sm:text-sm border-gray-300/50 rounded-lg backdrop-blur-sm bg-white/50"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Total Orders
              </div>
              <div className="text-lg font-semibold text-gray-900 py-2">
                {filteredOrders.length}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedStatus !== "all"
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "You have not placed any orders yet."}
              </p>
              {!searchTerm && selectedStatus === "all" && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/services")}
                    className="btn-primary"
                  >
                    Browse Services
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Items
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Payment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200/50">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.transaction_id || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items?.length || 0} item(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                        ৳{parseFloat(order.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderPaymentStatusBadge(order.payment_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/dashboard/orders/${order.id}`)
                            }
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                          {order.status === "completed" && (
                            <button
                              type="button"
                              onClick={() => {
                                setReviewForm({
                                  orderId: null,
                                  serviceId: order.items?.[0]?.service?.id,
                                  rating: 5,
                                  text: "",
                                });
                                setShowReviewForm(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              Leave Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Leave a Review
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
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
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Submit Review
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

export default OrdersPage;
