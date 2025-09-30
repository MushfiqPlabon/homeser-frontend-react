// SentimentAnalysisDashboard.jsx
// This component was removed because it referenced non-existent backend endpoints.
// The following RTK Query hooks were not defined in the extendedApiSlice:
// - useGetSentimentStatsRTKQuery
// - useGetServiceSentimentStatsRTKQuery
// - useGetReviewStatsQuery
// These hooks were removed during the frontend-backend synchronization process.

// This is an empty component to maintain the import structure without errors.
const SentimentAnalysisDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Sentiment Analysis Dashboard Removed</h1>
      <p className="text-gray-600 mt-2">
        This dashboard was removed as it referenced non-existent backend analytics endpoints.
      </p>
    </div>
  );
};

export default SentimentAnalysisDashboard;

  // Format percentage
  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Render stars
  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} className="text-yellow-400">
        {star <= rating ? (
          <StarIconSolid className="h-4 w-4" />
        ) : (
          <StarIcon className="h-4 w-4" />
        )}
      </span>
    ));
  };

  return (
    <div
      className={`space-y-6 ${expandedView ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : ""}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Sentiment Analysis Dashboard
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

      {/* Tabs */}
      <div className="border-b border-gray-200/50">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`${
              activeTab === "overview"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`${
              activeTab === "reviews"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
            Reviews
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`${
              activeTab === "analytics"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
            Detailed Analytics
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Sentiment Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <ChatBubbleLeftRightIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Reviews
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {sentimentLoading
                      ? "Loading..."
                      : sentimentStats?.total_reviews || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                  <StarIconSolid className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Average Rating
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {sentimentLoading
                      ? "Loading..."
                      : (sentimentStats?.average_rating || 0).toFixed(2)}
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
                    Positive Reviews
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {sentimentLoading
                      ? "Loading..."
                      : formatPercentage(
                          sentimentStats?.positive_percentage || 0,
                        )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Review Growth
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {sentimentLoading
                      ? "Loading..."
                      : formatPercentage(sentimentStats?.review_growth || 0)}
                  </p>
                  <div className="flex items-center mt-1">
                    {sentimentStats?.review_growth >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-xs ${sentimentStats?.review_growth >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatPercentage(
                        Math.abs(sentimentStats?.review_growth || 0),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Rating Distribution
            </h3>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="w-16">
                    <div className="flex items-center">
                      {renderStars(rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        {rating}★
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{
                          width: `${sentimentStats?.rating_distribution?.[rating] || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-gray-600">
                    {sentimentStats?.rating_distribution?.[rating] || 0}%
                  </div>
                  <div className="w-20 text-right text-sm text-gray-600">
                    ({sentimentStats?.rating_counts?.[rating] || 0} reviews)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Services */}
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

            <div className="space-y-4">
              {sentimentStats?.top_rated_services
                ?.slice(0, 5)
                .map((service, index) => (
                  <div
                    key={service.id}
                    className="flex items-center p-4 border border-gray-200/50 rounded-lg backdrop-blur-sm bg-white/50 hover:bg-gray-50/30 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                      <span className="font-bold text-gray-700">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {service.name}
                      </h4>
                      <div className="flex items-center mt-1">
                        {renderStars(service.avg_rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          {service.avg_rating.toFixed(2)} (
                          {service.review_count} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ৳{service.price?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          {/* Review Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Review Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-medium">
                    {reviewStatsLoading
                      ? "Loading..."
                      : reviewStats?.total_reviews || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Rating</span>
                  <span className="font-medium">
                    {reviewStatsLoading
                      ? "Loading..."
                      : (reviewStats?.average_rating || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verified Purchases</span>
                  <span className="font-medium">
                    {reviewStatsLoading
                      ? "Loading..."
                      : reviewStats?.verified_purchases || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Helpful Votes</span>
                  <span className="font-medium">
                    {reviewStatsLoading
                      ? "Loading..."
                      : reviewStats?.helpful_votes || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-200/50 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Reviews
              </h3>
              <div className="space-y-4">
                {reviewsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
                  </div>
                ) : reviewsError ? (
                  <div className="text-center py-4 text-red-500">
                    Failed to load recent reviews
                  </div>
                ) : (
                  reviews?.slice(0, 5).map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200/50 rounded-lg p-4 backdrop-blur-sm bg-white/50"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {review.service?.name || "Service"}
                          </h4>
                          <div className="flex items-center mt-1">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-600">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">
                            {formatDate(review.created)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        {review.text}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-600">
                          by{" "}
                          {review.user?.username ||
                            review.user?.first_name ||
                            "Anonymous"}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-sm text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Service-Specific Reviews */}
          {selectedService && (
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Reviews for{" "}
                  {serviceSentimentStats?.service?.name || "Selected Service"}
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
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
                </div>
              ) : serviceSentimentError ? (
                <div className="text-center py-4 text-red-500">
                  Failed to load service reviews
                </div>
              ) : serviceSentimentStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm border border-gray-200/50">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        Average Rating
                      </h4>
                      <p className="text-2xl font-semibold text-gray-900">
                        {serviceSentimentStats.average_rating?.toFixed(2) ||
                          "0.00"}
                      </p>
                    </div>

                    <div className="bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm border border-gray-200/50">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        Total Reviews
                      </h4>
                      <p className="text-2xl font-semibold text-gray-900">
                        {serviceSentimentStats.total_reviews || 0}
                      </p>
                    </div>

                    <div className="bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm border border-gray-200/50">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        Positive Reviews
                      </h4>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formatPercentage(
                          serviceSentimentStats.positive_percentage || 0,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-200/50 rounded-lg p-4 backdrop-blur-sm bg-white/50">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Rating Distribution
                    </h4>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <div className="w-12">
                            <div className="flex items-center">
                              {renderStars(rating)}
                              <span className="ml-1 text-xs text-gray-600">
                                {rating}★
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 mx-2">
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{
                                  width: `${serviceSentimentStats.rating_distribution?.[rating] || 0}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-12 text-right text-xs text-gray-600">
                            {serviceSentimentStats.rating_distribution?.[
                              rating
                            ] || 0}
                            %
                          </div>
                          <div className="w-16 text-right text-xs text-gray-600">
                            (
                            {serviceSentimentStats.rating_counts?.[rating] || 0}{" "}
                            reviews)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Select a service to view reviews
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Detailed Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Sentiment Trends */}
          <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sentiment Trends
            </h3>
            <div className="h-64 flex items-center justify-center border border-gray-200/50 rounded-lg">
              <p className="text-gray-500">
                Sentiment trends chart visualization would appear here
              </p>
            </div>
          </div>

          {/* Review Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Review Sources
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Website</span>
                  <span className="font-medium">
                    {sentimentLoading
                      ? "Loading..."
                      : formatPercentage(sentimentStats?.website_reviews || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile App</span>
                  <span className="font-medium">
                    {sentimentLoading
                      ? "Loading..."
                      : formatPercentage(sentimentStats?.mobile_reviews || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">
                    {sentimentLoading
                      ? "Loading..."
                      : formatPercentage(sentimentStats?.email_reviews || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Social Media</span>
                  <span className="font-medium">
                    {sentimentLoading
                      ? "Loading..."
                      : formatPercentage(sentimentStats?.social_reviews || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Review Verification
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Verified Purchases</span>
                  <span className="font-medium">
                    {sentimentLoading
                      ? "Loading..."
                      : formatPercentage(
                          sentimentStats?.verified_percentage || 0,
                        )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unverified Reviews</span>
                  <span className="font-medium">
                    {sentimentLoading
                      ? "Loading..."
                      : formatPercentage(
                          sentimentStats?.unverified_percentage || 0,
                        )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flagged Reviews</span>
                  <span className="font-medium">
                    {sentimentLoading
                      ? "Loading..."
                      : formatPercentage(
                          sentimentStats?.flagged_percentage || 0,
                        )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Helpful Reviews</span>
                  <span className="font-medium">
                    {sentimentLoading
                      ? "Loading..."
                      : formatPercentage(
                          sentimentStats?.helpful_percentage || 0,
                        )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Analysis by Category */}
          <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sentiment Analysis by Category
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Reviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Positive %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Negative %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200/50">
                  {sentimentLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      </td>
                    </tr>
                  ) : sentimentError ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-red-500"
                      >
                        Failed to load category sentiment data
                      </td>
                    </tr>
                  ) : (
                    sentimentStats?.category_sentiment?.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.avg_rating?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.total_reviews || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPercentage(category.positive_percentage || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPercentage(category.negative_percentage || 0)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Error Handling */}
      {(sentimentError || reviewsError || reviewStatsError) && (
        <div className="bg-red-50/80 border border-red-200/50 text-red-600 px-4 py-3 rounded-md backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <span>Failed to load sentiment analytics data</span>
            <button
              type="button"
              onClick={() => {
                refetchSentiment();
                refetchReviews();
                refetchReviewStats();
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

export default SentimentAnalysisDashboard;
