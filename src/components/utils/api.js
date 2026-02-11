import axios from "axios";

export const getEvents = () =>
  axios.get("https://eventserver-18lb.onrender.com/api/events");

export const createEvent = (data, token) =>
  axios.post("https://eventserver-18lb.onrender.com/api/events", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
