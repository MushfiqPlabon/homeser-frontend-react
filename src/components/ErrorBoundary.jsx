// ErrorBoundary.jsx
// Global error boundary component to catch unexpected errors and show user-friendly messages

import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Update state with error info
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Error Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                We're sorry, but an unexpected error occurred while loading this
                page.
              </p>
              <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-red-800">
                  Error Details:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{this.state.error?.toString()}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 justify-center">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Reload Page
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Go Home
                </Link>
              </div>
              <div className="mt-6">
                <p className="text-xs text-gray-500">
                  If this problem persists, please contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Return children components normally
    return this.props.children;
  }
}

// Component-specific error boundary for loading states that might return null
export class LoadingErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("LoadingErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error: error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-yellow-50/80 border border-yellow-200/50 text-yellow-700 px-4 py-3 rounded-md mb-6 backdrop-blur-sm">
          <p>
            Warning: Unable to load content properly.{" "}
            {this.state.error?.toString() || "An error occurred."}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 btn-secondary text-sm"
          >
            Reload Content
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
