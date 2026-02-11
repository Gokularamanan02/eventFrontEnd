import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerForEvent, getEventById } from "../../components/utils/frontendFunctions";

import "../../styles/DashboardUI.css";
import "../../styles/EventRegistration.css";

const RegisterEvent = ({ user, token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({ college: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await getEventById(id, token);
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await registerForEvent(id, formData, token);
      alert("Registration submitted!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell registration-page">
        <h2>Register for: {event.title}</h2>
        <p>{event.description}</p>
        <p>
          <strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}
        </p>
        <p>
          <strong>Venue:</strong> {event.venue || "N/A"}
        </p>

        <form className="registration-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="College"
            value={formData.college}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Registering..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterEvent;
