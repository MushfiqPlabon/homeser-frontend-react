// Dashboard.jsx
// This page component serves as the user's personal dashboard, providing access to
// their order history, reviews, profile information, and account settings.

import {
  ClipboardDocumentListIcon,
  CogIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  // Generate unique IDs for form elements
  const firstNameInputId = useId();
  const lastNameInputId = useId();
  const emailInputId = useId();
  const usernameInputId = useId();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    { id: "orders", name: "My Orders", icon: ClipboardDocumentListIcon },
    { id: "reviews", name: "My Reviews", icon: StarIcon },
    { id: "profile", name: "Profile", icon: UserIcon },
    { id: "settings", name: "Settings", icon: CogIcon },
  ];

  const renderOrders = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No orders found</p>
        <p className="text-sm text-gray-500 mt-2">
          Your order history will appear here once you make a purchase.
        </p>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">My Reviews</h3>
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No reviews yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Reviews for services you've used will appear here.
        </p>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Profile Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor={firstNameInputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First Name
          </label>
          <input
            id={firstNameInputId}
            type="text"
            value={user?.first_name || ""}
            className="input-field"
            readOnly
          />
        </div>

        <div>
          <label
            htmlFor={lastNameInputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last Name
          </label>
          <input
            id={lastNameInputId}
            type="text"
            value={user?.last_name || ""}
            className="input-field"
            readOnly
          />
        </div>

        <div>
          <label
            htmlFor={emailInputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id={emailInputId}
            type="email"
            value={user?.email || ""}
            className="input-field"
            readOnly
          />
        </div>

        <div>
          <label
            htmlFor={usernameInputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Username
          </label>
          <input
            id={usernameInputId}
            type="text"
            value={user?.username || ""}
            className="input-field"
            readOnly
          />
        </div>
      </div>

      <div className="pt-4">
        <button type="button" className="btn-primary">
          Edit Profile
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">
              Receive updates about your orders
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-600">
              Get SMS updates for important events
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          type="button"
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return renderOrders();
      case "reviews":
        return renderReviews();
      case "profile":
        return renderProfile();
      case "settings":
        return renderSettings();
      default:
        return renderOrders();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your orders, reviews, and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-100 text-primary-700 border border-primary-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
