// EnhancedGenericManagement.jsx
// Generic management component for various admin functions

import {
  MagnifyingGlassIcon,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useId, useState } from "react";
import {
  useAdvancedSearchRTK,
  usePopularSearchesRTK,
  useSearchAnalyticsRTK,
} from "../hooks/useApi";
import AnalyticsDashboard from "./AnalyticsDashboard";

const EnhancedGenericManagement = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLimit, setSearchLimit] = useState(20);
  const [searchLanguage, setSearchLanguage] = useState("en");

  // Generate unique IDs for form elements
  const searchQueryId = useId();
  const resultsLimitId = useId();
  const searchLanguageId = useId();

  // Search analytics data
  const { data: searchAnalytics } = useSearchAnalyticsRTK();
  const { data: popularSearches } = usePopularSearchesRTK({
    limit: 10,
  });
  const { data: advancedSearchResults, isLoading: searchLoading } =
    useAdvancedSearchRTK(
      { q: searchQuery, limit: searchLimit, language: searchLanguage },
      { skip: !searchQuery },
    );

  // Function to render stars
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Search</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "search"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Advanced Search
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "analytics"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeTab === "search" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Advanced Search
            </h3>
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
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-3 sm:text-sm border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm"
                    placeholder="Enter search query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-32">
                <label
                  htmlFor={resultsLimitId}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Results
                </label>
                <select
                  id={resultsLimitId}
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
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
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm"
                  value={searchLanguage}
                  onChange={(e) => setSearchLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          {searchQuery && (
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Search Results
              </h3>

              {searchLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : advancedSearchResults ? (
                <div className="space-y-4">
                  {advancedSearchResults.results?.map((result) => (
                    <div
                      key={result.id || result.name}
                      className="flex items-start p-4 border border-gray-200/50 rounded-lg backdrop-blur-sm bg-white/50"
                    >
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                        <img
                          src={result.image_url}
                          alt={result.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {result.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {result.description}
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center">
                            {renderStars(result.avg_rating)}
                            <span className="ml-2 text-sm text-gray-500">
                              {result.avg_rating} ({result.review_count}{" "}
                              reviews)
                            </span>
                          </div>
                          <span className="ml-4 text-sm font-medium text-primary-600">
                            ৳{result.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Enter a search query to see results
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Popular Searches */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Popular Searches
              </h3>
              <ul className="space-y-3">
                {popularSearches?.popular_searches
                  ?.slice(0, 5)
                  .map((search) => (
                    <li
                      key={search.id || search.query}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-700">
                        #
                        {popularSearches?.popular_searches?.indexOf(search) + 1}{" "}
                        {search.query}
                      </span>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {search.count} searches
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Search Analytics */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Search Analytics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Searches</span>
                  <span className="font-medium">
                    {searchAnalytics?.total_searches || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium">
                    {searchAnalytics?.success_rate || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Results per Search</span>
                  <span className="font-medium">
                    {searchAnalytics?.avg_results_per_search || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && <AnalyticsDashboard />}
    </div>
  );
};

export default EnhancedGenericManagement;
