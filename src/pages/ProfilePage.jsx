// ProfilePage.jsx
// This component allows users to view and update their profile information

import {
  CalendarIcon,
  CameraIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  IdentificationIcon,
  StarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile, useUpdateProfile } from "../hooks/useApi";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const firstNameInputId = useId();
  const lastNameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();
  const addressInputId = useId();
  const dateOfBirthInputId = useId();
  const bioInputId = useId();

  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profile?.avatar || "");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fileInputRef = useRef(null);

  const {
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useProfile();

  const [updateProfileData] = useUpdateProfile();

  // Initialize form data with user information
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone_number: user?.profile?.phone_number || "",
    address: user?.profile?.address || "",
    date_of_birth: user?.profile?.date_of_birth || "",
    bio: user?.profile?.bio || "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setMessage({
          type: "error",
          text: "Image size should be less than 2MB",
        });
        return;
      }

      if (!file.type.match("image.*")) {
        setMessage({ type: "error", text: "Please upload an image file" });
        return;
      }

      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage({
        type: "success",
        text: "Image selected. Click save to update.",
      });
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare form data
      const submitData = new FormData();

      // Add text fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      // Add profile image if selected
      if (profileImage) {
        submitData.append("avatar", profileImage);
      }

      // Submit update
      const response = await updateProfileData(submitData);

      // Update local auth context
      updateProfile({
        ...user,
        ...response.data.user,
        profile: { ...user.profile, ...response.data.profile },
      });

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setEditMode(false);
      setProfileImage(null);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel edit mode
  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone_number: user?.profile?.phone_number || "",
      address: user?.profile?.address || "",
      date_of_birth: user?.profile?.date_of_birth || "",
      bio: user?.profile?.bio || "",
    });

    // Reset image preview
    setPreviewUrl(user?.profile?.avatar || "");
    setProfileImage(null);

    setEditMode(false);
    setMessage({ type: "", text: "" });
  };

  if (!user) {
    navigate("/login", { state: { from: { pathname: "/dashboard/profile" } } });
    return null;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="text-center card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">
            {profileError?.message ||
              "Failed to load your profile information."}
          </p>
          <button
            type="button"
            onClick={refetchProfile}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <UserCircleIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200/50"
                : "bg-red-50 text-red-800 border border-red-200/50"
            } backdrop-blur-sm`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Picture Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
              <div className="flex flex-col items-center">
                <div className="relative">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <UserCircleIcon className="h-32 w-32 text-gray-400" />
                  )}
                  {editMode && (
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 text-white shadow-lg hover:bg-primary-700 focus:outline-none"
                    >
                      <CameraIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600">{user.email}</p>

                {user.is_staff && (
                  <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Administrator
                  </span>
                )}
              </div>
            </div>

            {/* Profile Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      0 Orders
                    </p>
                    <p className="text-xs text-gray-600">Total placed</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      0 Reviews
                    </p>
                    <p className="text-xs text-gray-600">Submitted</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <HeartIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      0 Favorites
                    </p>
                    <p className="text-xs text-gray-600">Saved services</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Member since
                    </p>
                    <p className="text-xs text-gray-600">
                      {user.date_joined
                        ? new Date(user.date_joined).getFullYear()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h2>
                {!editMode ? (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="btn-primary"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-secondary"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              {editMode ? (
                // Edit Form
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor={firstNameInputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id={firstNameInputId}
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={lastNameInputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id={lastNameInputId}
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={emailInputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id={emailInputId}
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                        required
                        readOnly={!user.is_staff} // Only admins can change email for others
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={phoneInputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id={phoneInputId}
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor={addressInputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Address
                      </label>
                      <textarea
                        id={addressInputId}
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={dateOfBirthInputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id={dateOfBirthInputId}
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={bioInputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Bio
                      </label>
                      <textarea
                        id={bioInputId}
                        name="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </form>
              ) : (
                // View Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </div>
                      <p className="text-gray-900 font-medium">
                        {user.first_name || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </div>
                      <p className="text-gray-900 font-medium">
                        {user.last_name || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </div>
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </div>
                      <p className="text-gray-900 font-medium">
                        {user.profile?.phone_number || "Not provided"}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Address
                      </div>
                      <p className="text-gray-900 font-medium">
                        {user.profile?.address || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </div>
                      <p className="text-gray-900 font-medium">
                        {user.profile?.date_of_birth
                          ? new Date(
                              user.profile.date_of_birth,
                            ).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Member Since
                      </div>
                      <p className="text-gray-900 font-medium">
                        {user.date_joined
                          ? new Date(user.date_joined).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </div>
                      <p className="text-gray-900 font-medium">
                        {user.profile?.bio || "No bio provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Account Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/settings")}
                  className="flex flex-col items-center p-4 border border-gray-200/50 rounded-lg hover:bg-gray-50/50 transition-colors"
                >
                  <IdentificationIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium">Account Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard/security")}
                  className="flex flex-col items-center p-4 border border-gray-200/50 rounded-lg hover:bg-gray-50/50 transition-colors"
                >
                  <svg
                    className="h-8 w-8 text-primary-600 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Security</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Security</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard/preferences")}
                  className="flex flex-col items-center p-4 border border-gray-200/50 rounded-lg hover:bg-gray-50/50 transition-colors"
                >
                  <svg
                    className="h-8 w-8 text-primary-600 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Preferences</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Preferences</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
