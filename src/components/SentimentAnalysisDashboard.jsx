// SentimentAnalysisDashboard.jsx
// Component for displaying sentiment analysis dashboard with charts and statistics

import { useState, useId } from "react";
import { useGetSentimentStatsQuery } from "../store/extendedApiSlice";
import { BarChart, PieChart } from "./AnalyticsCharts"; // Assuming these chart components exist
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";

const SentimentAnalysisDashboard = () => {
  const timeRangeSelectId = useId();
  const serviceSelectId = useId();
  const [dateRange, setDateRange] = useState(30); // Default to 30 days
  const [selectedService, setSelectedService] = useState(null);

  const {
    data: sentimentStats,
    error: sentimentError,
    isLoading: sentimentLoading,
    refetch: refetchSentiment,
  } = useGetSentimentStatsQuery({
    days: dateRange,
    service_id: selectedService,
  });

  // Format percentage helper
  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  if (sentimentLoading) {
    return <LoadingSpinner />;
  }

  if (sentimentError) {
    return (
      <ErrorMessage
        message="Failed to load sentiment analytics data"
        onRetry={refetchSentiment}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Sentiment Analysis Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor={timeRangeSelectId} className="mr-2 text-gray-600">
              Time Range:
            </label>
            <select
              id={timeRangeSelectId}
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
          <div>
            <label htmlFor={serviceSelectId} className="mr-2 text-gray-600">
              Service:
            </label>
            <select
              id={serviceSelectId}
              value={selectedService || ""}
              onChange={(e) => setSelectedService(e.target.value || null)}
              className="border border-gray-300 rounded-md px-3 py-1"
            >
              <option value="">All Services</option>
              {/* In a real app, you would populate this with actual services */}
              <option value="1">Service 1</option>
              <option value="2">Service 2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sentiment Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Total Reviews
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {sentimentStats?.data?.total_reviews || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Average Rating
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {(sentimentStats?.data?.average_rating || 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Positive Reviews
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatPercentage(sentimentStats?.data?.positive_percentage || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Rating Change
          </h3>
          <p
            className={`text-3xl font-bold ${sentimentStats?.data?.rating_change >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {sentimentStats?.data?.rating_change >= 0 ? "+" : ""}
            {(sentimentStats?.data?.rating_change || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Rating Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Rating Distribution
          </h3>
          <div className="h-64">
            {/* Placeholder for chart */}
            <BarChart data={sentimentStats?.data?.rating_distribution || []} />
          </div>
        </div>

        {/* Sentiment Trends Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sentiment Trends
          </h3>
          <div className="h-64">
            {/* Placeholder for chart */}
            <PieChart data={sentimentStats?.data?.sentiment_trends || []} />
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rated Services Table */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sentimentStats?.data?.top_rated_services
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {service.rating_trend >= 0 ? (
                            <span className="text-green-600">↑</span>
                          ) : (
                            <span className="text-red-600">↓</span>
                          )}
                          <span
                            className={
                              service.rating_trend >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {Math.abs(service.rating_trend).toFixed(2)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sentiment by Category Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sentiment by Category
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Positive %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviews
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sentimentStats?.data?.category_sentiment
                  ?.slice(0, 5)
                  .map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.avg_rating.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPercentage(category.positive_percentage)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.review_count}
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

export default SentimentAnalysisDashboard;
