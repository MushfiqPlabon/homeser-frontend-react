import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  requiredRole = null,
  requiredPermission = null,
  redirectTo = "/login",
  unauthorizedRedirect = "/unauthorized",
}) => {
  const { isAuthenticated, loading, hasRole, hasPermission } = useAuth();

  // Show nothing while checking auth status
  if (loading) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role requirement if specified
  if (requiredRole && hasRole && !hasRole(requiredRole)) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }

  // Check permission requirement if specified
  if (
    requiredPermission &&
    hasPermission &&
    !hasPermission(requiredPermission)
  ) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }

  // If all checks pass, render children
  return children;
};

export default ProtectedRoute;
