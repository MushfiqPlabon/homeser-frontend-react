import { createContext, useContext, useState } from "react";
import ToastNotification from "../components/ToastNotification";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random(); // Unique ID for each toast
    const newToast = { id, message, type, duration };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Remove toast after duration
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  };

  const hideToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
