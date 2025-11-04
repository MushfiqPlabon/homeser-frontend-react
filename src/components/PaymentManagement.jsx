// PaymentManagement.jsx
// Component for managing payments, refunds, and disputes in admin panel

import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import {
  useGetAdminOrdersQuery,
  useGetPaymentAnalyticsQuery,
  useInitiateDisputeMutation,
  useInitiateRefundMutation,
} from "../store/extendedApiSlice";

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Generate unique IDs for form elements
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
  } = useGetAdminOrdersQuery();

  const [refundData, setRefundData] = useState({
    amount: "",
    reason: "",
  });

  const [disputeData, setDisputeData] = useState({
    reason: "",
  });

  const handleInitiateRefund = async () => {
    try {
      const payload = {
        payment_id: selectedPayment.id,
        refund_amount: parseFloat(refundData.amount),
        reason: refundData.reason,
      };
      await initiateRefund(payload).unwrap();
      setShowRefundModal(false);
      setRefundData({ amount: "", reason: "" });
      setSelectedPayment(null);
    } catch (error) {
      console.error("Failed to initiate refund:", error);
    }
  };

  const handleInitiateDispute = async () => {
    try {
      const payload = {
        payment_id: selectedPayment.id,
        dispute_reason: disputeData.reason,
      };
      await initiateDispute(payload).unwrap();
      setShowDisputeModal(false);
      setDisputeData({ reason: "" });
      setSelectedPayment(null);
    } catch (error) {
      console.error("Failed to initiate dispute:", error);
    }
  };

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

  // Filter to only show paid orders
  const paidOrders = filteredOrders.filter(
    (order) => order.payment_status === "paid",
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search payments..."
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsLoading
                  ? "Loading..."
                  : `৳${(paymentAnalytics?.total_revenue || 0).toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
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

        <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsLoading
                  ? "Loading..."
                  : `${paymentAnalytics?.success_rate || 0}%`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50">
        <div className="px-6 py-4 border-b border-gray-200/50">
          <h3 className="text-lg font-medium text-gray-900">
            Payment Transactions
          </h3>
        </div>

        {ordersLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : ordersError ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              Failed to load payment transactions
            </div>
            <button type="button" className="btn-primary">
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {paidOrders.map((order) => (
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
                      ৳{order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            order.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : order.payment_status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.payment_status === "refunded"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.payment_status === "disputed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {order.payment_status || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.created
                        ? new Date(order.created).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPayment(order);
                            setShowRefundModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          disabled={
                            order.payment_status === "refunded" ||
                            order.payment_status === "disputed"
                          }
                        >
                          <ArrowsRightLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPayment(order);
                            setShowDisputeModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          disabled={order.payment_status === "disputed"}
                        >
                          <ExclamationTriangleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Initiate Refund
            </h3>
            <div className="space-y-4">
              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Transaction ID
                </div>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedPayment.transaction_id || "N/A"}
                </div>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Order ID
                </div>
                <div className="mt-1 text-sm text-gray-900">
                  #{selectedPayment.id}
                </div>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Customer
                </div>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedPayment.customer_name ||
                    selectedPayment.user?.username ||
                    "N/A"}
                </div>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Original Amount
                </div>
                <div className="mt-1 text-sm text-gray-900">
                  ৳{selectedPayment.total?.toFixed(2) || "0.00"}
                </div>
              </div>
              <div>
                <label
                  htmlFor={refundAmountId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Refund Amount
                </label>
                <input
                  id={refundAmountId}
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedPayment.total}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={refundData.amount}
                  onChange={(e) =>
                    setRefundData({ ...refundData, amount: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={refundReasonId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Reason for Refund
                </label>
                <textarea
                  id={refundReasonId}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={refundData.reason}
                  onChange={(e) =>
                    setRefundData({ ...refundData, reason: e.target.value })
                  }
                  placeholder="Enter reason for refund..."
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
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInitiateRefund}
                disabled={
                  isRefunding || !refundData.amount || !refundData.reason
                }
                className="btn-primary"
              >
                {isRefunding ? "Processing..." : "Initiate Refund"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Initiate Dispute
            </h3>
            <div className="space-y-4">
              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Transaction ID
                </div>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedPayment.transaction_id || "N/A"}
                </div>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Order ID
                </div>
                <div className="mt-1 text-sm text-gray-900">
                  #{selectedPayment.id}
                </div>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Customer
                </div>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedPayment.customer_name ||
                    selectedPayment.user?.username ||
                    "N/A"}
                </div>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Amount
                </div>
                <div className="mt-1 text-sm text-gray-900">
                  ৳{selectedPayment.total?.toFixed(2) || "0.00"}
                </div>
              </div>
              <div>
                <label
                  htmlFor={disputeReasonId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Reason for Dispute
                </label>
                <textarea
                  id={disputeReasonId}
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300/50 rounded-md shadow-xs focus:outline-hidden focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={disputeData.reason}
                  onChange={(e) =>
                    setDisputeData({ ...disputeData, reason: e.target.value })
                  }
                  placeholder="Enter detailed reason for dispute..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDisputeModal(false);
                  setSelectedPayment(null);
                  setDisputeData({ reason: "" });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInitiateDispute}
                disabled={isDisputing || !disputeData.reason}
                className="btn-primary"
              >
                {isDisputing ? "Processing..." : "Initiate Dispute"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
