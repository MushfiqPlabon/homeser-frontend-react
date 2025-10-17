import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

const AnimatedToast = ({ toasts, removeToast }) => {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case "error":
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case "warning":
        return <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100/90 backdrop-blur-sm border-green-200/50 text-green-800";
      case "error":
        return "bg-red-100/90 backdrop-blur-sm border-red-200/50 text-red-800";
      case "warning":
        return "bg-yellow-100/90 backdrop-blur-sm border-yellow-200/50 text-yellow-800";
      default:
        return "bg-blue-100/90 backdrop-blur-sm border-blue-200/50 text-blue-800";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`flex items-start p-4 rounded-lg border shadow-lg max-w-sm ${getBgColor(toast.type)}`}
          >
            <div className="flex-shrink-0">{getIcon(toast.type)}</div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.message && (
                <p className="mt-1 text-sm opacity-90">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="ml-4 flex-shrink-0 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close notification"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                role="img"
                aria-label="Close icon"
              >
                <title>Close icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedToast;
