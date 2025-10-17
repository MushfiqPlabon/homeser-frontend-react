import Skeleton from "./Skeleton";

const CheckoutSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Skeleton variant="text" width="30%" height={32} className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
            <Skeleton variant="text" width="40%" height={24} className="mb-6" />

            <div className="space-y-4">
              {[1, 2, 3].map((itemId) => (
                <div
                  key={`checkout-item-${itemId}`}
                  className="flex justify-between items-center pb-4 border-b border-gray-200/50"
                >
                  <div className="flex items-center space-x-4">
                    <Skeleton
                      variant="rect"
                      width={60}
                      height={60}
                      className="rounded-lg"
                    />
                    <div>
                      <Skeleton
                        variant="text"
                        width={120}
                        height={18}
                        className="mb-2"
                      />
                      <Skeleton variant="text" width={80} height={16} />
                    </div>
                  </div>
                  <Skeleton variant="text" width={60} height={20} />
                </div>
              ))}

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <Skeleton variant="text" width={80} height={18} />
                  <Skeleton variant="text" width={60} height={18} />
                </div>
                <div className="flex justify-between">
                  <Skeleton variant="text" width={80} height={18} />
                  <Skeleton variant="text" width={60} height={18} />
                </div>
                <div className="border-t border-gray-300/50 pt-2">
                  <div className="flex justify-between">
                    <Skeleton variant="text" width={100} height={20} />
                    <Skeleton variant="text" width={80} height={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm bg-white/80 border border-gray-200/50">
            <Skeleton variant="text" width="40%" height={24} className="mb-6" />

            <div className="space-y-6">
              <div>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={16}
                  className="mb-2"
                />
                <Skeleton
                  variant="rect"
                  width="100%"
                  height={40}
                  className="rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={16}
                    className="mb-2"
                  />
                  <Skeleton
                    variant="rect"
                    width="100%"
                    height={40}
                    className="rounded-md"
                  />
                </div>
                <div>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={16}
                    className="mb-2"
                  />
                  <Skeleton
                    variant="rect"
                    width="100%"
                    height={40}
                    className="rounded-md"
                  />
                </div>
              </div>

              <div>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={16}
                  className="mb-2"
                />
                <Skeleton
                  variant="rect"
                  width="100%"
                  height={40}
                  className="rounded-md"
                />
              </div>

              <div>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={16}
                  className="mb-2"
                />
                <Skeleton
                  variant="rect"
                  width="100%"
                  height={100}
                  className="rounded-md"
                />
              </div>

              <Skeleton
                variant="rect"
                width="100%"
                height={48}
                className="rounded-md mt-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
