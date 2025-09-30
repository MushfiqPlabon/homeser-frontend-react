// Register.jsx
// This page component provides the user interface for creating a new account.
// It collects user details and interacts with the registration API.

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(schema);
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
                <input
                  id={firstNameId}
                  type="text"
                  autoComplete="given-name"
                  className="input-field mt-1"
                  placeholder="First name"
                  {...register("first_name")}
                />
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
                <input
                  id={lastNameId}
                  type="text"
                  autoComplete="family-name"
                  className="input-field mt-1"
                  placeholder="Last name"
                  {...register("last_name")}
                />
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
              <input
                id={usernameId}
                type="text"
                autoComplete="username"
                className="input-field mt-1"
                placeholder="Choose a username"
                {...register("username")}
              />
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
              <input
                id={emailId}
                type="email"
                autoComplete="email"
                className="input-field mt-1"
                placeholder="your.email@example.com"
                {...register("email")}
              />
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
                  className="input-field pr-10"
                  placeholder="Create a strong password"
                  {...register("password")}
                />
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
                  className="input-field pr-10"
                  placeholder="Confirm your password"
                  {...register("password_confirm")}
                />
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
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
