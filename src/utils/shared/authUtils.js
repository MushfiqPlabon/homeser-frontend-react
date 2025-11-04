// authUtils.js - Shared utility functions for authentication and token handling

// Token storage key
const TOKEN_STORAGE_KEY = "homeser_auth_tokens";

// Get tokens from localStorage
export const getStoredTokens = () => {
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { access: null, refresh: null };
  } catch (error) {
    console.warn("Failed to parse stored tokens:", error);
    return { access: null, refresh: null };
  }
};

// Save tokens to localStorage
export const setStoredTokens = (tokens) => {
  try {
    if (tokens?.access || tokens?.refresh) {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Failed to store tokens:", error);
  }
};

// Remove tokens from localStorage
export const removeStoredTokens = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to remove tokens:", error);
  }
};

// Decode JWT token to get its payload
export const decodeToken = (token) => {
  try {
    if (!token) return null;

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;

    // Split token to get payload
    const parts = cleanToken.split(".");
    if (parts.length !== 3) {
      console.warn("Invalid token format");
      return null;
    }

    // Decode payload (add proper padding if needed)
    let payload = parts[1];
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    switch (payload.length % 4) {
      case 0:
        break;
      case 2:
        payload += "==";
        break;
      case 3:
        payload += "=";
        break;
      default:
        throw new Error("Invalid token");
    }

    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.warn("Failed to decode token:", error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true; // Consider invalid tokens as expired
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

// Check if access token needs refresh (will expire within 5 minutes)
export const needsTokenRefresh = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true; // Consider invalid tokens as needing refresh
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const refreshThreshold = 5 * 60; // 5 minutes in seconds
  return payload.exp - currentTime < refreshThreshold;
};

// Proactively refresh token if needed
export const refreshIfNeeded = async (_api) => {
  const tokens = getStoredTokens();
  if (!tokens.access || !tokens.refresh) {
    return false; // No tokens to refresh
  }

  if (!needsTokenRefresh(tokens.access)) {
    return true; // Token is still valid
  }

  // Use a simple fetch to refresh the token
  try {
    const refreshResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/auth/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: tokens.refresh }),
      },
    );

    if (refreshResponse.ok) {
      const newTokens = await refreshResponse.json();
      setStoredTokens({
        access: newTokens.access,
        refresh: newTokens.refresh || tokens.refresh,
      });
      return true;
    } else {
      // Refresh failed, remove tokens
      removeStoredTokens();
      return false;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};
