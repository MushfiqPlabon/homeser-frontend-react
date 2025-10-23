// src/components/ResendVerificationEmail.jsx
// Component for resending email verification

import { useState } from "react";
import { useToast } from "../context/ToastContext";

const ResendVerificationEmail = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [triggerResendVerification] = useResendVerification();

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const response = await triggerResendVerification();

      if (response.data?.success) {
        showToast(
          response.data?.message || "Verification email sent successfully!",
          "success",
        );
      } else {
        showToast(
          response.data?.message || "Failed to send verification email.",
          "error",
        );
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to resend verification email.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Email Verification
      </h3>
      <p className="text-gray-600 mb-4">
        Your email address is not yet verified. Please check your inbox for a
        verification email. If you haven't received it, you can request a new
        one.
      </p>
      <button
        type="button"
        onClick={handleResendVerification}
        disabled={loading}
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending...
          </>
        ) : (
          "Resend Verification Email"
        )}
      </button>
    </div>
  );
};

export default ResendVerificationEmail;
