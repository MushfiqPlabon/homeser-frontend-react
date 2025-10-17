import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { getFallbackImage } from "../utils/imageUtils";
import { renderStars } from "../utils/uiUtils.jsx";
import LazyImage from "./LazyImage";
import { AnimatedButton, AnimatedCard } from "./MicroInteractions";

const AnimatedServiceCard = ({ service, onAddToCart }) => {
  return (
    <AnimatedCard className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50 transform transition-all duration-300 hover:shadow-xl">
      <div className="p-5">
        <div className="flex justify-center mb-4">
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

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {service.name}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
            {service.category?.name || "General"}
          </span>
          <span className="text-lg font-bold text-primary-600">
            ৳{service.price}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.short_desc}
        </p>

        <div className="flex justify-between items-center mb-4">
          {service.avg_rating > 0 ? (
            <div className="flex items-center">
              {renderStars(service.avg_rating)}
              <span className="ml-2 text-sm text-gray-500">
                ({service.review_count}{" "}
                {service.review_count === 1 ? "review" : "reviews"})
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">No ratings yet</span>
          )}
        </div>

        <div className="pt-4 flex justify-between">
          <AnimatedButton
            onClick={() => onAddToCart(service)}
            className="flex items-center space-x-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span>Add to Cart</span>
          </AnimatedButton>

          <AnimatedButton className="px-4 py-2 text-gray-700 hover:text-primary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            <span>Details</span>
          </AnimatedButton>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default AnimatedServiceCard;
