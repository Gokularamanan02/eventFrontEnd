import api, { eventsApi, registrationsApi, adminApi } from "../../Services/api";

/* ================= EVENTS ================= */
export const getEvents = async (token, params = {}) => {
  try {
    const data = await eventsApi.getEvents(params);
    return data;
  } catch (err) {
    console.error("Fetch events failed:", err);
    return { error: err.message };
  }
};

export const getEventById = async (eventId) => {
  try {
    const data = await eventsApi.getEventById(eventId);
    return data;
  } catch (err) {
    console.error("Fetch event by ID failed:", err);
    return { error: err.message };
  }
};

export const createEvent = async (eventData) => {
  try {
    const data = await eventsApi.createEvent(eventData);
    return data;
  } catch (err) {
    console.error("Create event failed:", err);
    return { error: err.message };
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const data = await eventsApi.updateEvent(eventId, eventData);
    return data;
  } catch (err) {
    console.error("Update event failed:", err);
    return { error: err.message };
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const data = await eventsApi.deleteEvent(eventId);
    return data;
  } catch (err) {
    console.error("Delete event failed:", err);
    return { error: err.message };
  }
};

/* ================= REGISTRATIONS ================= */
export const registerForEvent = async (eventId, formData) => {
  try {
    const data = await registrationsApi.registerForEvent(eventId, formData);
    return data;
  } catch (err) {
    console.error("Registration failed:", err);
    return { error: err.message };
  }
};

export const getAllRegistrations = async () => {
  try {
    const data = await registrationsApi.getAllRegistrations();
    return data;
  } catch (err) {
    console.error("Fetch all registrations failed:", err);
    return { error: err.message };
  }
};

export const getMyRegistrations = async () => {
  try {
    const data = await registrationsApi.getMyRegistrations();
    return data;
  } catch (err) {
    console.error("Fetch my registrations failed:", err);
    return { error: err.message };
  }
};

export const approveRegistration = async (registrationId) => {
  try {
    const data = await registrationsApi.updateStatus(registrationId, "approved");
    return data;
  } catch (err) {
    console.error("Approve registration failed:", err);
    return { error: err.message };
  }
};

export const rejectRegistration = async (registrationId) => {
  try {
    const data = await registrationsApi.updateStatus(registrationId, "rejected");
    return data;
  } catch (err) {
    console.error("Reject registration failed:", err);
    return { error: err.message };
  }
};

export const updateRegistrationStatus = async (registrationId, status) => {
  try {
    const data = await registrationsApi.updateStatus(registrationId, status);
    return data;
  } catch (err) {
    console.error("Update registration status failed:", err);
    return { error: err.message };
  }
};

export const deleteRegistration = async (registrationId) => {
  try {
    const data = await registrationsApi.deleteRegistration(registrationId);
    return data;
  } catch (err) {
    console.error("Delete registration failed:", err);
    return { error: err.message };
  }
};
