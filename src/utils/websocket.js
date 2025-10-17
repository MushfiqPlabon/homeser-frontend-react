class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectInterval = 5000; // 5 seconds
    this.maxReconnectAttempts = 10;
    this.reconnectAttempts = 0;
    this.eventHandlers = {};
    this.url = null;
    this.token = null;
  }

  connect(url, token = null) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }

    this.url = url;
    this.token = token;

    // Construct WebSocket URL without token in URL for security
    // Authentication will be done through initial message after connection
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      
      // Send authentication message after connection is established
      if (this.token) {
        this.send({
          type: "authenticate",
          token: this.token
        });
      }
      
      this.onConnected();
      this.reconnectAttempts = 0; // Reset on successful connection
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.triggerEvent("error", error);
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason);
      this.onDisconnected();

      // Attempt to reconnect if not exceeding max attempts and if it wasn't a manual disconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(
          `Attempting to reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`,
        );
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect(this.url, this.token);
        }, this.reconnectInterval * this.reconnectAttempts); // Exponential backoff
      } else {
        console.log("Max reconnection attempts reached");
        this.triggerEvent("maxReconnectAttemptsReached");
      }
    };
  }

  onConnected() {
    // Trigger any connection-specific callbacks
    this.triggerEvent("connected", {});
  }

  onDisconnected() {
    // Trigger any disconnection-specific callbacks
    this.triggerEvent("disconnected", {});
  }

  handleMessage(data) {
    // Handle different message types
    switch (data.type) {
      case "authenticate_response":
        // Handle authentication response from server
        if (data.success) {
          console.log("WebSocket authentication successful");
          this.triggerEvent("authenticated", data);
        } else {
          console.error("WebSocket authentication failed:", data.error);
          this.triggerEvent("authentication_failed", data);
        }
        break;
      case "order_status_update":
        this.triggerEvent("order_status_update", data);
        break;
      case "notification":
        this.triggerEvent("notification", data);
        break;
      case "payment_status_update":
        this.triggerEvent("payment_status_update", data);
        break;
      case "request_order_updates":
        // This is a response confirming subscription request
        this.triggerEvent("order_subscription_confirmed", data);
        break;
      default:
        console.log("Unknown message type:", data.type);
        this.triggerEvent("unknown_message", data);
    }
  }

  // Subscribe to events
  on(event, callback) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(callback);
  }

  // Unsubscribe from events
  off(event, callback) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(
        (handler) => handler !== callback,
      );
    }
  }

  // Trigger event handlers
  triggerEvent(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach((callback) => {
        // Wrap callback in try-catch to prevent one callback from breaking others
        try {
          callback(data);
        } catch (error) {
          console.error("Error in WebSocket event callback:", error);
        }
      });
    }
  }

  // Send data to WebSocket server
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not open, cannot send data", data);
    }
  }

  // Disconnect from WebSocket server
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Check if WebSocket is connected
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  // Subscribe to order updates
  subscribeToOrder(orderId) {
    this.send({
      type: "request_order_updates",
      order_id: orderId,
    });
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

// Function to get WebSocket URL based on current environment
export const getWebSocketURL = () => {
  // Get the base URL from environment variable or construct based on current location
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const backendUrl =
    import.meta.env.VITE_WS_BASE_URL ||
    `${protocol}//${window.location.hostname}:${window.location.port || (window.location.protocol === "https:" ? 443 : 80)}/ws`;

  return backendUrl;
};

export default webSocketService;
