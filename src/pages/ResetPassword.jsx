// ResetPassword.jsx
// Password reset confirmation page

import { useEffect, useId, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { authAPI } from "../utils/api";
import { handleApiError } from "../utils/errorHandler";

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await authAPI.validateResetToken(uidb64, token);
        if (response.data.valid) {
          setTokenValid(true);
          setUserEmail(response.data.email);
        } else {
          setError(response.data.error || "Invalid or expired reset link.");
        }
      } catch (_err) {
        setError("Invalid or expired reset link.");
      } finally {
        setValidating(false);
      }
    };

    if (uidb64 && token) {
      validateToken();
    } else {
      setError("Invalid reset link.");
      setValidating(false);
    }
  }, [uidb64, token]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords don't match.");
      return;
    }

    if (formData.new_password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.confirmPasswordReset({
        uidb64,
        token,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });

      setMessage(response.data.message);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password reset successful. Please login with your new password.",
          },
        });
      }, 3000);
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Validating reset link...</span>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Invalid Reset Link
            </h2>
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
            <div className="mt-6">
              <Link
                to="/forgot-password"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            for {userEmail}
          </p>
        </div>

        {message ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-center">
            <p className="font-medium">{message}</p>
            <p className="text-sm mt-2">Redirecting to login page...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor={newPasswordId}
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id={newPasswordId}
                  name="new_password"
                  type="password"
                  required
                  value={formData.new_password}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter new password (min. 8 characters)"
                />
              </div>

              <div>
                <label
                  htmlFor={confirmPasswordId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id={confirmPasswordId}
                  name="confirm_password"
                  type="password"
                  required
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.new_password ||
                  !formData.confirm_password
                }
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner size="sm" /> : "Update Password"}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
