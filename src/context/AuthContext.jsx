import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useGetProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "../store/extendedApiSlice";
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

  // RTK Query mutations and queries
  const [loginApi] = useLoginMutation();
  const [registerApi] = useRegisterMutation();
  const [logoutApi] = useLogoutMutation();

  // Computed auth state
  const isAuthenticated = Boolean(authTokens.access && user);

  // Use the profile query to get user data
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery(
    undefined,
    {
      skip: !authTokens.access, // Only run if we have an access token
    },
  );

  const logout = useCallback(async () => {
    try {
      // Call the logout mutation
      await logoutApi();
    } catch (error) {
      console.warn("Logout endpoint error:", error);
    } finally {
      // Always clear local state
      setAuthTokens({ access: null, refresh: null });
      clearStoredTokens();
      setUser(null);
      showToast("You have been logged out successfully", "info");
    }
  }, [logoutApi, showToast]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const tokens = getStoredTokens();
      if (tokens.access) {
        try {
          // User will be set via the useGetProfileQuery hook
          setUser(profileData?.user || null);
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
  }, [profileData]); // Run when profile data changes

  // Sync tokens to localStorage whenever they change
  useEffect(() => {
    setStoredTokens(authTokens);
  }, [authTokens]);

  // Update user when profile data changes
  useEffect(() => {
    if (profileData?.user) {
      setUser(profileData.user);
    }
  }, [profileData]);

  const login = useCallback(
    async (credentials) => {
      try {
        const response = await loginApi(credentials).unwrap();
        const { access, refresh, user } = response;

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
        const errorMessage =
          error?.data?.detail || error?.data?.message || "Login failed";
        showToast(errorMessage, "error");
        return { success: false, error: error?.data };
      }
    },
    [loginApi, showToast],
  );

  const register = useCallback(
    async (userData) => {
      try {
        const response = await registerApi(userData).unwrap();
        const { access, refresh, user } = response;

        // Store tokens in memory and localStorage
        const newTokens = { access, refresh };
        setAuthTokens(newTokens);
        setStoredTokens(newTokens);
        setUser(user);

        showToast(
          `Registration successful! Welcome, ${user.first_name || user.username}!`,
          "success",
        );

        return { success: true, data: response };
      } catch (error) {
        const errorMessage =
          error?.data?.detail || error?.data?.message || "Registration failed";
        showToast(errorMessage, "error");
        return { success: false, error: error?.data };
      }
    },
    [registerApi, showToast],
  );

  const hasRole = (role) => {
    return user?.roles?.includes(role);
  };

  const isAdmin = hasRole("admin");

  const value = {
    user,
    isAuthenticated,
    loading: loading || profileLoading,
    login,
    logout,
    register,
    authTokens,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
