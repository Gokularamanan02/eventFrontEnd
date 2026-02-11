// src/pages/Events/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/EventDetails.css";
import "../../styles/Event.css";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch event details
  const fetchEvent = async () => {
    try {
      const res = await fetch(`https://eventserver-18lb.onrender.com/events/${id}`);
      if (!res.ok) throw new Error("Failed to fetch event");
      const data = await res.json();
      setEvent(user?.role === "admin" ? data : data.event || data); // handle different API responses
    } catch (err) {
      console.error(err);
      alert("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  // Admin: Delete Event
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`https://eventserver-18lb.onrender.com/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      alert("Event deleted successfully");
      navigate("/events"); // redirect to all events
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <div className="event-details-container">
      <div className="event-info">
        <h1 className="event-title">{event.name}</h1>
        <p className="event-description">{event.description}</p>

        <div className="event-meta">
          <p><strong>📍 Venue:</strong> {event.venue}</p>
          <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>⏰ Time:</strong> {event.time}</p>
        </div>

        {/* Admin CRUD Buttons */}
        {user?.role === "admin" && (
          <div className="admin-actions" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button onClick={() => navigate(`/events/edit/${id}`)}>Edit Event</button>
            <button onClick={handleDelete}>Delete Event</button>
            <button onClick={() => navigate("/events/add")}>Add New Event</button>
          </div>
        )}

        {/* User Registration */}
        {user?.role === "user" && (
          <div className="registration-card" style={{ marginTop: "20px" }}>
            <button
              onClick={() => navigate(`/events/${id}/register`, { state: { event } })}
            >
              Register Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
