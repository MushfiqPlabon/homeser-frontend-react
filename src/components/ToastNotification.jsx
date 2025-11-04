import { useEffect } from "react";
import { FadeTransition } from "./";

const ToastNotification = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-white",
  };

  return (
    <FadeTransition
      className={`max-w-md px-4 py-3 rounded-md shadow-lg ${typeStyles[type]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-hidden"
        >
          &times;
        </button>
      </div>
    </FadeTransition>
  );
};

export default ToastNotification;
