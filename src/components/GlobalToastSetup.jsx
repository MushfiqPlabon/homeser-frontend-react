// GlobalToastSetup.jsx
// Component to set up global toast function for RTK Query error handling

import { useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { setGlobalToastFunction } from "../store/baseQueryWithToasts";

const GlobalToastSetup = () => {
  const { showToast } = useToast();

  useEffect(() => {
    // Set the global toast function for RTK Query error handling
    setGlobalToastFunction(showToast);
  }, [showToast]);

  return null; // This component doesn't render anything
};

export default GlobalToastSetup;
