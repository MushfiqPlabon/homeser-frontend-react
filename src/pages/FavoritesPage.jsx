import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../store/extendedApiSlice";
import { renderStars } from "../utils/uiUtils";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Only fetch favorites if user is authenticated
  const { data: favorites, isLoading } = useGetFavoritesQuery(undefined, {
    skip: !user,
  });
  const [removeFavorite] = useRemoveFavoriteMutation();

  // Redirect to login if not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleRemove = async (serviceId) => {
    await removeFavorite(serviceId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <HeartIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        </div>

        {favorites?.length === 0 ? (
          <div className="text-center py-12 card">
            <HeartIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No favorites yet
            </h3>
            <p className="mt-1 text-gray-500">
              Start adding services to your favorites
            </p>
            <button
              type="button"
              onClick={() => navigate("/services")}
              className="btn-primary mt-6"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites?.map((fav) => (
              <div key={fav.id} className="card">
                <img
                  src={fav.service.image_url || "/placeholder.jpg"}
                  alt={fav.service.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900">
                  {fav.service.name}
                </h3>
                <div className="mt-2">
                  {renderStars(fav.service.avg_rating)}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-primary-600">
                    ৳{fav.service.price}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/services/${fav.service.id}`)}
                      className="btn-primary"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(fav.service.id)}
                      className="btn-secondary text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
