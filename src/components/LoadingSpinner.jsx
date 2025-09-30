import { getSpinnerSizeClasses } from "../utils/shared/uiComponents";

const LoadingSpinner = ({ size = "md", message = "", fullscreen = false }) => {
  const spinner = (
    <div
      className={`${getSpinnerSizeClasses(size)} animate-spin rounded-full border-b-2 border-primary-600 backdrop-blur-sm bg-white/30 rounded-full p-1`}
    ></div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50">
        <div className="text-center">
          {spinner}
          {message && (
            <p className="mt-4 text-lg font-medium text-gray-700 backdrop-blur-sm bg-white/30 rounded-xl p-2">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {spinner}
      {message && <span className="ml-3 text-gray-700">{message}</span>}
    </div>
  );
};

export default LoadingSpinner;
