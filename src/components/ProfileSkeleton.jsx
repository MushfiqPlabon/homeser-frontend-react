import Skeleton from "./Skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-white/80 border border-gray-200/50">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-primary-500 to-primary-600 p-6">
            <div className="flex items-center space-x-6">
              <Skeleton variant="circle" width={120} height={120} />
              <div className="flex-1">
                <Skeleton
                  variant="text"
                  width="40%"
                  height={32}
                  className="mb-2"
                />
                <Skeleton variant="text" width="30%" height={20} />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <Skeleton
                  variant="text"
                  width="30%"
                  height={20}
                  className="mb-2"
                />
                <Skeleton
                  variant="rect"
                  width="100%"
                  height={40}
                  className="rounded-md mb-4"
                />

                <Skeleton
                  variant="text"
                  width="30%"
                  height={20}
                  className="mb-2"
                />
                <Skeleton
                  variant="rect"
                  width="100%"
                  height={40}
                  className="rounded-md mb-4"
                />

                <Skeleton
                  variant="text"
                  width="30%"
                  height={20}
                  className="mb-2"
                />
                <Skeleton
                  variant="rect"
                  width="100%"
                  height={100}
                  className="rounded-md"
                />
              </div>

              <div>
                <Skeleton
                  variant="text"
                  width="30%"
                  height={20}
                  className="mb-2"
                />
                <Skeleton
                  variant="rect"
                  width="100%"
                  height={40}
                  className="rounded-md mb-4"
                />

                <Skeleton
                  variant="text"
                  width="30%"
                  height={20}
                  className="mb-2"
                />
                <Skeleton
                  variant="rect"
                  width="100%"
                  height={40}
                  className="rounded-md mb-4"
                />

                <Skeleton
                  variant="text"
                  width="30%"
                  height={20}
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

            <div className="flex justify-end">
              <Skeleton
                variant="rect"
                width={120}
                height={40}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
