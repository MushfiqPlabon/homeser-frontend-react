import Skeleton from "./Skeleton";

const ServiceListSkeleton = ({ count = 6 }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton variant="text" width="40%" height={40} className="mb-4" />
        <Skeleton variant="text" width="60%" height={20} />
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4, 5].map((filterId) => (
            <Skeleton
              key={`filter-${filterId}`}
              variant="rect"
              width={100}
              height={36}
              className="rounded-full"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }, (_, i) => i + 1).map((itemId) => (
          <div
            key={`service-${itemId}`}
            className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50"
          >
            <div className="p-5">
              <div className="flex justify-center mb-4">
                <Skeleton
                  variant="rect"
                  width="100%"
                  height={200}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-3">
                <Skeleton
                  variant="text"
                  width="80%"
                  height={24}
                  className="mb-2"
                />

                <div className="flex items-center space-x-1">
                  <Skeleton
                    variant="rect"
                    width={100}
                    height={20}
                    className="rounded-full"
                  />
                  <Skeleton variant="text" width={40} height={20} />
                </div>

                <Skeleton variant="text" width="60%" height={18} />

                <div className="flex justify-between items-center mt-4">
                  <Skeleton variant="text" width={80} height={24} />
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((starId) => (
                      <Skeleton
                        key={`rating-${itemId}-${starId}`}
                        variant="rect"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Skeleton
                    variant="rect"
                    width={120}
                    height={40}
                    className="rounded-md"
                  />
                  <Skeleton variant="text" width={60} height={24} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceListSkeleton;
