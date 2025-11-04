import Pusher from "pusher-js";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        encrypted: true,
      });

      pusher.connection.bind("connected", () => {
        setIsConnected(true);
      });

      pusher.connection.bind("disconnected", () => {
        setIsConnected(false);
      });

      const channel = pusher.subscribe(`user_${user.id}`);

      channel.bind("order_update", (data) => {
        console.log("Order status update:", data);
        // You can update your state or show a notification here
      });

      channel.bind("payment_update", (data) => {
        console.log("Payment status update:", data);
        // You can update your state or show a notification here
      });

      channel.bind("notification", (data) => {
        console.log("Notification:", data);
        setNotifications((prev) => [...prev, { ...data, id: Date.now() }]);
      });

      return () => {
        channel.unbind_all();
        pusher.unsubscribe(`user_${user.id}`);
        pusher.disconnect();
      };
    }
  }, [isAuthenticated, user?.id]);

  const value = {
    notifications,
    isConnected,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
