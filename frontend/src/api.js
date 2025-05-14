import axios from "axios";

const caller = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const api = {
  getAllRoutes: () => caller.get(`/routes/`),
  getRoute: (id) => caller.get(`/routes/${id}/`),
  createRoute: (data) => caller.post(`/routes/`, data),
  updateRoute: (id, data) => caller.put(`/routes/${id}/`, data),
  deleteRoute: (id) => caller.delete(`/routes/${id}/`),
  searchRoutes: (term) => caller.get(`/routes/?search=${term}`),
};

export default api;
