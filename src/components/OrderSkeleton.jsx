import Skeleton from "./Skeleton";

const OrderSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card p-6 backdrop-blur-lg bg-white/70 border border-white/20">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Skeleton
              variant="text"
              height={24}
              width="120px"
              className="mb-2 rounded-sm"
            />
            <Skeleton
              variant="text"
              height={16}
              width="80px"
              className="rounded-sm"
            />
          </div>
          <Skeleton
            variant="rect"
            width="100px"
            height="40px"
            className="rounded-lg"
          />
        </div>

        {/* Order Items */}
        <div className="mb-8">
          {[1, 2, 3].map((itemId) => (
            <div
              key={`order-item-${itemId}`}
              className="flex items-center py-4 border-b border-gray-200 last:border-0"
            >
              <Skeleton
                variant="rect"
                width={80}
                height={80}
                className="rounded-lg mr-4"
              />
              <div className="flex-1">
                <Skeleton
                  variant="text"
                  height={20}
                  width="60%"
                  className="mb-2 rounded-sm"
                />
                <Skeleton
                  variant="text"
                  height={14}
                  width="40%"
                  className="mb-2 rounded-sm"
                />
                <div className="flex items-center">
                  <Skeleton
                    variant="text"
                    height={16}
                    width="50px"
                    className="mr-4 rounded-sm"
                  />
                  <Skeleton
                    variant="text"
                    height={16}
                    width="70px"
                    className="rounded-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-2">
            <Skeleton
              variant="text"
              height={16}
              width="80px"
              className="rounded-sm"
            />
            <Skeleton
              variant="text"
              height={16}
              width="60px"
              className="rounded-sm"
            />
          </div>
          <div className="flex justify-between mb-2">
            <Skeleton
              variant="text"
              height={16}
              width="100px"
              className="rounded-sm"
            />
            <Skeleton
              variant="text"
              height={16}
              width="60px"
              className="rounded-sm"
            />
          </div>
          <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
            <Skeleton
              variant="text"
              height={20}
              width="120px"
              className="rounded-sm"
            />
            <Skeleton
              variant="text"
              height={20}
              width="80px"
              className="rounded-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSkeleton;
