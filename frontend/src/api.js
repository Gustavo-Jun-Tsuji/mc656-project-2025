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
  getAllRoutes: (page = 1) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    return caller.get(`/routes/?${params.toString()}`);
  },

  getMyRoutes: (page = 1, search = "", orderBy = "") => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (search) params.append("search", search);
    if (orderBy) params.append("order_by", orderBy);
    return caller.get(`/routes/my_routes/?${params.toString()}`);
  },

  getLikedRoutes: (page = 1, search = "", orderBy = "") => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (search) params.append("search", search);
    if (orderBy) params.append("order_by", orderBy);
    return caller.get(`/routes/my_liked_routes/?${params.toString()}`);
  },

  getRoute: (id) => caller.get(`/routes/${id}/`),
  createRoute: (data) =>
    caller.post(`/routes/`, data, {
      headers: {
        "Content-Type": "multipart/form-data", // Required for file uploads
      },
    }),
  updateRoute: (id, data) => caller.put(`/routes/${id}/`, data),
  deleteRoute: (id) => caller.delete(`/routes/${id}/`),
  searchRoutes: (page = 1, search = "", orderBy = "") => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (search) params.append("search", search);
    if (orderBy) params.append("order_by", orderBy);
    return caller.get(`/routes/?${params.toString()}`);
  },
  voteRoute: (id, voteType) =>
    caller.post(`/routes/${id}/vote/`, { vote_type: voteType }),

  getRouteHistory: () => caller.get(`/user-details/route_history/`),

  addToHistory: (routeId) => caller.post(`/routes/${routeId}/add_to_history/`),

  clearHistory: () => caller.delete("/user-details/clear_history/"),
};

export default api;
