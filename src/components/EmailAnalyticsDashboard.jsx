// EmailAnalyticsDashboard.jsx
// This component was removed because it referenced non-existent backend endpoints.
// The following RTK Query hooks were not defined in the extendedApiSlice:
// - useGetEmailStatsRTKQuery
// - useGetSentimentStatsRTKQuery
// - useGetServiceSentimentStatsRTKQuery
// These hooks were removed during the frontend-backend synchronization process.

// This is an empty component to maintain the import structure without errors.
const EmailAnalyticsDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Email Analytics Dashboard Removed</h1>
      <p className="text-gray-600 mt-2">
        This dashboard was removed as it referenced non-existent backend analytics endpoints.
      </p>
    </div>
  );
};

export default EmailAnalyticsDashboard;

  // Format percentage
  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  // Format currency
  const _formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const _formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`space-y-6 ${expandedView ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : ""}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <EnvelopeIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Email & Sentiment Analytics
          </h1>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => setExpandedView(!expandedView)}
            className="btn-secondary flex items-center"
          >
            {expandedView ? (
              <>
                <ArrowsPointingInIcon className="h-5 w-5 mr-1" />
                Collapse View
              </>
            ) : (
              <>
                <ArrowsPointingOutIcon className="h-5 w-5 mr-1" />
                Expand View
              </>
            )}
          </button>
        </div>
      </div>

      {/* Email Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <EnvelopeIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Emails Sent
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {emailLoading ? "Loading..." : emailStats?.total_emails || 0}
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
              <p className="text-sm font-medium text-gray-600">Open Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {emailLoading
                  ? "Loading..."
                  : formatPercentage(emailStats?.open_rate || 0)}
              </p>
              <div className="flex items-center mt-1">
                {emailStats?.open_rate_change >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-xs ${emailStats?.open_rate_change >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatPercentage(
                    Math.abs(emailStats?.open_rate_change || 0),
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Click Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {emailLoading
                  ? "Loading..."
                  : formatPercentage(emailStats?.click_rate || 0)}
              </p>
              <div className="flex items-center mt-1">
                {emailStats?.click_rate_change >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-xs ${emailStats?.click_rate_change >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatPercentage(
                    Math.abs(emailStats?.click_rate_change || 0),
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
              <StarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {sentimentLoading
                  ? "Loading..."
                  : (sentimentStats?.average_rating || 0).toFixed(2)}
              </p>
              <div className="flex items-center mt-1">
                {sentimentStats?.rating_change >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-xs ${sentimentStats?.rating_change >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {(sentimentStats?.rating_change || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Performance Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Email Performance Over Time
          </h3>
          <div className="h-64 flex items-center justify-center border border-gray-200/50 rounded-lg">
            <p className="text-gray-500">
              Email performance chart visualization would appear here
            </p>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sentiment Distribution
          </h3>
          <div className="h-64 flex items-center justify-center border border-gray-200/50 rounded-lg">
            <p className="text-gray-500">
              Sentiment distribution chart visualization would appear here
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Campaigns */}
        <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Email Campaigns
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Campaign
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sent
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Open Rate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Click Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200/50">
                {emailLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : emailError ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-red-500"
                    >
                      Failed to load email campaigns
                    </td>
                  </tr>
                ) : (
                  emailStats?.campaigns?.slice(0, 5).map((campaign) => (
                    <tr
                      key={campaign.id || campaign.name}
                      className="hover:bg-gray-50/30"
                    >
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Ratings */}
        <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Top Rated Services
            </h3>
            <select
              value={selectedService || ""}
              onChange={(e) => setSelectedService(e.target.value || null)}
              className="px-3 py-1 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Services</option>
              {sentimentStats?.top_rated_services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Service
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Avg Rating
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reviews
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200/50">
                {sentimentLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : sentimentError ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-red-500"
                    >
                      Failed to load service ratings
                    </td>
                  </tr>
                ) : (
                  sentimentStats?.top_rated_services
                    ?.slice(0, 5)
                    .map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50/30">
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
                              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span
                              className={
                                service.rating_trend >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {service.rating_trend.toFixed(2)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Service-Specific Sentiment Analytics */}
      {selectedService && (
        <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Sentiment Analytics for{" "}
              {serviceSentimentStats?.service_name || "Selected Service"}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className="text-sm text-red-600 hover:text-red-900"
            >
              Clear Selection
            </button>
          </div>

          {serviceSentimentLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : serviceSentimentError ? (
            <div className="text-center py-12 text-red-500">
              Failed to load service sentiment analytics
            </div>
          ) : serviceSentimentStats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm border border-gray-200/50">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Average Rating
                </h4>
                <p className="text-2xl font-semibold text-gray-900">
                  {serviceSentimentStats.average_rating.toFixed(2)}
                </p>
              </div>

              <div className="bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm border border-gray-200/50">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Total Reviews
                </h4>
                <p className="text-2xl font-semibold text-gray-900">
                  {serviceSentimentStats.total_reviews}
                </p>
              </div>

              <div className="bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm border border-gray-200/50">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Positive Reviews
                </h4>
                <p className="text-2xl font-semibold text-gray-900">
                  {serviceSentimentStats.positive_reviews}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatPercentage(serviceSentimentStats.positive_percentage)}
                </p>
              </div>

              <div className="md:col-span-3 bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm border border-gray-200/50">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Rating Distribution
                </h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <span className="w-8 text-sm text-gray-600">
                        {rating}★
                      </span>
                      <div className="flex-1 mx-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{
                              width: `${serviceSentimentStats.rating_distribution[rating] || 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="w-12 text-sm text-gray-600 text-right">
                        {serviceSentimentStats.rating_distribution[rating] || 0}
                        %
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select a service to view sentiment analytics
            </div>
          )}
        </div>
      )}

      {/* Error Handling */}
      {(emailError || sentimentError) && (
        <div className="bg-red-50/80 border border-red-200/50 text-red-600 px-4 py-3 rounded-md backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <span>Failed to load analytics data</span>
            <button
              type="button"
              onClick={() => {
                refetchEmail();
                refetchSentiment();
              }}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAnalyticsDashboard;
