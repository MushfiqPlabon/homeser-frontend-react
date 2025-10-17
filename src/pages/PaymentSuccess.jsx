// PaymentSuccess.jsx
// This page component is displayed after a successful payment, confirming the order
// and providing next steps for the user.

import { CheckCircleIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import { useGetUserOrdersQuery } from "../store/apiSlice";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const { isConnected, subscribeToOrder } = useWebSocket();
  const [realTimeOrder, setRealTimeOrder] = useState(null);
  const [orderUpdates, setOrderUpdates] = useState(new Map());

  const {
    data: userOrders,
    isLoading,
    isError,
    error,
  } = useGetUserOrdersQuery();

  // Find the specific order by ID and apply real-time updates
  useEffect(() => {
    if (userOrders && orderId) {
      const baseOrder = userOrders.find(
        (order) => order.id === parseInt(orderId, 10),
      );

      if (baseOrder) {
        const update = orderUpdates.get(parseInt(orderId, 10));
        if (update) {
          setRealTimeOrder({ ...baseOrder, ...update });
        } else {
          setRealTimeOrder(baseOrder);
        }
      }
    }
  }, [userOrders, orderId, orderUpdates]);

  // Subscribe to WebSocket events for order updates
  useEffect(() => {
    if (!isConnected || !orderId) return;

    // Subscribe to this specific order
    subscribeToOrder(parseInt(orderId, 10));

    // Handle order status updates
    const handleOrderUpdate = (data) => {
      if (data.order_id === parseInt(orderId, 10)) {
        setOrderUpdates((prev) => {
          const newUpdates = new Map(prev);
          newUpdates.set(data.order_id, {
            status: data.status,
            payment_status: data.payment_status,
            timestamp: data.timestamp,
            isUpdated: true,
          });
          return newUpdates;
        });
      }
    };

    // Add event listener for WebSocket events
    window.addEventListener("orderUpdate", (e) => {
      handleOrderUpdate(e.detail);
    });

    // Cleanup on unmount
    return () => {
      window.removeEventListener("orderUpdate", handleOrderUpdate);
    };
  }, [isConnected, orderId, subscribeToOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-lg">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <CheckCircleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Order
            </h2>
            <p className="text-gray-600 mb-6">
              {error?.message || "Failed to load order details"}
            </p>
            <Link to="/dashboard" className="w-full btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Use the real-time order data if available, otherwise fall back to the base order
  const orderDetails = realTimeOrder;

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <CheckCircleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The requested order could not be found.
            </p>
            <Link to="/dashboard" className="w-full btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your order has been confirmed and our
            team will contact you soon.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Order Details
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-medium">#{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <div className="flex items-center">
                  <span
                    className={`font-medium ${
                      orderDetails.status === "completed"
                        ? "text-green-600"
                        : orderDetails.status === "cancelled"
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                  >
                    {orderDetails.status}
                  </span>
                  {orderUpdates.get(parseInt(orderId, 10))?.isUpdated && (
                    <span className="ml-2 text-xs text-blue-600 animate-pulse">
                      (Updated)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <div className="flex items-center">
                  <span
                    className={`font-medium ${
                      orderDetails.payment_status === "paid"
                        ? "text-green-600"
                        : orderDetails.payment_status === "failed"
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                  >
                    {orderDetails.payment_status}
                  </span>
                  {orderUpdates.get(parseInt(orderId, 10))?.isUpdated && (
                    <span className="ml-2 text-xs text-blue-600 animate-pulse">
                      (Updated)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">
                  ৳{orderDetails.total?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              What's Next?
            </h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Our team will contact you within 24 hours</li>
              <li>• Service will be scheduled at your convenience</li>
              <li>• Track your order in the dashboard</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to={`/dashboard/orders/${orderDetails.id}`}
              className="w-full btn-primary inline-block text-center"
            >
              View Order Details
            </Link>
            <Link
              to="/dashboard"
              className="w-full btn-secondary inline-block text-center"
            >
              View Dashboard
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
