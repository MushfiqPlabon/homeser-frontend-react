// AdvancedSearchInterface.jsx
// Component for advanced search functionality with filters and analytics

import {
  ArrowPathIcon,
  ChartBarIcon,
  FireIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useId, useState } from "react";
import {
  useAdvancedSearchRTKQuery,
  useGetPopularSearchesRTKQuery,
  useGetSearchAnalyticsRTKQuery,
} from "../store/extendedApiSlice";

const AdvancedSearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sortBy: "relevance",
    sortOrder: "desc",
    language: "en",
  });
  const [searchLimit, setSearchLimit] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("results");

  // Generate unique IDs for form elements
  const searchQueryId = useId();
  const searchLimitId = useId();
  const searchLanguageId = useId();
  const categoryFilterId = useId();
  const minPriceId = useId();
  const maxPriceId = useId();
  const minRatingId = useId();
  const sortById = useId();
  const sortOrderId = useId();

  // Search data
  const {
    data: searchResults,
    isLoading: searchLoading,
    isError: searchError,
    refetch: refetchSearch,
  } = useAdvancedSearchRTKQuery(
    {
      q: searchQuery,
      ...searchFilters,
      limit: searchLimit,
      language: searchFilters.language,
    },
    { skip: !searchQuery },
  );

  // Search analytics data
  const { data: searchAnalytics, isLoading: analyticsLoading } =
    useGetSearchAnalyticsRTKQuery();

  // Popular searches data
  const { data: popularSearches, isLoading: popularSearchesLoading } =
    useGetPopularSearchesRTKQuery({ limit: 10 });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        refetchSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, refetchSearch]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setSearchFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sortBy: "relevance",
      sortOrder: "desc",
      language: "en",
    });
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
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <MagnifyingGlassIcon className="h-8 w-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900">Advanced Search</h1>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label
              htmlFor={searchQueryId}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Query
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id={searchQueryId}
                type="text"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-3 sm:text-sm border-gray-300/50 rounded-lg backdrop-blur-sm bg-white/50"
                placeholder="Enter search query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="w-32">
            <label
              htmlFor={searchLimitId}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Results
            </label>
            <select
              id={searchLimitId}
              className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
              value={searchLimit}
              onChange={(e) => setSearchLimit(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="w-32">
            <label
              htmlFor={searchLanguageId}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Language
            </label>
            <select
              id={searchLanguageId}
              className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
              value={searchFilters.language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center"
            >
              <FunnelIcon className="h-5 w-5 mr-1" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor={categoryFilterId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id={categoryFilterId}
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={searchFilters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                >
                  <option value="">All Categories</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="painting">Painting</option>
                  <option value="carpentry">Carpentry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor={minPriceId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Min Price
                </label>
                <input
                  type="number"
                  id={minPriceId}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={searchFilters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  placeholder="0.00"
                />
              </div>

              <div>
                <label
                  htmlFor={maxPriceId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Max Price
                </label>
                <input
                  type="number"
                  id={maxPriceId}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={searchFilters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  placeholder="10000.00"
                />
              </div>

              <div>
                <label
                  htmlFor={minRatingId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Min Rating
                </label>
                <select
                  id={minRatingId}
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={searchFilters.minRating}
                  onChange={(e) =>
                    handleFilterChange("minRating", e.target.value)
                  }
                >
                  <option value="">Any Rating</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor={sortById}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort By
                </label>
                <select
                  id={sortById}
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={searchFilters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor={sortOrderId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort Order
                </label>
                <select
                  id={sortOrderId}
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-transparent backdrop-blur-sm bg-white/50"
                  value={searchFilters.sortOrder}
                  onChange={(e) =>
                    handleFilterChange("sortOrder", e.target.value)
                  }
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn-secondary w-full"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Results and Analytics Tabs */}
      <div className="border-b border-gray-200/50">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("results")}
            className={`${
              activeTab === "results"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Search Results
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
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Search Analytics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("popular")}
            className={`${
              activeTab === "popular"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <FireIcon className="h-5 w-5 mr-2" />
            Popular Searches
          </button>
        </nav>
      </div>

      {/* Search Results Tab */}
      {activeTab === "results" && (
        <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results {searchQuery && `for "${searchQuery}"`}
            </h2>
            <span className="text-sm text-gray-600">
              {searchResults?.results?.length || 0} result
              {searchResults?.results?.length !== 1 ? "s" : ""}
            </span>
          </div>

          {searchLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
            </div>
          ) : searchError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                Failed to perform search:{" "}
                {searchError?.message || "Unknown error"}
              </div>
              <button
                type="button"
                onClick={refetchSearch}
                className="btn-primary flex items-center mx-auto"
              >
                <ArrowPathIcon className="h-5 w-5 mr-1" />
                Retry
              </button>
            </div>
          ) : searchQuery && searchResults ? (
            <div className="space-y-6">
              {searchResults.results?.map((result) => (
                <div
                  key={result.id}
                  className="flex items-start p-4 border border-gray-200/50 rounded-lg backdrop-blur-sm bg-white/50 hover:bg-gray-50/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center mr-6">
                    {result.image_url ? (
                      <img
                        src={result.image_url}
                        alt={result.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {result.name}
                      </h3>
                      <span className="text-xl font-bold text-primary-600">
                        ৳{result.price?.toFixed(2) || "0.00"}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mt-1">
                      {result.short_desc}
                    </p>

                    <div className="flex items-center mt-2">
                      {result.avg_rating > 0 ? (
                        renderStars(result.avg_rating)
                      ) : (
                        <span className="text-sm text-gray-500">
                          No ratings yet
                        </span>
                      )}
                      <span className="text-sm text-gray-500 ml-2">
                        {result.review_count} review
                        {result.review_count !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/services/${result.id}`)}
                        className="btn-primary"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Add to cart functionality would go here
                        }}
                        className="btn-secondary"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Start Searching
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter a search query to find services.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Search Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
          <div className="flex items-center space-x-2 mb-6">
            <ChartBarIcon className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Search Analytics
            </h2>
          </div>

          {analyticsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm border border-gray-200/50">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Searches
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {searchAnalytics?.total_searches || 0}
                </p>
              </div>

              <div className="bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm border border-gray-200/50">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Success Rate
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {searchAnalytics?.success_rate
                    ? `${searchAnalytics.success_rate.toFixed(2)}%`
                    : "0.00%"}
                </p>
              </div>

              <div className="bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm border border-gray-200/50">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Avg Results per Search
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {searchAnalytics?.avg_results_per_search || 0}
                </p>
              </div>

              <div className="md:col-span-3 bg-gray-50/50 p-4 rounded-lg backdrop-blur-sm border border-gray-200/50">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Searches by Language
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(
                    searchAnalytics?.searches_by_language || {},
                  ).map(([language, count]) => (
                    <div key={language} className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {count}
                      </p>
                      <p className="text-sm text-gray-600">{language}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Popular Searches Tab */}
      {activeTab === "popular" && (
        <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
          <div className="flex items-center space-x-2 mb-6">
            <FireIcon className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Popular Searches
            </h2>
          </div>

          {popularSearchesLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularSearches?.popular_searches?.map((search) => (
                <div
                  key={search.id || search.query}
                  className="border border-gray-200/50 rounded-lg p-4 backdrop-blur-sm bg-white/50 hover:bg-gray-50/30 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">
                      #{index + 1}
                    </span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {search.count} searches
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2">{search.query}</p>
                  {search.last_searched && (
                    <p className="text-sm text-gray-500 mt-2">
                      Last searched: {formatDate(search.last_searched)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchInterface;
