import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// ✅ Correct imports matching frontendFunctions.js
import {
  createEvent,
  updateEvent,
  getEventById
} from "../../components/utils/frontendFunctions";

import { useAuth } from "../../context/AuthContext";

import "../../styles/EventForm.css";

const AddEditEvent = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams();
  const { state } = useLocation();
  const { token, user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== "admin") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (!eventId) return;

    const loadEvent = async () => {
      setLoading(true);
      try {
        // Load event either from state or backend
        const eventData = state?.event || (await getEventById(eventId, token));
        if (eventData.error) throw new Error(eventData.error);

        setForm({
          title: eventData.title || "",
          description: eventData.description || "",
          date: eventData.date?.slice(0, 10) || "",
          time: eventData.time || "",
          venue: eventData.venue || "",
          image: eventData.image || "",
        });
      } catch (err) {
        alert("Failed to load event");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, state, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (eventId) await updateEvent(eventId, form, token);
      else await createEvent(form, token);

      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Event save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-page">
      <h2>{eventId ? "Edit Event" : "Add Event"}</h2>
      <form className="event-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
        />
        <input
          name="venue"
          placeholder="Venue"
          value={form.venue}
          onChange={handleChange}
        />
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : eventId ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEditEvent;
