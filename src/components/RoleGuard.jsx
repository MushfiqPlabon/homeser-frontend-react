import { useAuth } from "../context/AuthContext";

const RoleGuard = ({ role, children, fallback = null }) => {
  const { hasRole, isAuthenticated } = useAuth();

  // If user is not authenticated, don't render children
  if (!isAuthenticated) {
    return fallback;
  }

  // Check role
  if (role && hasRole && hasRole(role)) {
    return children;
  }

  return fallback;
};

export default RoleGuard;
