// PaymentRefundDisputeManagement.jsx
// Component for managing payment refunds and disputes in admin panel

import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import {
  useGetAdminOrdersQuery,
  useInitiateRefundMutation,
  useInitiateDisputeMutation,
  useGetPaymentAnalyticsQuery,
} from "../store/extendedApiSlice";

const PaymentRefundDisputeManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [refundData, setRefundData] = useState({
    amount: "",
    reason: "",
  });
  const [disputeData, setDisputeData] = useState({
    reason: "",
  });
  const [submittingRefund, setSubmittingRefund] = useState(false);
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Generate unique IDs for form elements
  const searchTermId = useId();
  const statusSelectId = useId();
  const refundAmountId = useId();
  const refundReasonId = useId();
  const disputeReasonId = useId();

  // API hooks
  const { data: paymentAnalytics, isLoading: analyticsLoading } =
    useGetPaymentAnalyticsQuery();
  const [initiateRefund, { isLoading: isRefunding }] =
    useInitiateRefundMutation();
  const [initiateDispute, { isLoading: isDisputing }] =
    useInitiateDisputeMutation();

  const {
    data: orders,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useGetAdminOrdersQuery();

  // Filter orders based on search term and selected status
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
      (order) => order.payment_status === selectedStatus,
    );
  }

  // Filter to only show paid orders that can be refunded or disputed
  const refundableOrders = filteredOrders.filter(
    (order) =>
      order.payment_status === "paid" ||
      order.payment_status === "refunded" ||
      order.payment_status === "disputed",
  );

  // Handle initiate refund
  const handleInitiateRefund = async () => {
    if (!selectedPayment || !refundData.amount || !refundData.reason) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setSubmittingRefund(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        payment_id: selectedPayment.id,
        refund_amount: parseFloat(refundData.amount),
        reason: refundData.reason,
      };

      await initiateRefund(payload).unwrap();
      setMessage({ type: "success", text: "Refund initiated successfully!" });
      setShowRefundModal(false);
      setRefundData({ amount: "", reason: "" });
      setSelectedPayment(null);
      refetchOrders(); // Refresh orders after refund initiation
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to initiate refund";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSubmittingRefund(false);
    }
  };

  // Handle initiate dispute
  const handleInitiateDispute = async () => {
    if (!selectedPayment || !disputeData.reason) {
      setMessage({
        type: "error",
        text: "Please provide a reason for the dispute",
      });
      return;
    }

    setSubmittingDispute(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        payment_id: selectedPayment.id,
        dispute_reason: disputeData.reason,
      };

      await initiateDispute(payload).unwrap();
      setMessage({ type: "success", text: "Dispute initiated successfully!" });
      setShowDisputeModal(false);
      setDisputeData({ reason: "" });
      setSelectedPayment(null);
      refetchOrders(); // Refresh orders after dispute initiation
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to initiate dispute";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSubmittingDispute(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  // Render status badge
  const renderStatusBadge = (status) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <ArrowsRightLeftIcon className="h-8 w-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50/80 border border-green-200/50 text-green-600"
              : "bg-red-50/80 border border-red-200/50 text-red-600"
          } backdrop-blur-sm`}
        >
          {message.text}
        </div>
      )}

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm bg-white/80 border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsLoading
                  ? "Loading..."
                  : formatCurrency(paymentAnalytics?.total_revenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm bg-white/80 border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <ArrowPathIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsLoading
                  ? "Loading..."
                  : paymentAnalytics?.total_orders || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm bg-white/80 border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsLoading
                  ? "Loading..."
                  : formatPercentage(paymentAnalytics?.success_rate || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor={searchTermId}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Payments
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id={searchTermId}
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
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Total Refundable Orders
            </div>
            <div className="text-lg font-semibold text-gray-900 py-2">
              {refundableOrders.length}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50">
        <div className="px-6 py-4 border-b border-gray-200/50">
          <h2 className="text-lg font-medium text-gray-900">
            Payment Transactions
          </h2>
        </div>

        {ordersLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
          </div>
        ) : ordersError ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              Failed to load payment transactions
            </div>
            <button
              type="button"
              onClick={refetchOrders}
              className="btn-primary"
            >
              Retry
            </button>
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
                    Transaction ID
                  </th>
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
                    Amount
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
                {refundableOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.transaction_id || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer_name || order.user?.username || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer_email || order.user?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(order.total || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(order.payment_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {(order.payment_status === "paid" ||
                          order.payment_status === "refunded") && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPayment(order);
                              setShowRefundModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                            disabled={isRefunding}
                          >
                            <ArrowsRightLeftIcon className="h-5 w-5" />
                          </button>
                        )}
                        {order.payment_status === "paid" && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPayment(order);
                              setShowDisputeModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={isDisputing}
                          >
                            <ExclamationTriangleIcon className="h-5 w-5" />
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

        {refundableOrders.length === 0 && (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No refundable orders
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedStatus !== "all"
                ? "Try adjusting your search or filter to find what you're looking for."
                : "No orders are currently eligible for refunds or disputes."}
            </p>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Initiate Refund
            </h3>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Transaction ID
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedPayment.transaction_id || "N/A"}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Order ID
                </div>
                <div className="text-sm font-medium text-gray-900">
                  #{selectedPayment.id}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Customer
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedPayment.customer_name ||
                    selectedPayment.user?.username ||
                    "N/A"}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedPayment.customer_email ||
                    selectedPayment.user?.email ||
                    "N/A"}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Original Amount
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(selectedPayment.total || 0)}
                </div>
              </div>

              <div>
                <label
                  htmlFor={refundAmountId}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Refund Amount *
                </label>
                <input
                  type="number"
                  id={refundAmountId}
                  step="0.01"
                  min="0"
                  max={selectedPayment.total}
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={refundData.amount}
                  onChange={(e) =>
                    setRefundData({ ...refundData, amount: e.target.value })
                  }
                  placeholder="Enter refund amount"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Maximum refundable amount:{" "}
                  {formatCurrency(selectedPayment.total || 0)}
                </p>
              </div>

              <div>
                <label
                  htmlFor={refundReasonId}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reason for Refund *
                </label>
                <textarea
                  id={refundReasonId}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={refundData.reason}
                  onChange={(e) =>
                    setRefundData({ ...refundData, reason: e.target.value })
                  }
                  placeholder="Enter reason for refund..."
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowRefundModal(false);
                  setSelectedPayment(null);
                  setRefundData({ amount: "", reason: "" });
                  setMessage({ type: "", text: "" });
                }}
                className="btn-secondary"
                disabled={submittingRefund}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInitiateRefund}
                disabled={
                  submittingRefund || !refundData.amount || !refundData.reason
                }
                className="btn-primary"
              >
                {submittingRefund ? "Processing..." : "Initiate Refund"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Initiate Dispute
            </h3>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Transaction ID
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedPayment.transaction_id || "N/A"}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Order ID
                </div>
                <div className="text-sm font-medium text-gray-900">
                  #{selectedPayment.id}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Customer
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedPayment.customer_name ||
                    selectedPayment.user?.username ||
                    "N/A"}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedPayment.customer_email ||
                    selectedPayment.user?.email ||
                    "N/A"}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Amount
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(selectedPayment.total || 0)}
                </div>
              </div>

              <div>
                <label
                  htmlFor={disputeReasonId}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reason for Dispute *
                </label>
                <textarea
                  id={disputeReasonId}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={disputeData.reason}
                  onChange={(e) =>
                    setDisputeData({ ...disputeData, reason: e.target.value })
                  }
                  placeholder="Enter detailed reason for dispute. Please provide as much information as possible to help us resolve this issue quickly."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  A dispute will be initiated with the payment processor. This
                  may take 5-10 business days to resolve.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDisputeModal(false);
                  setSelectedPayment(null);
                  setDisputeData({ reason: "" });
                  setMessage({ type: "", text: "" });
                }}
                className="btn-secondary"
                disabled={submittingDispute}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInitiateDispute}
                disabled={submittingDispute || !disputeData.reason}
                className="btn-primary"
              >
                {submittingDispute ? "Processing..." : "Initiate Dispute"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRefundDisputeManagement;
