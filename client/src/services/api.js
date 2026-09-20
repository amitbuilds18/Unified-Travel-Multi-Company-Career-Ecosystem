import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Automatically inject JWT token into all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication APIs
export const authAPI = {
  login: (credentials) => api.post("/api/auth/login", credentials),
  register: (userData) => api.post("/api/auth/register", userData),
  adminLogin: (credentials) => api.post("/api/auth/admin-login", credentials),
  getProfile: () => api.get("/api/auth/profile"),
  updateProfile: (data) => api.put("/api/auth/profile", data),
};

// Company APIs
export const companiesAPI = {
  getAll: (params) => api.get("/api/companies", { params }),
  getByIdOrSlug: (idOrSlug) => api.get(`/api/companies/${idOrSlug}`),
  getMyCompany: () => api.get("/api/companies/my-company"),
  create: (data) => api.post("/api/companies", data),
  update: (id, data) => api.put(`/api/companies/${id}`, data),
  toggleVerify: (id) => api.patch(`/api/companies/${id}/verify`),
};

// Jobs APIs
export const jobsAPI = {
  getAll: (params) => api.get("/api/jobs", { params }),
  getById: (id) => api.get(`/api/jobs/${id}`),
  create: (data) => api.post("/api/jobs", data),
  update: (id, data) => api.put(`/api/jobs/${id}`, data),
  delete: (id) => api.delete(`/api/jobs/${id}`),
};

// Applications APIs (Batch & Single)
export const applicationsAPI = {
  batchApply: (payload) => api.post("/api/applications/batch-apply", payload),
  singleApply: (payload) => api.post("/api/applications/single", payload),
  getMyApplications: () => api.get("/api/applications/my-applications"),
  getCompanyApplications: (companyId, params) =>
    api.get(`/api/applications/company/${companyId}`, { params }),
  updateStatus: (id, statusData) =>
    api.put(`/api/applications/${id}/status`, statusData),
};

// Destinations & Tour Packages APIs
export const destinationsAPI = {
  getAll: (params) => api.get("/api/destinations", { params }),
  getBySlug: (slug) => api.get(`/api/destinations/${slug}`),
  create: (data) => api.post("/api/destinations", data),
  delete: (id) => api.delete(`/api/destinations/${id}`),
  addReview: (destId, reviewData) =>
    api.post(`/api/destinations/${destId}/reviews`, reviewData),
};

// Bookings APIs
export const bookingsAPI = {
  getAll: () => api.get("/api/bookings/all"),
  getMy: () => api.get("/api/bookings/mine"),
};

export default api;
