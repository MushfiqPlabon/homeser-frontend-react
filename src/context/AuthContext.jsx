import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authAPI } from "../utils/api";

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

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

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
    // It checks for an existing access token in local storage to determine if a user session
    // might already be active, and attempts to fetch user data if a token is found.
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]); // Empty dependency array means this effect runs once on mount.

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access, refresh, user } = response.data;

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
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { access, refresh, user } = response.data;

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
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.is_staff || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
