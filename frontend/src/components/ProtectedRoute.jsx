import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN_KEYNAME, REFRESH_TOKEN_KEYNAME } from "../constants";
import { use, useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const [isAuthorized, setAuthorized] = useState(false);

  useEffect(() => {
    auth().catch(() => {
      setAuthorized(false);
    });
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEYNAME);

    try {
      const response = await api.refreshToken(refreshToken);

      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN_KEYNAME, response.data.access);
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEYNAME);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decodedToken = jwtDecode(token);
    const tokenExpiration = decodedToken.exp;
    const currentTime = Date.now() / 1000;

    if (tokenExpiration < currentTime) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
