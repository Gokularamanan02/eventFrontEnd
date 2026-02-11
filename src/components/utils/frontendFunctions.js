import axios from "axios";

const API_BASE = "https://eventserver-18lb.onrender.com/api"; // match backend port

/* ================= EVENTS ================= */
export const getEvents = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Fetch events failed:", err);
    return { error: err.response?.data?.message || err.message };
  }
};

export const getEventById = async (eventId, token) => {
  try {
    const res = await axios.get(`${API_BASE}/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Fetch event by ID failed:", err);
    return { error: err.response?.data?.message || err.message };
  }
};

export const createEvent = async (eventData, token) => {
  try {
    const res = await axios.post(`${API_BASE}/events`, eventData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Create event failed:", err);
    return { error: err.response?.data?.message || err.message };
  }
};

export const updateEvent = async (eventId, eventData, token) => {
  try {
    const res = await axios.put(`${API_BASE}/events/${eventId}`, eventData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Update event failed:", err);
    return { error: err.response?.data?.message || err.message };
  }
};

export const deleteEvent = async (eventId, token) => {
  try {
    const res = await axios.delete(`${API_BASE}/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Delete event failed:", err);
    return { error: err.response?.data?.message || err.message };
  }
};

/* ================= REGISTRATIONS ================= */
export const registerForEvent = async (eventId, formData, token) => {
  try {
    const res = await axios.post(`${API_BASE}/registrations/${eventId}/register`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Registration failed:", err);
    return { error: err.response?.data?.message || err.message };
  }
};

export const getAllRegistrations = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Fetch all registrations failed:", err);
    return { error: err.response?.data?.message || err.message };
  }
};

export const getMyRegistrations = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/registrations/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Fetch my registrations failed:", err);
    return { error: err.response?.data?.message || err.message };
  }
};

// ================= ADMIN: APPROVE / REJECT =================
export const approveRegistration = async (registrationId, token) => {
  try {
    const res = await axios.put(`${API_BASE}/registrations/${registrationId}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Approve registration failed:", err);
    return { error: err.response?.data?.message || err.message };
  }
};

export const rejectRegistration = async (registrationId, token) => {
  try {
    const res = await axios.put(`${API_BASE}/registrations/${registrationId}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Reject registration failed:", err);
    return { error: err.response?.data?.message || err.message };
  }
};

// ================= DELETE REGISTRATION (ADMIN) =================
export const deleteRegistration = async (registrationId, token) => {
  try {
    const res = await axios.delete(`${API_BASE}/registrations/${registrationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Delete registration failed:", err);
    return { error: err.response?.data?.message || err.message };
  }
};

// ================= HELPER =================
export const updateRegistrationStatus = async (registrationId, status, token) => {
  if (status === "approved") return approveRegistration(registrationId, token);
  if (status === "rejected") return rejectRegistration(registrationId, token);
  return { error: "Invalid status" };
};
