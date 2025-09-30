// SearchPage.jsx
// This page component provides advanced search functionality for services

import {
  ChartBarIcon,
  FireIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import LazyImage from "../components/LazyImage";
import { usePopularSearches, useSearchAnalytics } from "../hooks/useApi";
import { searchAPI } from "../utils/api";
import { getFallbackImage } from "../utils/imageUtils";
import { renderStars } from "../utils/uiUtils.jsx";

const SearchPage = () => {
  const navigate = useNavigate();

  const searchQueryId = useId();
  const searchLimitId = useId();
  const searchLanguageId = useId();
  const categoryFilterId = useId();
  const minPriceId = useId();
  const maxPriceId = useId();
  const ratingFilterId = useId();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLimit, setSearchLimit] = useState(20);
  const [searchLanguage, setSearchLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Search analytics data
  const { data: searchAnalytics } = useSearchAnalytics();
  const { data: popularSearches } = usePopularSearches({ limit: 10 });

  // Search function
  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await searchAPI.advancedSearch({
        q: searchQuery,
        limit: searchLimit,
        language: searchLanguage,
      });

      setSearchResults(response.data?.results || []);
    } catch (err) {
      setError("Failed to perform search. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, searchLimit, searchLanguage]);

  // Handle search on query change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <MagnifyingGlassIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Advanced Search</h1>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm bg-white/80 border border-gray-200/50">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter search terms..."
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
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 backdrop-blur-sm bg-white/50"
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
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 backdrop-blur-sm bg-white/50"
                  value={searchLanguage}
                  onChange={(e) => setSearchLanguage(e.target.value)}
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
                  className="btn-secondary"
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200/50">
                <div>
                  <label
                    htmlFor={categoryFilterId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id={categoryFilterId}
                    className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 backdrop-blur-sm bg-white/50"
                  >
                    <option value="">All Categories</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                </div>

                <div>
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      id={minPriceId}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 backdrop-blur-sm bg-white/50"
                    />
                    <input
                      type="number"
                      id={maxPriceId}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 backdrop-blur-sm bg-white/50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={ratingFilterId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Rating
                  </label>
                  <select
                    id={ratingFilterId}
                    className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 backdrop-blur-sm bg-white/50"
                  >
                    <option value="">Any Rating</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Results */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Search Results {searchQuery && `for "${searchQuery}"`}
                </h2>
                <span className="text-sm text-gray-600">
                  {searchResults.length} result
                  {searchResults.length !== 1 ? "s" : ""}
                </span>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">{error}</div>
                  <button
                    type="button"
                    onClick={performSearch}
                    className="btn-primary"
                  >
                    Retry
                  </button>
                </div>
              ) : searchResults.length === 0 ? (
                searchQuery ? (
                  <div className="text-center py-12">
                    <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No results found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search query or filters.
                    </p>
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
                )
              ) : (
                <div className="space-y-6">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-start p-4 border border-gray-200/50 rounded-lg backdrop-blur-sm bg-white/50 hover:bg-gray-50/30 transition-colors"
                    >
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center mr-6">
                        {result.image_url ? (
                          <LazyImage
                            src={result.image_url}
                            alt={result.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <LazyImage
                            src={getFallbackImage(result.name)}
                            alt={result.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {result.name}
                          </h3>
                          <span className="text-xl font-bold text-primary-600">
                            ৳{result.price}
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
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Analytics */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
              <div className="flex items-center space-x-2 mb-4">
                <ChartBarIcon className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Search Analytics
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Searches</span>
                  <span className="font-medium">
                    {searchAnalytics?.total_searches || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium">
                    {searchAnalytics?.success_rate || 0}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Results/Search</span>
                  <span className="font-medium">
                    {searchAnalytics?.avg_results_per_search || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
              <div className="flex items-center space-x-2 mb-4">
                <FireIcon className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Popular Searches
                </h3>
              </div>

              <div className="space-y-3">
                {popularSearches?.popular_searches
                  ?.slice(0, 5)
                  .map((search) => (
                    <button
                      key={search.query}
                      type="button"
                      onClick={() => setSearchQuery(search.query)}
                      className="w-full text-left flex justify-between items-center p-2 rounded-lg hover:bg-gray-50/50 transition-colors"
                    >
                      <span className="text-sm text-gray-700">
                        #{index + 1} {search.query}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {search.count}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
