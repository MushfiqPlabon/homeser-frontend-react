import { useAuth } from "../context/AuthContext";

const useRole = () => {
  const {
    hasRole,
    isAuthenticated,
    isCustomer,
    isProvider,
    isAdmin,
    isSuperUser,
  } = useAuth();

  // Check if user has a specific role
  const checkRole = (role) => {
    if (!isAuthenticated) return false;
    return hasRole ? hasRole(role) : false;
  };

  // Check if user has all specified roles
  const hasAllRoles = (roles) => {
    if (!isAuthenticated || !Array.isArray(roles)) return false;
    return roles.every((role) => (hasRole ? hasRole(role) : false));
  };

  // Check if user has at least one of the specified roles
  const hasAnyRole = (roles) => {
    if (!isAuthenticated || !Array.isArray(roles)) return false;
    return roles.some((role) => (hasRole ? hasRole(role) : false));
  };

  return {
    checkRole,
    hasAllRoles,
    hasAnyRole,
    isCustomer,
    isProvider,
    isAdmin,
    isSuperUser,
  };
};

export default useRole;
