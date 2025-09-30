import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api, { authAPI, setTokenRefreshFunction } from "../utils/api";

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

  // Store tokens in memory instead of localStorage for better security
  const [authTokens, setAuthTokens] = useState({
    access: null,
    refresh: null,
  });

  const logout = useCallback(() => {
    // Clear tokens from memory
    setAuthTokens({ access: null, refresh: null });
    setUser(null);

    // Also remove from localStorage as a fallback
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      // Get refresh token from memory or localStorage
      const refreshTokenFromStorage = authTokens.refresh || 
        (typeof localStorage !== 'undefined' ? localStorage.getItem("refresh_token") : null);
      
      if (!refreshTokenFromStorage) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/auth/token/refresh/", {
        refresh: refreshTokenFromStorage,
      });

      const { access } = response.data;

      // Update access token in memory
      setAuthTokens((prev) => ({ ...prev, access }));

      // Also update in localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem("access_token", access);
      }

      return access;
    } catch (error) {
      // If token refresh fails, log out the user
      logout();
      throw error;
    }
  }, [authTokens.refresh, logout]);

  // Update the api instance with the current access token
  useEffect(() => {
    // Remove the global default authorization header setting
    // Authorization headers are now handled conditionally in the axios interceptor
    // This allows guest users to access public endpoints without forced authentication
  }, [authTokens.access]);

  // Set the token refresh function in the api module
  useEffect(() => {
    setTokenRefreshFunction(refreshToken);
  }, [refreshToken]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    // This effect runs only once when the component mounts (due to empty dependency array []).
    // It checks for an existing access token in localStorage (for backward compatibility)
    // and attempts to fetch user data if a token is found.
    const accessToken = localStorage.getItem("access_token");
    const refreshTokenFromStorage = localStorage.getItem("refresh_token");

    if (accessToken && refreshTokenFromStorage) {
      // Set tokens in memory
      setAuthTokens({ access: accessToken, refresh: refreshTokenFromStorage });
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]); // Empty dependency array means this effect runs once on mount.

  const login = useCallback(async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access, refresh, user } = response.data;

      // Store tokens in memory
      setAuthTokens({ access, refresh });

      // Also store in localStorage for persistence across page refreshes
      // Note: This is a compromise for UX, but we should consider more secure alternatives
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { access, refresh, user } = response.data;

      // Store tokens in memory
      setAuthTokens({ access, refresh });

      // Also store in localStorage for persistence across page refreshes
      // Note: This is a compromise for UX, but we should consider more secure alternatives
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || "Registration failed",
      };
    }
  }, []);

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

      if (role === "provider") {
        // In the current backend implementation, service providers are also non-staff users
        // but they have services. We'll check if they have the add_service permission
        if (user.permissions && Array.isArray(user.permissions)) {
          return user.permissions.includes("services.add_service");
        }
        // For now, we'll assume non-staff users could be providers
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
    isProvider: user && !user.is_staff, // All non-staff users could be providers
    isSuperUser: user?.is_superuser || false,
    // Expose tokens for components that need them
    tokens: authTokens,
    // RBAC functions
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
