// src/pages/Events/AllEvents.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/UIdesign/Button";
import "../../styles/Events.css";
import "../../styles/EventCard.css";
import "../../styles/EventsFilter.css";
import {
  getEvents,
  deleteEvent,
  registerForEvent,
} from "../../components/utils/frontendFunctions";

import "../../styles/RegisterEvent.css";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth(); // token needed for admin/user actions
  const navigate = useNavigate();

  // Fetch events from backend
  const fetchEvents = async () => {
    setLoading(true);
    const data = await getEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // User registers for event
  const handleRegister = async (eventId) => {
    if (!token) return alert("You must be logged in!");
    const res = await registerForEvent(eventId, user.id, token);
    if (res.error) return alert(res.error);
    alert("Registered successfully!");
  };

  // Admin deletes event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    const res = await deleteEvent(id, token);
    if (res.error) return alert(res.error);
    alert("Event deleted successfully!");
    fetchEvents(); // refresh list
  };

  if (loading) return <p>Loading events...</p>;
  if (!events.length) return <p>No events available.</p>;

  return (
    <div className="all-events-container">
      {events.map((event) => (
        <div key={event._id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>
            📍 {event.venue} | 📅 {new Date(event.date).toLocaleDateString()} | ⏰ {event.time}
          </p>

          {/* ================== USER BUTTON ================== */}
          {user?.role === "user" && (
            <Button onClick={() => handleRegister(event._id)}>Register</Button>
          )}

          {/* ================== ADMIN BUTTONS ================== */}
          {user?.role === "admin" && (
            <div className="admin-actions flex gap-2 mt-2">
              <Button onClick={() => navigate(`/events/edit/${event._id}`)}>Edit</Button>
              <Button onClick={() => handleDelete(event._id)}>Delete</Button>
              <Button onClick={() => navigate("/events/add")}>Add New</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllEvents;
