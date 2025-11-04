import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";
import { renderStars } from "../utils/uiUtils.jsx";
import { getFallbackImage } from "../utils/imageUtils";

const VirtualizedServiceList = ({
  services,
  loading,
  error,
  searchTerm,
  onPageChange,
  page,
  hasNextPage,
  hasPreviousPage,
}) => {
  return (
    <div className="w-full">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50/80 border border-red-200/50 text-red-600 px-4 py-3 rounded-md mb-6 backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Services Grid */}
      {services && services.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg backdrop-blur-sm bg-white/30 rounded-xl p-4 inline-block">
            {searchTerm
              ? "No services found matching your search."
              : "No services available."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(services || []).map((service, index) => (
            <div
              key={service.id || index}
              className="card hover:shadow-lg transition-all duration-300 backdrop-blur-lg bg-white/70 border border-white/20 h-full flex flex-col"
            >
              {/* Service Image */}
              <div className="aspect-w-16 aspect-h-9 mb-4">
                {service.image_url ? (
                  <LazyImage
                    src={service.image_url}
                    alt={service.name || "Service image"}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <LazyImage
                    src={getFallbackImage(service.name)}
                    alt={service.name || "Service image"}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Service Info */}
              <div className="space-y-3 p-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {service.name || "Service Name"}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {service.short_desc || ""}
                </p>

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
                    {service.review_count || 0} review
                    {service.review_count !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">
                    ৳{service.price || 0}
                  </span>
                  <Link
                    to={`/services/${service.id || ""}`}
                    className="btn-primary backdrop-blur-sm whitespace-nowrap"
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
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPreviousPage || page === 1}
          className={`px-4 py-2 rounded-md backdrop-blur-sm ${
            !hasPreviousPage || page === 1
              ? "bg-gray-200/50 text-gray-500 cursor-not-allowed border border-gray-300/30"
              : "bg-white/70 text-gray-700 hover:bg-white/90 border border-white/30 shadow-xs"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-600 backdrop-blur-sm bg-white/30 rounded-lg px-3 py-1">
          Page {page}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className={`px-4 py-2 rounded-md backdrop-blur-sm ${
            !hasNextPage
              ? "bg-gray-200/50 text-gray-500 cursor-not-allowed border border-gray-300/30"
              : "bg-white/70 text-gray-700 hover:bg-white/90 border border-white/30 shadow-xs"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VirtualizedServiceList;
