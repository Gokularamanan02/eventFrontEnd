import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/EventDetails.css";

const EventDetailsCard = () => {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://eventserver-18lb.onrender.com/events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
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
      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="events-container">
      {events.map((event) => (
        <div key={event._id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>

          {user?.role === "admin" && (
            <div className="admin-actions">
              <button onClick={() => navigate(`/events/edit/${event._id}`)}>Edit</button>
              <button onClick={() => handleDelete(event._id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventDetailsCard;
