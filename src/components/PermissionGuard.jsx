import { useAuth } from "../context/AuthContext";

const PermissionGuard = ({ permission, role, children, fallback = null }) => {
  const { hasPermission, hasRole, isAuthenticated } = useAuth();

  // If user is not authenticated, don't render children
  if (!isAuthenticated) {
    return fallback;
  }

  // Check permission if provided
  if (permission) {
    if (hasPermission?.(permission)) {
      return children;
    }
    return fallback;
  }

  // Check role if provided
  if (role) {
    if (hasRole?.(role)) {
      return children;
    }
    return fallback;
  }

  // If no permission or role specified, render children
  return children;
};

export default PermissionGuard;
