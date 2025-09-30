// AdminOrderManagement.jsx
// Component for managing orders in admin panel with full CRUD operations

import {
  ArrowPathIcon,
  ShoppingCartIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../store/extendedApiSlice";

const AdminOrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Generate unique ID for the status select element
  const newStatusSelectId = useId();

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetAdminOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  // Filter orders based on search term and selected status
  const filteredOrders =
    orders?.filter((order) => {
      const matchesSearch =
        !searchTerm ||
        order.id.toString().includes(searchTerm) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    }) || [];

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await updateOrderStatus({
        id: selectedOrder.id,
        statusData: { status: newStatus },
      });
      setNewStatus("");
      refetch();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: "Pending", color: "bg-yellow-100 text-yellow-800" },
      confirmed: { text: "Confirmed", color: "bg-blue-100 text-blue-800" },
      in_progress: {
        text: "In Progress",
        color: "bg-indigo-100 text-indigo-800",
      },
      completed: { text: "Completed", color: "bg-green-100 text-green-800" },
      cancelled: { text: "Cancelled", color: "bg-red-100 text-red-800" },
    };

    const statusInfo = statusMap[status] || {
      text: status,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      paid: { text: "Paid", color: "bg-green-100 text-green-800" },
      pending: { text: "Pending", color: "bg-yellow-100 text-yellow-800" },
      failed: { text: "Failed", color: "bg-red-100 text-red-800" },
      refunded: { text: "Refunded", color: "bg-blue-100 text-blue-800" },
      disputed: { text: "Disputed", color: "bg-purple-100 text-purple-800" },
    };

    const statusInfo = statusMap[status] || {
      text: status,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search orders..."
            className="px-4 py-2 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
          <button
            type="button"
            onClick={refetch}
            className="btn-secondary flex items-center"
          >
            <ArrowPathIcon className="h-5 w-5 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Failed to load orders</div>
          <button type="button" onClick={refetch} className="btn-primary">
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50">
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
                    Customer
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
                    Date
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer_name || order.user?.username || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer_email || order.user?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ৳{(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusBadge(order.payment_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedStatus !== "all"
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "No orders exist in the system."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Order Details
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-4">
                <div className="bg-gray-50/50 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50">
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Order Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Order ID:</span>
                      <span className="text-sm font-medium">
                        #{selectedOrder.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Transaction ID:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedOrder.transaction_id || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="text-sm font-medium">
                        {getStatusBadge(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Payment Status:
                      </span>
                      <span className="text-sm font-medium">
                        {getPaymentStatusBadge(selectedOrder.payment_status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedOrder.created).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Updated:</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedOrder.modified).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50/50 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50">
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="text-sm font-medium">
                        {selectedOrder.customer_name ||
                          selectedOrder.user?.username ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium">
                        {selectedOrder.customer_email ||
                          selectedOrder.user?.email ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="text-sm font-medium">
                        {selectedOrder.customer_phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Address:</span>
                      <span className="text-sm font-medium">
                        {selectedOrder.customer_address || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="bg-gray-50/50 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50">
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center border-b border-gray-200/50 pb-2"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.service?.name || "Service"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Quantity: {item.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        ৳{(selectedOrder.subtotal || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Tax (5%):</span>
                      <span className="font-medium">
                        ৳{(selectedOrder.tax || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200/50">
                      <span>Total:</span>
                      <span className="text-primary-600">
                        ৳{(selectedOrder.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedOrder && newStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Order Status
            </h3>

            <div className="space-y-4">
              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID: #{selectedOrder.id}
                </div>
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              <div>
                <label
                  htmlFor={newStatusSelectId}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Status
                </label>
                <select
                  id={newStatusSelectId}
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setNewStatus("");
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={isUpdating || newStatus === selectedOrder.status}
                className="btn-primary"
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
