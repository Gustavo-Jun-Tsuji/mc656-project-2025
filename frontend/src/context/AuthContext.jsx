import { createContext, useState, useEffect, useContext } from "react";
import api from "../api";
import { ACCESS_TOKEN_KEYNAME, REFRESH_TOKEN_KEYNAME } from "../constants";
import { jwtDecode } from "jwt-decode"; // Install with: npm install jwt-decode

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for token and user data on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEYNAME);

      if (token) {
        try {
          // Decode token to get user info
          const decoded = jwtDecode(token);

          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem(ACCESS_TOKEN_KEYNAME);
            setUser(null);
          } else {
            // Set user from token payload
            setUser({
              id: decoded.user_id,
              username: decoded.username,
            });
          }
        } catch (err) {
          console.error("Token validation failed:", err);
          localStorage.removeItem(ACCESS_TOKEN_KEYNAME);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await api.login({ username, password });
      const { access, refresh } = response.data;

      // Store tokens
      localStorage.setItem(ACCESS_TOKEN_KEYNAME, access);
      localStorage.setItem(REFRESH_TOKEN_KEYNAME, refresh);

      // Decode token to get user data
      const decoded = jwtDecode(access);
      setUser({
        id: decoded.user_id,
        username: decoded.username,
      });

      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
      return false;
    }
  };

  const register = async (userData) => {
    console.log("Registering user:", userData);

    try {
      setError(null);
      await api.register(userData);
      return true;
    } catch (err) {
      setError(
        Object.values(err.response?.data || {})
          .flat()
          .join(" ") || "Registration failed"
      );
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEYNAME);
    localStorage.removeItem(REFRESH_TOKEN_KEYNAME);
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
