import Skeleton from "./Skeleton";

const ServiceCardSkeleton = ({ count = 1 }) => {
  const skeletons = [];
  for (let i = 0; i < count; i++) {
    skeletons.push(
      <div
        key={i}
        className="card backdrop-blur-lg bg-white/70 border border-white/20 h-full flex flex-col"
      >
        {/* Service Image Skeleton */}
        <div className="mb-4">
          <Skeleton variant="rect" height={192} className="w-full rounded-lg" />
        </div>

        {/* Service Info Skeleton */}
        <div className="space-y-3 p-2">
          <Skeleton
            variant="text"
            height={24}
            width="80%"
            className="rounded"
          />

          <Skeleton
            variant="text"
            height={16}
            width="100%"
            className="rounded"
          />

          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((starId) => (
                <Skeleton
                  key={`service-star-${starId}`}
                  variant="rect"
                  width={16}
                  height={16}
                  className="rounded"
                />
              ))}
            </div>
            <Skeleton
              variant="text"
              height={14}
              width={60}
              className="rounded"
            />
          </div>

          <div className="flex items-center justify-between mt-auto pt-2">
            <Skeleton
              variant="text"
              height={24}
              width={60}
              className="rounded"
            />
            <Skeleton
              variant="rect"
              height={32}
              width={90}
              className="rounded"
            />
          </div>
        </div>
      </div>,
    );
  }

  return <>{skeletons}</>;
};

export default ServiceCardSkeleton;
