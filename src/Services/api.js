import axios from "axios";

// Configurable base URL: uses VITE_API_BASE_URL env var if set, otherwise smart detects local vs deployed backend
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:3000/api"
    : "https://eventserver-18lb.onrender.com/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: automatically attaches JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: normalizes error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

/* ================= AUTH API ================= */
export const authApi = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },
  signup: async (name, email, password, role = "user") => {
    const res = await api.post("/auth/signup", { name, email, password, role });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};

/* ================= EVENTS API ================= */
export const eventsApi = {
  getEvents: async (params = {}) => {
    const res = await api.get("/events", { params });
    return res.data;
  },
  getEventById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data;
  },
  createEvent: async (eventData) => {
    const res = await api.post("/events", eventData);
    return res.data;
  },
  updateEvent: async (id, eventData) => {
    const res = await api.put(`/events/${id}`, eventData);
    return res.data;
  },
  deleteEvent: async (id) => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },
};

/* ================= REGISTRATIONS API ================= */
export const registrationsApi = {
  registerForEvent: async (eventId, data) => {
    const res = await api.post(`/registrations/${eventId}/register`, data);
    return res.data;
  },
  getMyRegistrations: async () => {
    const res = await api.get("/registrations/me");
    return res.data;
  },
  getAllRegistrations: async () => {
    const res = await api.get("/registrations");
    return res.data;
  },
  updateStatus: async (registrationId, status) => {
    const res = await api.put(`/registrations/${registrationId}/status`, { status });
    return res.data;
  },
  deleteRegistration: async (registrationId) => {
    const res = await api.delete(`/registrations/${registrationId}`);
    return res.data;
  },
};

/* ================= ADMIN API ================= */
export const adminApi = {
  getStats: async () => {
    const res = await api.get("/admin/stats");
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get("/admin/users");
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
};

export default api;
