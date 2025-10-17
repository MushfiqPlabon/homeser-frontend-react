import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api, { authAPI, setTokenRefreshFunction } from "../utils/api";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Ensure the hook is used within its Provider.
  // If not, it indicates a developer error and throws an informative error.
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Store tokens in memory instead of localStorage for better security
  const [authTokens, setAuthTokens] = useState({
    access: null,
    refresh: null,
  });

  const logout = useCallback(() => {
    // Clear tokens from memory
    setAuthTokens({ access: null, refresh: null });
    setUser(null);

    // Make a request to the logout endpoint to clear cookies on the backend
    api
      .post("/auth/logout/", {})
      .catch((error) => {
        // Ignore logout errors as we're clearing tokens anyway
        console.warn("Logout endpoint error:", error);
      })
      .finally(() => {
        // Show success toast regardless of backend response
        showToast("You have been logged out successfully", "info");
      });
  }, [showToast]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      // Get refresh token from memory
      const refreshTokenFromMemory = authTokens.refresh;

      if (!refreshTokenFromMemory) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/auth/token/refresh/", {
        refresh: refreshTokenFromMemory,
      });

      // Handle both standard and custom response formats
      let access, refresh;
      if (response.data.success === false) {
        // This shouldn't happen in a successful refresh, but if it does...
        throw new Error(response.data.error?.message || "Token refresh failed");
      } else if (response.data.access) {
        // Standard SimpleJWT response format
        access = response.data.access;
        refresh = response.data.refresh; // This will be present if refresh token was rotated
      } else {
        // Custom format where the access token is at the top level
        access = response.data.access || response.data.data?.access;
        refresh = response.data.refresh || response.data.data?.refresh;
      }

      // Update tokens in memory
      setAuthTokens((prev) => ({
        ...prev,
        access,
        refresh: refresh || prev.refresh, // Update refresh token only if provided (rotated)
      }));

      return access;
    } catch (error) {
      // If token refresh fails, log out the user
      showToast("Your session has expired. Please log in again.", "warning");
      logout();
      throw error;
    }
  }, [authTokens.refresh, logout, showToast]);

  // Update the api instance with the current access token
  useEffect(() => {
    // Remove the global default authorization header setting
    // Authorization headers are now handled conditionally in the axios interceptor
    // This allows guest users to access public endpoints without forced authentication
  }, []);

  // Set the token refresh function in the api module
  useEffect(() => {
    setTokenRefreshFunction(refreshToken);
  }, [refreshToken]);

  const _fetchUser = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      showToast("Session expired. Please log in again.", "warning");
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout, showToast]);

  useEffect(() => {
    // This effect runs only once when the component mounts (due to empty dependency array []).
    // In the new implementation, we don't check localStorage for tokens as we're using
    // memory-only storage for better security.
    setLoading(false);
  }, []); // Empty dependency array means this effect runs once on mount.

  const login = useCallback(
    async (credentials) => {
      try {
        const response = await authAPI.login(credentials);
        const { access, refresh, user } = response.data;

        // Store tokens in memory
        setAuthTokens({ access, refresh });

        setUser(user);

        // Show success toast
        showToast(
          `Welcome back, ${user.first_name || user.username}!`,
          "success",
        );

        return { success: true };
      } catch (error) {
        // Show error toast
        showToast(error.response?.data?.detail || "Login failed", "error");

        return {
          success: false,
          error: error.response?.data?.detail || "Login failed",
        };
      }
    },
    [showToast],
  );

  const register = useCallback(
    async (userData) => {
      try {
        const response = await authAPI.register(userData);
        const { access, refresh, user } = response.data;

        // Store tokens in memory
        setAuthTokens({ access, refresh });

        setUser(user);

        // Show success toast
        showToast(
          `Welcome to HomeSer, ${user.first_name || user.username}!`,
          "success",
        );

        return { success: true };
      } catch (error) {
        // Show error toast
        showToast(error.response?.data || "Registration failed", "error");

        return {
          success: false,
          error: error.response?.data || "Registration failed",
        };
      }
    },
    [showToast],
  );

  // Check if user has a specific permission
  const hasPermission = useCallback(
    (permission) => {
      if (!user) return false;

      // If permissions are stored in user object
      if (user.permissions && Array.isArray(user.permissions)) {
        return user.permissions.includes(permission);
      }

      // If permissions are stored in a permissions object
      if (user.permissions && typeof user.permissions === "object") {
        return !!user.permissions[permission];
      }

      return false;
    },
    [user],
  );

  // Check if user has a specific role
  const hasRole = useCallback(
    (role) => {
      if (!user) return false;

      // If roles are stored as an array
      if (user.roles && Array.isArray(user.roles)) {
        return user.roles.includes(role);
      }

      // If role is stored as a single value
      if (user.role) {
        return user.role === role;
      }

      // Check user type for role based on backend implementation
      if (role === "admin") {
        return user.is_staff || user.is_superuser;
      }

      if (role === "customer") {
        // In the current backend implementation, all non-staff users are customers
        return !user.is_staff;
      }

      if (role === "provider" || role === "service_provider") {
        // Check if user has service provider permissions
        if (user.permissions && typeof user.permissions === "object") {
          // Check for add_service permission
          if (user.permissions["services.add_service"]) {
            return true;
          }
          // Check for change_service permission (indicates ownership)
          for (const perm in user.permissions) {
            if (perm.startsWith("services.change_service")) {
              return true;
            }
          }
        }
        // We can also check if user has any services
        if (
          user.services &&
          Array.isArray(user.services) &&
          user.services.length > 0
        ) {
          return true;
        }
        // For now, we'll assume non-staff users could be providers (they can request provider status)
        return !user.is_staff;
      }

      return false;
    },
    [user],
  );

  const value = {
    user,
    login,
    register,
    logout,
    refreshToken,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.is_staff || false,
    isCustomer: user && !user.is_staff, // All non-staff users are customers
    isProvider:
      user &&
      !user.is_staff &&
      (user.permissions?.includes("services.add_service") ||
        (user.services && user.services.length > 0)), // Users with provider permissions or services
    isSuperUser: user?.is_superuser || false,
    // Expose tokens for components that need them
    tokens: authTokens,
    // RBAC functions
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
