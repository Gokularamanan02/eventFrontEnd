import axios from "axios";

const API = "https://eventserver-18lb.onrender.com/api/events";

export const getEvents = () => axios.get(API);

export const createEvent = (data, token) =>
  axios.post(API, data, { headers: { Authorization: `Bearer ${token}` } });

export const updateEvent = (id, data, token) =>
  axios.put(`${API}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteEvent = (id, token) =>
  axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const registerEvent = (id, token) =>
  axios.post(`${API}/${id}/register`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const getRegistrations = (id, token) =>
  axios.get(`${API}/${id}/registrations`, { headers: { Authorization: `Bearer ${token}` } });
