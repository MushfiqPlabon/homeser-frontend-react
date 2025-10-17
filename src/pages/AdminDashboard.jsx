// AdminDashboard.jsx
// This component serves as the main dashboard for administrators,
// providing access to all admin functionality

import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  QueueListIcon,
  ShoppingCartIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import CategoryManagement from "../components/CategoryManagement";
import EnhancedGenericManagement from "../components/EnhancedGenericManagement";
import OrderManagement from "../components/OrderManagement";
import PaymentManagement from "../components/PaymentManagement";
import ReviewManagement from "../components/ReviewManagement";
import ServiceManagement from "../components/ServiceManagement";
import SettingsManagement from "../components/SettingsManagement";
// Import the management components
import UserManagement from "../components/UserManagement";
import { useGetAdminOrdersQuery } from "../store/extendedApiSlice";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  // const {} = useWebSocket();

  // Stats with real-time counts
  const [stats, setStats] = useState([
    {
      name: "Total Users",
      value: "2,456",
      change: "+4.25%",
      changeType: "positive",
    },
    {
      name: "Total Services",
      value: "124",
      change: "+1.25%",
      changeType: "positive",
    },
    {
      name: "Total Orders",
      value: "876",
      change: "+3.75%",
      changeType: "positive",
    },
    {
      name: "Revenue",
      value: "৳98,750",
      change: "+8.25%",
      changeType: "positive",
    },
  ]);

  // For real-time order counts
  const { data: orders } = useGetAdminOrdersQuery();
  const [_orderCount, setOrderCount] = useState(0);

  // Update order count when orders update
  useEffect(() => {
    if (orders) {
      setOrderCount(orders.length || 0);

      // Update the stats array to reflect real-time order count
      setStats((prevStats) =>
        prevStats.map((stat) =>
          stat.name === "Total Orders"
            ? { ...stat, value: orders.length.toString() }
            : stat,
        ),
      );
    }
  }, [orders]);

  // Admin navigation items
  const navItems = [
    {
      id: "overview",
      name: "Overview",
      icon: ChartBarIcon,
      description: "View system metrics and analytics",
    },
    {
      id: "users",
      name: "Manage Users",
      icon: UserGroupIcon,
      description: "View and manage user accounts",
    },
    {
      id: "services",
      name: "Manage Services",
      icon: BuildingStorefrontIcon,
      description: "View and manage services",
    },
    {
      id: "categories",
      name: "Manage Categories",
      icon: QueueListIcon,
      description: "View and manage service categories",
    },
    {
      id: "orders",
      name: "Manage Orders",
      icon: ShoppingCartIcon,
      description: "View and manage orders",
    },
    {
      id: "reviews",
      name: "Manage Reviews",
      icon: StarIcon,
      description: "View and manage reviews",
    },
    {
      id: "payments",
      name: "Payment Management",
      icon: CurrencyDollarIcon,
      description: "Handle refunds and disputes",
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: ChartBarIcon,
      description: "View business analytics",
    },
    {
      id: "settings",
      name: "Settings",
      icon: Cog6ToothIcon,
      description: "Configure system settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your platform and track business metrics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Navigation
              </h2>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-primary-100 text-primary-700 border border-primary-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.name}
                      className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50"
                    >
                      <p className="text-sm font-medium text-gray-600">
                        {stat.name}
                      </p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <p className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </p>
                        <p
                          className={`text-sm ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
                        >
                          {stat.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveSection("users")}
                      className="flex flex-col items-center p-4 border border-gray-200/50 rounded-lg hover:bg-gray-50/50 transition-colors"
                    >
                      <UserGroupIcon className="h-8 w-8 text-primary-600 mb-2" />
                      <span className="text-sm font-medium">Users</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("services")}
                      className="flex flex-col items-center p-4 border border-gray-200/50 rounded-lg hover:bg-gray-50/50 transition-colors"
                    >
                      <BuildingStorefrontIcon className="h-8 w-8 text-primary-600 mb-2" />
                      <span className="text-sm font-medium">Services</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("orders")}
                      className="flex flex-col items-center p-4 border border-gray-200/50 rounded-lg hover:bg-gray-50/50 transition-colors"
                    >
                      <ShoppingCartIcon className="h-8 w-8 text-primary-600 mb-2" />
                      <span className="text-sm font-medium">Orders</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("reviews")}
                      className="flex flex-col items-center p-4 border border-gray-200/50 rounded-lg hover:bg-gray-50/50 transition-colors"
                    >
                      <StarIcon className="h-8 w-8 text-primary-600 mb-2" />
                      <span className="text-sm font-medium">Reviews</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "users" && <UserManagement />}
            {activeSection === "services" && <ServiceManagement />}
            {activeSection === "categories" && <CategoryManagement />}
            {activeSection === "reviews" && <ReviewManagement />}
            {activeSection === "orders" && <OrderManagement />}
            {activeSection === "payments" && <PaymentManagement />}
            {activeSection === "analytics" && <EnhancedGenericManagement />}
            {activeSection === "settings" && <SettingsManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
