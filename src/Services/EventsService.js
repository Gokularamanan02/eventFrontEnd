import { eventsApi } from "./api";

// Get all events (READ - all users)
export const getAllEvents = async (params) => {
  return await eventsApi.getEvents(params);
};

// Get single event by ID (READ)
export const getEventById = async (id) => {
  return await eventsApi.getEventById(id);
};

// Add new event (CREATE - admin)
export const addEvent = async (eventData) => {
  return await eventsApi.createEvent(eventData);
};

// Update event (UPDATE - admin)
export const updateEvent = async (id, eventData) => {
  return await eventsApi.updateEvent(id, eventData);
};

// Delete event (DELETE - admin)
export const deleteEvent = async (id) => {
  return await eventsApi.deleteEvent(id);
};
