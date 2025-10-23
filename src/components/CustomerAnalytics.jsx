import { useGetCustomerAnalyticsQuery } from "../store/extendedApiSlice";
import LoadingSpinner from "./LoadingSpinner";

const CustomerAnalytics = () => {
  const { data: analytics, isLoading, error } = useGetCustomerAnalyticsQuery();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500">
        {error.data?.detail || "No analytics data available"}
      </div>
    );
  }

  const { overview, category_spending, top_services } = analytics || {};

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-2xl font-bold text-green-600">
            ${overview?.total_spent?.toFixed(2) || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-blue-600">
            {overview?.total_orders || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Avg Order Value</p>
          <p className="text-2xl font-bold text-purple-600">
            ${overview?.avg_order_value?.toFixed(2) || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Reviews Given</p>
          <p className="text-2xl font-bold text-yellow-600">
            {overview?.reviews_given || 0}
          </p>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Order Status</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-xl font-bold text-green-600">
              {overview?.completed_orders || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-xl font-bold text-yellow-600">
              {overview?.pending_orders || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cancelled</p>
            <p className="text-xl font-bold text-red-600">
              {overview?.cancelled_orders || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Category Spending */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        <div className="space-y-3">
          {category_spending?.map((cat, idx) => (
            <div
              key={`category-${cat.service__category__name || "uncategorized"}-${idx}`}
              className="flex justify-between items-center"
            >
              <span className="text-sm font-medium">
                {cat.service__category__name || "Uncategorized"}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {cat.count} orders
                </span>
                <span className="text-sm font-bold text-green-600">
                  ${cat.total?.toFixed(2) || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Most Used Services</h3>
        <div className="space-y-3">
          {top_services?.map((service, idx) => (
            <div
              key={`service-${service.service__name}-${idx}`}
              className="flex justify-between items-center"
            >
              <span className="text-sm font-medium">
                {service.service__name}
              </span>
              <span className="text-sm text-gray-600">
                {service.count} times
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
