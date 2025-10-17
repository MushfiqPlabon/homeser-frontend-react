import {
  ArrowPathIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import { useGetUserOrdersQuery } from "../store/apiSlice";
import DashboardOrderSkeleton from "./DashboardOrderSkeleton";

const DashboardOrdersRealTime = () => {
  const navigate = useNavigate();
  const { isConnected, subscribeToOrder } = useWebSocket();
  const { data: orders, isLoading, isError, refetch } = useGetUserOrdersQuery();
  const [realTimeUpdates, setRealTimeUpdates] = useState(new Map());
  const [ordersWithUpdates, setOrdersWithUpdates] = useState([]);

  // Process orders and real-time updates together
  useEffect(() => {
    if (orders) {
      const updatedOrders = orders.map((order) => {
        const update = realTimeUpdates.get(order.id);
        return update ? { ...order, ...update } : order;
      });
      setOrdersWithUpdates(updatedOrders);
    }
  }, [orders, realTimeUpdates]);

  // Subscribe to WebSocket events for order updates
  useEffect(() => {
    if (isConnected) {
      // Listen for order updates from WebSocket
      const handleOrderUpdate = (data) => {
        setRealTimeUpdates((prev) => {
          const newUpdates = new Map(prev);
          newUpdates.set(data.order_id, {
            status: data.status,
            timestamp: data.timestamp,
            isUpdated: true,
          });
          return newUpdates;
        });
      };

      // Using a global event listener for now - would normally use custom hook
      window.addEventListener("orderUpdate", (e) => {
        handleOrderUpdate(e.detail);
      });

      // Cleanup function
      return () => {
        window.removeEventListener("orderUpdate", handleOrderUpdate);
      };
    }
  }, [isConnected]);

  // Subscribe to specific order updates when component mounts
  useEffect(() => {
    if (orders?.length > 0) {
      orders.forEach((order) => {
        subscribeToOrder(order.id);
      });
    }
  }, [orders, subscribeToOrder]);

  if (isLoading) {
    return <DashboardOrderSkeleton count={3} />;
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">
          Failed to load orders.{" "}
          <button
            type="button"
            onClick={() => refetch()}
            className="text-red-600 underline ml-2"
          >
            Retry
          </button>
        </p>
      </div>
    );
  }

  if (ordersWithUpdates.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
          <p className="text-sm text-gray-500 mt-2">
            Your order history will appear here once you make a purchase.
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm ${isConnected ? "text-green-600" : "text-red-600"}`}
          >
            {isConnected ? "Live" : "Offline"}
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" /> Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/orders")}
            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            View All Orders
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {ordersWithUpdates.slice(0, 5).map((order) => {
          const isUpdated = order.isUpdated;
          return (
            <div
              key={order.id}
              className={`border border-gray-200 rounded-lg p-4 transition-all duration-300 ${
                isUpdated
                  ? "bg-blue-50 border-blue-200 animate-pulse"
                  : "hover:bg-gray-50/50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Order #{order.id}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ৳{parseFloat(order.total).toFixed(2)}
                  </p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                    {isUpdated && (
                      <span className="ml-1 text-blue-600">(Updated)</span>
                    )}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  {order.items?.length || 0} item(s)
                </p>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardOrdersRealTime;
