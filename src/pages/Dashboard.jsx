// Dashboard.jsx
// This page component serves as the user's personal dashboard, providing access to
// their order history, reviews, profile information, and account settings.

import {
  ClipboardDocumentListIcon,
  CogIcon,
  StarIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import PermissionGuard from "../components/PermissionGuard";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../utils/api";
import {
  useGetServiceProviderServicesQuery,
  useDeleteServiceProviderServiceMutation,
} from "../store/extendedApiSlice";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [_services, _setServices] = useState([]);
  const [_servicesLoading, _setServicesLoading] = useState(false);
  const [_servicesError, _setServicesError] = useState("");
  const [deletionError, setDeletionError] = useState("");
  const navigate = useNavigate();

  // Generate unique IDs for form elements
  const firstNameInputId = useId();
  const lastNameInputId = useId();
  const emailInputId = useId();
  const usernameInputId = useId();
  const emailNotificationsCheckboxId = useId();
  const smsNotificationsCheckboxId = useId();

  // Service provider services query and mutation hooks
  const {
    data: serviceProviderServicesData,
    isLoading: serviceProviderServicesLoading,
    error: serviceProviderServicesError,
    refetch: refetchServiceProviderServices,
  } = useGetServiceProviderServicesQuery(undefined, {
    skip: activeTab !== "services" || !isAuthenticated,
  });

  const [deleteServiceProviderService] =
    useDeleteServiceProviderServiceMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  // Fetch user's orders when the component mounts or when the orders tab is selected
  useEffect(() => {
    if (isAuthenticated && activeTab === "orders") {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          setError("");
          const response = await ordersAPI.getUserOrders();
          // Ensure orders is always an array
          const ordersData = response.data?.data || response.data || [];
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        } catch (err) {
          setError("Failed to load orders");
          console.error("Error fetching orders:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [isAuthenticated, activeTab]);

  // Fetch user's orders when the component mounts or when the orders tab is selected
  useEffect(() => {
    if (isAuthenticated && activeTab === "orders") {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          setError("");
          const response = await ordersAPI.getUserOrders();
          // Ensure orders is always an array
          const ordersData = response.data?.data || response.data || [];
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        } catch (err) {
          setError("Failed to load orders");
          console.error("Error fetching orders:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    { id: "orders", name: "My Orders", icon: ClipboardDocumentListIcon },
    { id: "reviews", name: "My Reviews", icon: StarIcon },
    { id: "profile", name: "Profile", icon: UserIcon },
    { id: "settings", name: "Settings", icon: CogIcon },
    { id: "services", name: "My Services", icon: WrenchScrewdriverIcon },
  ];

  const renderOrders = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
            <p className="text-sm text-gray-500 mt-2">
              Your order history will appear here once you make a purchase.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate("/services")}
                className="btn-primary"
              >
                Browse Services
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
          <button
            type="button"
            onClick={() => navigate("/dashboard/orders")}
            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            View All Orders
          </button>
        </div>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Order #{order.order_id}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ৳{parseFloat(order.total).toFixed(2)}
                  </p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  {order.items?.length || 0} item(s)
                </p>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReviews = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">My Reviews</h3>
        <button
          type="button"
          onClick={() => navigate("/dashboard/reviews")}
          className="text-sm text-primary-600 hover:text-primary-800 font-medium"
        >
          View All Reviews
        </button>
      </div>
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No reviews yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Reviews for services you've used will appear here.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate("/services")}
            className="btn-primary"
          >
            Browse Services
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Profile Information
        </h3>
        <button
          type="button"
          onClick={() => navigate("/dashboard/profile")}
          className="text-sm text-primary-600 hover:text-primary-800 font-medium"
        >
          Edit Profile
        </button>
      </div>

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
        <button
          type="button"
          onClick={() => navigate("/dashboard/profile")}
          className="btn-primary"
        >
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
            <input
              id={emailNotificationsCheckboxId}
              type="checkbox"
              className="sr-only peer"
              defaultChecked
            />
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
            <input
              id={smsNotificationsCheckboxId}
              type="checkbox"
              className="sr-only peer"
            />
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
      case "services":
        return (
          <PermissionGuard
            fallback={
              <div className="text-center py-8">
                <WrenchScrewdriverIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Service Provider Access Required
                </h3>
                <p className="text-gray-600">
                  You need to be a service provider to access this section.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/services")}
                    className="btn-primary"
                  >
                    Browse Services
                  </button>
                </div>
              </div>
            }
          >
            <div className="space-y-6">
              {/* Services Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  My Services
                </h3>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => navigate("/dashboard/services/new")}
                >
                  Add New Service
                </button>
              </div>

              {/* Deletion Error Message */}
              {deletionError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                  <p className="text-red-800">{deletionError}</p>
                  <button
                    type="button"
                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                    onClick={() => setDeletionError("")}
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Loading State */}
              {serviceProviderServicesLoading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              )}

              {/* Error State */}
              {serviceProviderServicesError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-800">
                    Failed to load services:{" "}
                    {serviceProviderServicesError?.data?.message ||
                      serviceProviderServicesError?.error ||
                      "Unknown error"}
                  </p>
                </div>
              )}

              {/* Services List */}
              {!serviceProviderServicesLoading &&
                !serviceProviderServicesError &&
                (serviceProviderServicesData &&
                serviceProviderServicesData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceProviderServicesData.map((service) => (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900">
                          {service.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {service.short_desc}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                          Price: ৳{service.price}
                        </p>
                        <div className="mt-3 flex space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/dashboard/services/${service.id}/edit`)
                            }
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete ${service.name}?`,
                                )
                              ) {
                                try {
                                  await deleteServiceProviderService(
                                    service.id,
                                  ).unwrap();
                                  refetchServiceProviderServices(); // Refresh the list after deletion
                                  setDeletionError(""); // Clear any previous deletion errors
                                } catch (error) {
                                  console.error(
                                    "Error deleting service:",
                                    error,
                                  );
                                  const errorMessage =
                                    error?.data?.message ||
                                    error?.error ||
                                    "Failed to delete service. Please try again.";
                                  setDeletionError(errorMessage);
                                }
                              }
                            }}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <WrenchScrewdriverIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No services found</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Services you manage will appear here.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => navigate("/dashboard/services/new")}
                        className="btn-primary"
                      >
                        Add Your First Service
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </PermissionGuard>
        );
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
