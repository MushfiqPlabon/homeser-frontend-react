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

  // Show loading state while checking auth status instead of returning null
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
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
