import axios from "axios";
import { ACCESS_TOKEN_KEYNAME } from "./constants";

const caller = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

caller.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEYNAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication endpoints:
  login: (credentials) => caller.post("/token/", credentials),
  refreshToken: (refreshToken) => caller.post("/token/refresh/", refreshToken),
  register: (userData) => caller.post("/user/register/", userData),
  getCurrentUser: () => caller.get("/user/current/"),

  // Route endpoints
  getAllRoutes: () => caller.get(`/routes/`),
  getMyRoutes: () => caller.get(`/routes/my_routes/`),
  getRoute: (id) => caller.get(`/routes/${id}/`),
  createRoute: (data) =>
    caller.post(`/routes/`, data, {
      headers: {
        "Content-Type": "multipart/form-data", // Required for file uploads
      },
    }),
  updateRoute: (id, data) => caller.put(`/routes/${id}/`, data),
  deleteRoute: (id) => caller.delete(`/routes/${id}/`),
  searchRoutes: (term) => caller.get(`/routes/?search=${term}`),
  voteRoute: (id, voteType) => caller.post(`/routes/${id}/vote/`, { vote_type: voteType }),
  
};

export default api;
