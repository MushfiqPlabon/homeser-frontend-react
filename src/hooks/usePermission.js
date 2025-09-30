import { useAuth } from "../context/AuthContext";

const usePermission = () => {
  const { hasPermission, isAuthenticated } = useAuth();

  // Check if user has a specific permission
  const checkPermission = (permission) => {
    if (!isAuthenticated) return false;
    return hasPermission ? hasPermission(permission) : false;
  };

  // Check if user has all specified permissions
  const hasAllPermissions = (permissions) => {
    if (!isAuthenticated || !Array.isArray(permissions)) return false;
    return permissions.every((permission) =>
      hasPermission ? hasPermission(permission) : false,
    );
  };

  // Check if user has at least one of the specified permissions
  const hasAnyPermission = (permissions) => {
    if (!isAuthenticated || !Array.isArray(permissions)) return false;
    return permissions.some((permission) =>
      hasPermission ? hasPermission(permission) : false,
    );
  };

  return {
    checkPermission,
    hasAllPermissions,
    hasAnyPermission,
  };
};

export default usePermission;
