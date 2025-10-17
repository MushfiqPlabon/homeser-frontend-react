// AnalyticsDashboard.jsx
// Component for displaying comprehensive business analytics

import {
  ArrowTrendingUpIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  useGetEmailStatsQuery,
  useGetPaymentAnalyticsQuery,
  useGetPopularSearchesQuery,
  useGetSearchAnalyticsQuery,
  useGetSentimentStatsQuery,
} from "../store/extendedApiSlice";

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState("30"); // Default to 30 days
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch analytics data
  const { data: paymentAnalytics, isLoading: paymentLoading } =
    useGetPaymentAnalyticsQuery({ days: dateRange });
  const { data: searchAnalytics, isLoading: searchLoading } =
    useGetSearchAnalyticsQuery({ days: dateRange });
  const { data: emailStats, isLoading: emailLoading } = useGetEmailStatsQuery({
    days: dateRange,
  });
  const { data: sentimentStats, isLoading: sentimentLoading } =
    useGetSentimentStatsQuery();
  const { data: popularSearches, isLoading: popularSearchesLoading } =
    useGetPopularSearchesQuery({ limit: 10 });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  // Analytics tabs
  const analyticsTabs = [
    { id: "overview", name: "Overview", icon: ChartBarIcon },
    { id: "revenue", name: "Revenue", icon: CurrencyDollarIcon },
    { id: "search", name: "Search", icon: MagnifyingGlassIcon },
    { id: "engagement", name: "Engagement", icon: StarIcon },
    { id: "email", name: "Email", icon: EnvelopeIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 border border-gray-300/50 rounded-md bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Tabs */}
      <div className="border-b border-gray-200/50">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {analyticsTabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <CurrencyDollarIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {paymentLoading
                      ? "Loading..."
                      : formatCurrency(paymentAnalytics?.total_revenue || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <ArrowTrendingUpIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {paymentLoading
                      ? "Loading..."
                      : paymentAnalytics?.total_orders || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Searches
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {searchLoading
                      ? "Loading..."
                      : searchAnalytics?.total_searches || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                  <StarIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Avg Rating
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {sentimentLoading
                      ? "Loading..."
                      : (sentimentStats?.average_rating || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Revenue Trend
              </h3>
              <div className="h-64 flex items-center justify-center border border-gray-200/50 rounded-lg">
                <p className="text-gray-500">
                  Revenue chart visualization would appear here
                </p>
              </div>
            </div>

            {/* Order Volume Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Volume
              </h3>
              <div className="h-64 flex items-center justify-center border border-gray-200/50 rounded-lg">
                <p className="text-gray-500">
                  Order volume chart visualization would appear here
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Popular Searches */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50 lg:col-span-1">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Popular Searches
              </h3>
              {popularSearchesLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <ul className="space-y-3">
                  {popularSearches?.popular_searches?.map((search, index) => (
                    <li
                      key={search.id || search.query}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-700">
                        #{index + 1} {search.query}
                      </span>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {search.count} searches
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Search Analytics */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50 lg:col-span-1">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Search Analytics
              </h3>
              {searchLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium">
                      {formatPercentage(searchAnalytics?.success_rate || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Avg Results per Search
                    </span>
                    <span className="font-medium">
                      {searchAnalytics?.avg_results_per_search || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Top Language</span>
                    <span className="font-medium">
                      {Object.entries(
                        searchAnalytics?.searches_by_language || {},
                      ).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Email Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50 lg:col-span-1">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Email Statistics
              </h3>
              {emailLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sent</span>
                    <span className="font-medium">
                      {emailStats?.total_emails || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Open Rate</span>
                    <span className="font-medium">
                      {formatPercentage(emailStats?.open_rate || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Click Rate</span>
                    <span className="font-medium">
                      {formatPercentage(emailStats?.click_rate || 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {paymentLoading
                  ? "Loading..."
                  : formatCurrency(paymentAnalytics?.total_revenue || 0)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {paymentLoading
                  ? ""
                  : `↑ ${formatPercentage(paymentAnalytics?.revenue_growth || 0)} from last period`}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">
                Average Order Value
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {paymentLoading
                  ? "Loading..."
                  : formatCurrency(
                      (paymentAnalytics?.total_revenue || 0) /
                        (paymentAnalytics?.total_orders || 1),
                    )}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {paymentLoading
                  ? ""
                  : `↑ ${formatPercentage(paymentAnalytics?.aov_growth || 0)} from last period`}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">
                Conversion Rate
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {paymentLoading
                  ? "Loading..."
                  : formatPercentage(paymentAnalytics?.conversion_rate || 0)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {paymentLoading
                  ? ""
                  : `↑ ${formatPercentage(paymentAnalytics?.conversion_growth || 0)} from last period`}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Revenue Breakdown
            </h3>
            <div className="h-80 flex items-center justify-center border border-gray-200/50 rounded-lg">
              <p className="text-gray-500">
                Revenue breakdown chart would appear here
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">
                Total Searches
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {searchLoading
                  ? "Loading..."
                  : searchAnalytics?.total_searches || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">
                Search Success Rate
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {searchLoading
                  ? "Loading..."
                  : formatPercentage(searchAnalytics?.success_rate || 0)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">
                Avg Results per Search
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {searchLoading
                  ? "Loading..."
                  : searchAnalytics?.avg_results_per_search || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">
                No Results Searches
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {searchLoading
                  ? "Loading..."
                  : searchAnalytics?.no_results_searches || 0}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Searches by Language
              </h3>
              {searchLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border border-gray-200/50 rounded-lg">
                  <p className="text-gray-500">
                    Language distribution chart would appear here
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Searches by Hour
              </h3>
              {searchLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border border-gray-200/50 rounded-lg">
                  <p className="text-gray-500">
                    Hourly distribution chart would appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Engagement Tab */}
      {activeTab === "engagement" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">
                Average Rating
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {sentimentLoading
                  ? "Loading..."
                  : (sentimentStats?.average_rating || 0).toFixed(2)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {sentimentLoading
                  ? "Loading..."
                  : sentimentStats?.total_reviews || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">
                Positive Sentiment
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {sentimentLoading
                  ? "Loading..."
                  : formatPercentage(sentimentStats?.positive_percentage || 0)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Rating Distribution
            </h3>
            {sentimentLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center border border-gray-200/50 rounded-lg">
                <p className="text-gray-500">
                  Rating distribution chart would appear here
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email Tab */}
      {activeTab === "email" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">
                Total Emails Sent
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {emailLoading ? "Loading..." : emailStats?.total_emails || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">
                Email Open Rate
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {emailLoading
                  ? "Loading..."
                  : formatPercentage(emailStats?.open_rate || 0)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm font-medium text-gray-600">
                Email Click Rate
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {emailLoading
                  ? "Loading..."
                  : formatPercentage(emailStats?.click_rate || 0)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Email Performance
              </h3>
              {emailLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border border-gray-200/50 rounded-lg">
                  <p className="text-gray-500">
                    Email performance chart would appear here
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Top Performing Campaigns
              </h3>
              {emailLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border border-gray-200/50 rounded-lg">
                  <p className="text-gray-500">
                    Campaign performance chart would appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
