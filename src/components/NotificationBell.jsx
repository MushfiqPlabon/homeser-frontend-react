import { BellIcon } from "@heroicons/react/24/outline";
import { useWebSocket } from "../context/WebSocketContext";

const NotificationBell = () => {
  const { notifications, isConnected } = useWebSocket();

  return (
    <div className="relative">
      <button
        type="button"
        className={`p-1 rounded-full ${
          isConnected ? "text-gray-700 hover:text-primary-600" : "text-red-500"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors`}
      >
        <span className="sr-only">View notifications</span>
        <BellIcon
          className={`h-6 w-6 ${!isConnected ? "animate-pulse" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Connection status indicator */}
      <div
        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
          isConnected ? "bg-green-500" : "bg-red-500 animate-pulse"
        }`}
        title={
          isConnected
            ? "Connected to real-time updates"
            : "Disconnected from real-time updates"
        }
      />

      {/* Notification count badge */}
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-ping-once">
          {notifications.length > 9 ? "9+" : notifications.length}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
