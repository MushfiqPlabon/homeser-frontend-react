// OrderManagement.jsx
// Component for managing orders in admin panel

import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../store/extendedApiSlice";

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetAdminOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({
        id: orderId,
        statusData: { status: newStatus },
      });
      refetch();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Define status options
  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "in_progress",
      label: "In Progress",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  // Filter orders based on search term and selected status
  let filteredOrders = orders || [];
  if (searchTerm) {
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.id.toString().includes(searchTerm) ||
        order.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (selectedStatus !== "all") {
    filteredOrders = filteredOrders.filter(
      (order) => order.status === selectedStatus,
    );
  }

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "pending":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Manage Orders</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Failed to load orders</div>
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
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer_name || order.user?.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer_email || order.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ৳{order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 text-sm text-gray-500 capitalize">
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            order.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : order.payment_status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                      >
                        {order.payment_status || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={isUpdating}
                          className="text-sm border border-gray-300/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          View Details
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
    </div>
  );
};

export default OrderManagement;
