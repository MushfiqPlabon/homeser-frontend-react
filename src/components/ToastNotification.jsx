import { useEffect } from "react";

const ToastNotification = ({
  message,
  type = "info",
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50/80 border-green-200/50 text-green-800";
      case "error":
        return "bg-red-50/80 border-red-200/50 text-red-800";
      case "warning":
        return "bg-yellow-50/80 border-yellow-200/50 text-yellow-800";
      default:
        return "bg-blue-50/80 border-blue-200/50 text-blue-800";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border backdrop-blur-lg ${getTypeStyles()} transition-all duration-300 transform hover:scale-105`}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <title>Close notification</title>
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
