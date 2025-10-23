// Minimal error tracking for production
class ErrorTracker {
  constructor() {
    this.errors = [];
    this.maxErrors = 50;
    this.listeners = [];
    this.init();
  }

  init() {
    window.addEventListener("error", this.handleGlobalError.bind(this));
    window.addEventListener(
      "unhandledrejection",
      this.handleUnhandledRejection.bind(this),
    );
  }

  handleGlobalError(event) {
    this.captureError({
      type: "javascript_error",
      message: event.message,
      timestamp: new Date().toISOString(),
    });
  }

  handleUnhandledRejection(event) {
    this.captureError({
      type: "unhandled_promise_rejection",
      message: event.reason?.message || "Unhandled Promise Rejection",
      timestamp: new Date().toISOString(),
    });
  }

  captureError(errorData) {
    const error = { id: Date.now(), ...errorData };
    this.errors.unshift(error);
    if (this.errors.length > this.maxErrors) this.errors.pop();
    this.notifyListeners(error);
    return error;
  }

  captureApiError(error, context = {}) {
    return this.captureError({
      type: "api_error",
      message: error.response?.data?.detail || error.message || "API Error",
      status: error.response?.status,
      timestamp: new Date().toISOString(),
      context,
    });
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) this.listeners.splice(index, 1);
  }

  notifyListeners(error) {
    this.listeners.forEach((listener) => {
      try {
        listener(error);
      } catch (_e) {
        // Silent fail
      }
    });
  }
}

const errorTracker = new ErrorTracker();

export const useErrorTracking = () => {
  return {
    captureError: errorTracker.captureError.bind(errorTracker),
    captureApiError: errorTracker.captureApiError.bind(errorTracker),
    getErrors: errorTracker.getErrors.bind(errorTracker),
    clearErrors: errorTracker.clearErrors.bind(errorTracker),
  };
};

export default errorTracker;
