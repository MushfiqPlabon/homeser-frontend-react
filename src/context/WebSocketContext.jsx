import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../context/AuthContext";
import { webSocketCacheSync } from "../services/webSocketCacheSync";
import webSocketService from "../utils/websocket";

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated, tokens } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // disconnected, connecting, connected, error
  const [notifications, setNotifications] = useState([]);

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id && tokens?.access) {
      // Construct WebSocket URL based on available endpoints
      const wsBaseUrl =
        import.meta.env.VITE_WS_BASE_URL ||
        `ws://${window.location.hostname}:${window.location.port || 80}`;

      // Connect to the notifications endpoint by default
      webSocketService.connect(`${wsBaseUrl}/ws/notifications/`, tokens.access);

      // Set up event listeners
      webSocketService.on("connected", () => {
        setConnectionStatus("connected");
      });

      webSocketService.on("disconnected", () => {
        setConnectionStatus("disconnected");
      });

      webSocketService.on("error", (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("error");
      });

      webSocketService.on("order_status_update", (data) => {
        // Handle order status updates
        console.log("Order status update:", data);
        // Update RTK Query cache for consistency
        webSocketCacheSync.handleOrderUpdate(data);
        // Dispatch a custom event to notify components about the update
        window.dispatchEvent(new CustomEvent("orderUpdate", { detail: data }));
      });

      webSocketService.on("notification", (data) => {
        // Handle general notifications
        console.log("Notification:", data);
        setNotifications((prev) => [...prev, { ...data, id: Date.now() }]);
      });

      webSocketService.on("payment_status_update", (data) => {
        // Handle payment status updates
        console.log("Payment status update:", data);
        // Update RTK Query cache for consistency
        webSocketCacheSync.handlePaymentUpdate(data);
        // Could trigger a specific payment notification
      });

      webSocketService.on("review_update", (data) => {
        // Handle review updates
        console.log("Review update:", data);
        // Update RTK Query cache for consistency
        webSocketCacheSync.handleReviewUpdate(data);
      });

      // Cleanup on unmount
      return () => {
        webSocketService.disconnect();
        webSocketService.off("connected");
        webSocketService.off("disconnected");
        webSocketService.off("error");
        webSocketService.off("order_status_update");
        webSocketService.off("notification");
        webSocketService.off("payment_status_update");
        webSocketService.off("review_update");
      };
    } else {
      // If not authenticated, set connection to disconnected
      setConnectionStatus("disconnected");
    }
  }, [isAuthenticated, user?.id, tokens.access]);

  // Function to handle offline strategies
  const _handleOfflineAction = useCallback((action, data) => {
    // Queue actions for when connection is restored
    const offlineQueue = JSON.parse(
      localStorage.getItem("offlineActionQueue") || "[]",
    );
    offlineQueue.push({ action, data, timestamp: Date.now() });
    localStorage.setItem("offlineActionQueue", JSON.stringify(offlineQueue));

    // Show user feedback about offline status
    alert(
      "You are currently offline. Your action has been queued and will be processed when connection is restored.",
    );
  }, []);

  // Check for queued offline actions when connection is restored
  useEffect(() => {
    if (connectionStatus === "connected") {
      const offlineQueue = JSON.parse(
        localStorage.getItem("offlineActionQueue") || "[]",
      );
      if (offlineQueue.length > 0) {
        // Process queued actions
        console.log(`Processing ${offlineQueue.length} offline actions`);
        localStorage.removeItem("offlineActionQueue");

        // In a real implementation, you would send these actions to the server
        // For now, we'll just log them
        offlineQueue.forEach((action) => {
          console.log("Processing offline action:", action);
        });
      }
    }
  }, [connectionStatus]);

  // Function to subscribe to order updates
  const subscribeToOrder = (orderId) => {
    webSocketService.subscribeToOrder(orderId);
  };

  // Function to send a message
  const sendMessage = (data) => {
    webSocketService.send(data);
  };

  return (
    <WebSocketContext.Provider
      value={{
        connectionStatus,
        notifications,
        subscribeToOrder,
        sendMessage,
        isConnected: connectionStatus === "connected",
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
