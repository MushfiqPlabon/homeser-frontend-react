import { useGetProviderAnalyticsQuery } from "../store/extendedApiSlice";
import LoadingSpinner from "./LoadingSpinner";

const ProviderAnalytics = () => {
  const { data: analytics, isLoading, error } = useGetProviderAnalyticsQuery();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500">
        {error.data?.detail || "No analytics data available"}
      </div>
    );
  }

  const { overview, service_performance } = analytics || {};

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ${overview?.total_revenue?.toFixed(2) || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-blue-600">
            {overview?.total_orders || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Average Rating</p>
          <p className="text-2xl font-bold text-yellow-600">
            {overview?.avg_rating?.toFixed(1) || 0} ⭐
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Active Services</p>
          <p className="text-2xl font-bold text-purple-600">
            {overview?.active_services || 0}
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

      {/* Service Performance */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Service Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Service
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Orders
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Revenue
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Rating
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Reviews
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {service_performance?.map((service) => (
                <tr key={service.id}>
                  <td className="px-4 py-3 text-sm">{service.name}</td>
                  <td className="px-4 py-3 text-sm">{service.total_orders}</td>
                  <td className="px-4 py-3 text-sm text-green-600">
                    ${service.revenue?.toFixed(2) || 0}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {service.avg_rating?.toFixed(1) || 0} ⭐
                  </td>
                  <td className="px-4 py-3 text-sm">{service.total_reviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProviderAnalytics;
