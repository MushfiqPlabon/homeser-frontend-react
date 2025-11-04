// Register.jsx
// This page component provides the user interface for creating a new account.
// It collects user details and interacts with the registration API.

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const schema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ["password_confirm"],
  });

const Register = () => {
  const firstNameId = useId();
  const lastNameId = useId();
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const passwordConfirmId = useId();
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
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      password_confirm: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);

    const result = await registerUser(data);

    if (result.success) {
      navigate("/");
    } else {
      // Handle server-side errors
      console.error("Registration failed:", result.error);

      // Extract field-specific errors if available
      let errorMessage =
        "Registration failed. Please check your information and try again.";

      if (result.error && typeof result.error === "object") {
        // Handle validation errors from server
        if (result.error.detail) {
          errorMessage = result.error.detail;
        } else if (result.error.non_field_errors) {
          // Handle non-field errors (usually general registration errors)
          errorMessage = Array.isArray(result.error.non_field_errors)
            ? result.error.non_field_errors[0]
            : result.error.non_field_errors;
        } else {
          // Check for field-specific errors
          const fieldNames = [
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
          ];
          for (const fieldName of fieldNames) {
            if (result.error[fieldName]) {
              errorMessage = Array.isArray(result.error[fieldName])
                ? result.error[fieldName][0]
                : result.error[fieldName];
              break;
            }
          }
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {errors.general.message}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor={firstNameId}
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="relative mt-1">
                  <input
                    id={firstNameId}
                    type="text"
                    autoComplete="given-name"
                    className={`input-field ${
                      errors.first_name
                        ? "border-red-500"
                        : watch("first_name") && !errors.first_name
                          ? "border-green-500"
                          : "border-gray-300"
                    }`}
                    placeholder="First name"
                    {...register("first_name")}
                  />
                  {watch("first_name") && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {errors.first_name ? (
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          role="img"
                          aria-label="First name field has an error"
                        >
                          <title>First name field has an error</title>
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
                          aria-label="First name validation passed"
                        >
                          <title>First name validation passed</title>
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
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={lastNameId}
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="relative mt-1">
                  <input
                    id={lastNameId}
                    type="text"
                    autoComplete="family-name"
                    className={`input-field ${
                      errors.last_name
                        ? "border-red-500"
                        : watch("last_name") && !errors.last_name
                          ? "border-green-500"
                          : "border-gray-300"
                    }`}
                    placeholder="Last name"
                    {...register("last_name")}
                  />
                  {watch("last_name") && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {errors.last_name ? (
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          role="img"
                          aria-label="Last name field has an error"
                        >
                          <title>Last name field has an error</title>
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
                          aria-label="Last name validation passed"
                        >
                          <title>Last name validation passed</title>
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
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor={usernameId}
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="relative mt-1">
                <input
                  id={usernameId}
                  type="text"
                  autoComplete="username"
                  className={`input-field ${
                    errors.username
                      ? "border-red-500"
                      : watch("username") && !errors.username
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
                  placeholder="Choose a username"
                  {...register("username")}
                />
                {watch("username") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {errors.username ? (
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        role="img"
                        aria-label="Username field has an error"
                      >
                        <title>Username field has an error</title>
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
                        aria-label="Username validation passed"
                      >
                        <title>Username validation passed</title>
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
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={emailId}
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
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
                  placeholder="your.email@example.com"
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

            <div>
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
                  autoComplete="new-password"
                  className={`input-field pr-10 ${
                    errors.password
                      ? "border-red-500"
                      : watch("password") && !errors.password
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
                  placeholder="Create a strong password"
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

            <div>
              <label
                htmlFor={passwordConfirmId}
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id={passwordConfirmId}
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`input-field pr-10 ${
                    errors.password_confirm
                      ? "border-red-500"
                      : watch("password_confirm") && !errors.password_confirm
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                  {...register("password_confirm")}
                />
                {watch("password_confirm") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {errors.password_confirm ? (
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        role="img"
                        aria-label="Confirm password field has an error"
                      >
                        <title>Confirm password field has an error</title>
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
                        aria-label="Confirm password validation passed"
                      >
                        <title>Confirm password validation passed</title>
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password_confirm && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password_confirm.message}
                </p>
              )}
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
