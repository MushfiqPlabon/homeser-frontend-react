// Services.jsx
// This page component displays a list of available services, allowing users to search,
// filter, and sort them. It fetches service data from the backend API.

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useCallback, useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import LazyImage from "../components/LazyImage";
import { servicesAPI } from "../utils/api";
import { getFallbackImage } from "../utils/imageUtils";
import { usePerformanceMonitor } from "../utils/performanceMonitoring";
import { renderStars } from "../utils/uiUtils.jsx";

const Services = () => {
  const performanceMonitor = usePerformanceMonitor();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Generate unique IDs for form elements
  const sortBySelectId = useId();
  const searchInputId = useId();

  const fetchServices = useCallback(async () => {
    const operationId = `fetchServices_${Date.now()}`;
    performanceMonitor.startTiming(operationId);

    try {
      setLoading(true);
      const params = {
        page: page,
      };
      if (sortBy) {
        params.ordering = sortBy;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await servicesAPI.getServices(params);
      const _data = response.data;

      // Handle the nested response structure from the backend
      const actualData = response.data?.data || response.data;

      // Handle both paginated and non-paginated responses
      if (actualData.results) {
        setServices(actualData.results);
        setHasNextPage(!!actualData.next);
        setHasPreviousPage(!!actualData.previous);
      } else {
        setServices(actualData);
        setHasNextPage(false);
        setHasPreviousPage(false);
      }

      // Record successful fetch time
      const duration = performanceMonitor.endTiming(
        operationId,
        "services_fetch",
      );
      performanceMonitor.recordMetric("services_fetch_duration", duration);
    } catch (err) {
      // Record failed fetch time
      const duration = performanceMonitor.endTiming(
        operationId,
        "services_fetch",
      );
      performanceMonitor.recordMetric("services_fetch_duration", duration);

      // Check if it's an axios cancellation
      if (axios.isCancel?.(err)) {
        // Request was cancelled, which is expected behavior
      } else if (
        err.code === "ERR_NETWORK" ||
        err.message === "Network Error"
      ) {
        // Network error or request aborted
      } else {
        setError("Failed to load services. Please try again later.");
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, searchTerm, performanceMonitor]);

  useEffect(() => {
    // Log the API base URL for debugging purposes
    // console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);
  }, []);

  // Fetch services when page, sortBy, or searchTerm changes
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Filter services based on search term (now handled by backend)
  const filteredServices = services;

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-2"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 backdrop-blur-sm bg-white/30 rounded-2xl p-4 inline-block">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto backdrop-blur-sm bg-white/20 rounded-xl p-3">
            Professional household services delivered by verified experts
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id={searchInputId}
              name="search"
              type="text"
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor={sortBySelectId}
              className="text-sm font-medium text-gray-700"
            >
              Sort by:
            </label>
            <select
              id={sortBySelectId}
              name="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value="">Default</option>
              <option value="-avg_rating">Highest Rated</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 border border-red-200/50 text-red-600 px-4 py-3 rounded-md mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Services Grid */}
        {filteredServices.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg backdrop-blur-sm bg-white/30 rounded-xl p-4 inline-block">
              {searchTerm
                ? "No services found matching your search."
                : "No services available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="card hover:shadow-lg transition-all duration-300 backdrop-blur-lg bg-white/70 border border-white/20"
              >
                {/* Service Image */}
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  {service.image_url ? (
                    <LazyImage
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <LazyImage
                      src={getFallbackImage(service.name)}
                      alt={service.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* Service Info */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.name}
                  </h3>

                  <p className="text-gray-600 text-sm">{service.short_desc}</p>

                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    {service.avg_rating > 0 ? (
                      renderStars(service.avg_rating)
                    ) : (
                      <span className="text-sm text-gray-500">
                        No ratings yet
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {service.review_count} review
                      {service.review_count !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      ৳{service.price}
                    </span>
                    <Link
                      to={`/services/${service.id}`}
                      className="btn-primary backdrop-blur-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage || page === 1}
            className={`px-4 py-2 rounded-md backdrop-blur-sm ${
              !hasPreviousPage || page === 1
                ? "bg-gray-200/50 text-gray-500 cursor-not-allowed border border-gray-300/30"
                : "bg-white/70 text-gray-700 hover:bg-white/90 border border-white/30 shadow-sm"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-600 backdrop-blur-sm bg-white/30 rounded-lg px-3 py-1">
            Page {page}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className={`px-4 py-2 rounded-md backdrop-blur-sm ${
              !hasNextPage
                ? "bg-gray-200/50 text-gray-500 cursor-not-allowed border border-gray-300/30"
                : "bg-white/70 text-gray-700 hover:bg-white/90 border border-white/30 shadow-sm"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
