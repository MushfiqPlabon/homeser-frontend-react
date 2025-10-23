import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import { useChangePasswordMutation } from "../store/extendedApiSlice";

const SecurityPage = () => {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (formData.new_password !== formData.confirm_password) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      await changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
      }).unwrap();
      setMessage({ type: "success", text: "Password changed successfully" });
      setFormData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.data?.error || "Failed to change password",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <LockClosedIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Security Settings
          </h1>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Change Password
          </h2>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor={currentPasswordId}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Password
              </label>
              <input
                id={currentPasswordId}
                type="password"
                value={formData.old_password}
                onChange={(e) =>
                  setFormData({ ...formData, old_password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor={newPasswordId}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                id={newPasswordId}
                type="password"
                value={formData.new_password}
                onChange={(e) =>
                  setFormData({ ...formData, new_password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor={confirmPasswordId}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <input
                id={confirmPasswordId}
                type="password"
                value={formData.confirm_password}
                onChange={(e) =>
                  setFormData({ ...formData, confirm_password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
