// EmailAnalyticsDashboard.jsx
// Component for displaying email analytics dashboard with charts and statistics

import { useState, useId } from "react";
import { useGetEmailStatsQuery } from "../store/extendedApiSlice";
import { BarChart, LineChart } from "./AnalyticsCharts"; // Assuming these chart components exist
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";

const EmailAnalyticsDashboard = () => {
  const dateRangeSelectId = useId();
  const [dateRange, setDateRange] = useState(30); // Default to 30 days
  const {
    data: emailStats,
    error: emailError,
    isLoading: emailLoading,
    refetch: refetchEmail,
  } = useGetEmailStatsQuery({ days: dateRange });

  // Format percentage helper
  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  // Format currency helper
  const _formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date helper
  const _formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (emailLoading) {
    return <LoadingSpinner />;
  }

  if (emailError) {
    return (
      <ErrorMessage
        message="Failed to load email analytics data"
        onRetry={refetchEmail}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Email Analytics Dashboard
        </h1>
        <div className="flex items-center">
          <label htmlFor={dateRangeSelectId} className="mr-2 text-gray-600">
            Time Range:
          </label>
          <select
            id={dateRangeSelectId}
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* Email Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Total Emails Sent
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {emailStats?.data?.total_emails || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Open Rate</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatPercentage(emailStats?.data?.open_rate || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Click Rate</h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatPercentage(emailStats?.data?.click_rate || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Average Rating
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {(emailStats?.data?.average_rating || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Email Performance Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Email Performance Over Time
          </h3>
          <div className="h-64">
            {/* Placeholder for chart - in a real app you would use a charting library */}
            <LineChart data={emailStats?.data?.email_performance || []} />
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sentiment Distribution
          </h3>
          <div className="h-64">
            {/* Placeholder for chart */}
            <BarChart data={emailStats?.data?.sentiment_distribution || []} />
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Campaigns Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Email Campaigns
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Open Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Click Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emailStats?.data?.campaigns?.slice(0, 5).map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {campaign.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.sent_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPercentage(campaign.open_rate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPercentage(campaign.click_rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Ratings Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Top Rated Services
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviews
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emailStats?.data?.top_rated_services
                  ?.slice(0, 5)
                  .map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.avg_rating.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.review_count}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAnalyticsDashboard;
