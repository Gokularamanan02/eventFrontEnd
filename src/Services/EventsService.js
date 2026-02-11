import axios from "axios";
import React from "react";
// Backend base URL
const API_URL = "https://eventserver-18lb.onrender.com/api/events";

// Get all events (READ - all users)
export const getAllEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get single event by ID (READ)
export const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Add new event (CREATE - admin)
export const addEvent = async (eventData, token) => {
  const response = await axios.post(API_URL, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update event (UPDATE - admin)
export const updateEvent = async (id, eventData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete event (DELETE - admin)
export const deleteEvent = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
