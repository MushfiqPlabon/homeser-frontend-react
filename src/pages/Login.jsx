// Login.jsx
// This page component provides the user interface for logging into an existing account.
// It handles user input for credentials and interacts with the authentication API.

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const emailId = useId();
  const passwordId = useId();
  const location = useLocation();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: async (data) => {
      try {
        // Validate using Zod schema
        const validatedData = schema.parse(data);
        return { values: validatedData, errors: {} };
      } catch (error) {
        // Transform Zod errors to react-hook-form format
        const fieldErrors = {};
        if (error.errors) {
          error.errors.forEach((err) => {
            fieldErrors[err.path[0]] = { message: err.message };
          });
        }
        return { values: {}, errors: fieldErrors };
      }
    },
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);

    // The backend expects 'username' field which can be either email or username
    const result = await login({
      username: data.email,
      password: data.password,
    });

    if (result.success) {
      if (isAdmin) {
        navigate("/admin-dashboard", { replace: true });
      } else {
        // Redirect to the original location or default to home
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } else {
      // Handle server-side errors
      console.error("Login failed:", result.error);

      // Extract field-specific errors if available
      let errorMessage =
        "Login failed. Please check your credentials and try again.";

      if (result.error && typeof result.error === "object") {
        // Handle validation errors from server
        if (result.error.detail) {
          errorMessage = result.error.detail;
        } else if (result.error.non_field_errors) {
          // Handle non-field errors (usually general authentication errors)
          errorMessage = Array.isArray(result.error.non_field_errors)
            ? result.error.non_field_errors[0]
            : result.error.non_field_errors;
        } else if (result.error.email) {
          // Handle email-specific errors
          errorMessage = Array.isArray(result.error.email)
            ? result.error.email[0]
            : result.error.email;
        } else if (result.error.password) {
          // Handle password-specific errors
          errorMessage = Array.isArray(result.error.password)
            ? result.error.password[0]
            : result.error.password;
        } else if (result.error.username) {
          // Handle username-specific errors (some APIs use username instead of email)
          errorMessage = Array.isArray(result.error.username)
            ? result.error.username[0]
            : result.error.username;
        }
      }

      showToast(errorMessage, "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
              {errors.general.message}
            </div>
          )}

          <div className="rounded-md shadow-xs -space-y-px">
            <div>
              <label
                htmlFor={emailId}
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="relative mt-1">
                <input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  className={`input-field ${
                    errors.email
                      ? "border-red-500"
                      : watch("email") && !errors.email
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
                  placeholder="Email address"
                  {...register("email")}
                />
                {watch("email") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {errors.email ? (
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        role="img"
                        aria-label="Email field has an error"
                      >
                        <title>Email field has an error</title>
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        role="img"
                        aria-label="Email validation passed"
                      >
                        <title>Email validation passed</title>
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="pt-4">
              <label
                htmlFor={passwordId}
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`input-field pr-10 ${
                    errors.password
                      ? "border-red-500"
                      : watch("password") && !errors.password
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
                  placeholder="Password"
                  {...register("password")}
                />
                {watch("password") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {errors.password ? (
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        role="img"
                        aria-label="Password field has an error"
                      >
                        <title>Password field has an error</title>
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        role="img"
                        aria-label="Password validation passed"
                      >
                        <title>Password validation passed</title>
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !isValid}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isValid && !loading
                  ? "bg-primary-600 hover:bg-primary-700"
                  : "bg-primary-400 cursor-not-allowed"
              } focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
