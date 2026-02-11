// src/components/EventsUI/RegistrationForm.jsx
import React, { useState } from "react";
import "../../styles/EventRegistration.css";

const RegistrationForm = ({ event, token, onClose, onRegistered }) => {
  const [formData, setFormData] = useState({ college: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in");

    setLoading(true);
    try {
      const res = await fetch(
        `https://eventserver-18lb.onrender.com/api/events/${event._id}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Registration failed");

      alert("Registration submitted successfully!");
      onRegistered && onRegistered(); // refresh events
      onClose();
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-modal">
      <div className="registration-modal-content">
        <h3>Register for: {event.title}</h3>
        <form onSubmit={handleSubmit}>
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
          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Submit"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
