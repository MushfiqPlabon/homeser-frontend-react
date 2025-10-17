import Skeleton from "./Skeleton";

const DashboardOrderSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={150} height={28} />
        <div className="flex space-x-2">
          <Skeleton variant="text" width={50} height={20} />
          <Skeleton
            variant="rect"
            width={80}
            height={32}
            className="rounded-md"
          />
          <Skeleton
            variant="rect"
            width={120}
            height={32}
            className="rounded-md"
          />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: count }, (_, i) => i + 1).map((itemId) => (
          <div
            key={`dashboard-order-${itemId}`}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <Skeleton
                  variant="text"
                  width={120}
                  height={20}
                  className="mb-2"
                />
                <Skeleton variant="text" width={100} height={16} />
              </div>
              <div className="text-right">
                <Skeleton
                  variant="text"
                  width={80}
                  height={20}
                  className="mb-2"
                />
                <Skeleton
                  variant="rect"
                  width={60}
                  height={20}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="mt-3">
              <Skeleton variant="text" width={70} height={16} />
            </div>
            <div className="mt-3 flex justify-end">
              <Skeleton
                variant="rect"
                width={90}
                height={28}
                className="rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOrderSkeleton;
