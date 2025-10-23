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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Token storage utilities for persistence across browser refresh
const TOKEN_STORAGE_KEY = "homeser_auth_tokens";

const getStoredTokens = () => {
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { access: null, refresh: null };
  } catch (error) {
    console.warn("Failed to parse stored tokens:", error);
    return { access: null, refresh: null };
  }
};

const setStoredTokens = (tokens) => {
  try {
    if (tokens.access || tokens.refresh) {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Failed to store tokens:", error);
  }
};

const clearStoredTokens = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear stored tokens:", error);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Initialize tokens from localStorage to persist across refresh
  const [authTokens, setAuthTokens] = useState(() => getStoredTokens());

  // Computed auth state
  const isAuthenticated = Boolean(authTokens.access && user);

  const logout = () => {
    api
      .post("/auth/logout/", {})
      .catch((error) => {
        console.warn("Logout endpoint error:", error);
      })
      .finally(() => {
        setAuthTokens({ access: null, refresh: null });
        clearStoredTokens();
        setUser(null);
        showToast("You have been logged out successfully", "info");
      });
  };

  const refreshToken = useCallback(async () => {
    try {
      const tokens = getStoredTokens();
      if (!tokens.refresh) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/auth/token/refresh/", {
        refresh: tokens.refresh,
      });

      const { access, refresh } = response.data;
      if (!access) {
        throw new Error("No access token in refresh response");
      }

      const newTokens = { access, refresh: refresh || tokens.refresh };
      setAuthTokens(newTokens);
      setStoredTokens(newTokens);

      return access;
    } catch (error) {
      console.error("Token refresh failed:", error);
      setAuthTokens({ access: null, refresh: null });
      clearStoredTokens();
      setUser(null);
      throw error;
    }
  }, []);

  // Set the token refresh function in the api module
  useEffect(() => {
    setTokenRefreshFunction(refreshToken);
  }, [refreshToken]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const tokens = getStoredTokens();
      if (tokens.access) {
        try {
          const response = await authAPI.getProfile();
          console.log("User object from API:", response.data?.user);
          setUser(response.data?.user || null);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          // Clear invalid tokens
          setAuthTokens({ access: null, refresh: null });
          clearStoredTokens();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []); // Run only once on mount

  // Sync tokens to localStorage whenever they change
  useEffect(() => {
    setStoredTokens(authTokens);
  }, [authTokens]);

  const login = useCallback(
    async (credentials) => {
      try {
        const response = await authAPI.login(credentials);
        const { access, refresh, user } = response.data;

        // Store tokens in memory and localStorage
        const newTokens = { access, refresh };
        setAuthTokens(newTokens);
        setStoredTokens(newTokens);
        setUser(user);

        showToast(
          `Welcome back, ${user.first_name || user.username}!`,
          "success",
        );

        return { success: true };
      } catch (error) {
        showToast(error.response?.data?.detail || "Login failed", "error");
        return { success: false, error: error.response?.data };
      }
    },
    [showToast],
  );

  const register = useCallback(
    async (userData) => {
      try {
        const response = await authAPI.register(userData);
        showToast("Registration successful! Please log in.", "success");
        return { success: true, data: response.data };
      } catch (error) {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Registration failed";
        showToast(errorMessage, "error");
        return { success: false, error: error.response?.data };
      }
    },
    [showToast],
  );

  const hasRole = (role) => {
    return user?.roles?.includes(role);
  };

  const isAdmin = hasRole("admin");

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    authTokens,
    refreshToken,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
