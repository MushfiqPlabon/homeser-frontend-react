// src/components/EmailVerification.jsx
// Component for email verification

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useVerifyEmailQuery } from "../store/extendedApiSlice";

const EmailVerification = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  // Using the RTK Query hook to verify email
  const { data, error, isLoading, isFetching } = useVerifyEmailQuery(
    { uidb64, token },
    {
      skip: !uidb64 || !token, // Skip the query if uidb64 or token is missing
    },
  );

  useEffect(() => {
    if (!uidb64 || !token) {
      setVerificationStatus("error");
      setMessage("Invalid verification link.");
      showToast("Invalid verification link.", "error");
      return;
    }

    // Handle loading state
    if (isLoading || isFetching) {
      setVerificationStatus("verifying");
      return;
    }

    // Handle successful response
    if (data) {
      if (data.success) {
        setVerificationStatus("success");
        const successMessage = data.message || "Email verified successfully!";
        setMessage(successMessage);
        showToast(successMessage, "success");

        // Redirect to dashboard after successful verification
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setVerificationStatus("error");
        const errorMessage = data.message || "Email verification failed.";
        setMessage(errorMessage);
        showToast(errorMessage, "error");
      }
    }

    // Handle error response
    if (error) {
      setVerificationStatus("error");
      const errorMessage =
        error.data?.message || error.error || "Email verification failed.";
      setMessage(errorMessage);
      showToast(errorMessage, "error");
    }
  }, [data, error, isLoading, isFetching, uidb64, token, navigate, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {verificationStatus === "verifying" && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-green-600 font-medium">{message}</p>
              <p className="text-gray-600 mt-2">
                Redirecting to your dashboard...
              </p>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-red-600 font-medium">{message}</p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Homepage
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
