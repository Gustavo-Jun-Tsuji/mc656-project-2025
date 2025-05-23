import axios from "axios";
import { ACCESS_TOKEN_NAME } from "./constants";

const caller = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

caller.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_NAME);
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
  getAllRoutes: () => caller.get(`/routes/`),
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
};

export default api;
