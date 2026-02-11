// src/components/EventsUI/EventCard.jsx
import React, { useState, useEffect } from "react";
import {
  registerForEvent,
  approveRegistration,
  rejectRegistration,
  deleteEvent,
} from "../utils/frontendFunctions";
import { useNavigate } from "react-router-dom";
import "../../styles/EventCard.css";

const EventCard = ({ event: initialEvent, isAdmin = false, onUpdate, user, token }) => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(initialEvent);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    college: "",
    department: "",
    year: "",
    phone: "",
  });

  useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent]);

  const userRegistration = event.registrations?.find(
    (r) => r.user?._id === user?._id
  );

  const handleRegister = async () => {
    if (!token) return alert("Please login");
    if (!formData.college || !formData.department || !formData.year || !formData.phone)
      return alert("All fields are required");

    try {
      setSubmitting(true);
      const res = await registerForEvent(event._id, formData, token);
      if (res?.error) return alert(res.error);

      alert("Registration submitted!");
      setShowModal(false);

      // ✅ Use backend _id for embedded registration
      setEvent((prev) => ({
        ...prev,
        registrations: [
          ...(prev.registrations || []),
          res.registration,
        ],
      }));

      onUpdate && onUpdate();
    } catch (err) {
      console.error(err);
      alert(err.error || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (regId) => {
    try {
      const res = await approveRegistration(regId, token);
      if (res?.error) return alert(res.error);

      setEvent((prev) => ({
        ...prev,
        registrations: prev.registrations.map((r) =>
          r._id === regId ? { ...r, status: "approved" } : r
        ),
      }));
      onUpdate && onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (regId) => {
    try {
      const res = await rejectRegistration(regId, token);
      if (res?.error) return alert(res.error);

      setEvent((prev) => ({
        ...prev,
        registrations: prev.registrations.map((r) =>
          r._id === regId ? { ...r, status: "rejected" } : r
        ),
      }));
      onUpdate && onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Delete this event?")) return;
    try {
      const res = await deleteEvent(event._id, token);
      if (res?.error) return alert(res.error);
      onUpdate && onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditEvent = () => navigate(`/events/edit/${event._id}`);

  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p><b>Date:</b> {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}</p>
      <p><b>Venue:</b> {event.venue || "N/A"}</p>

      <div className="actions">
        {!isAdmin && (
          <>
            {userRegistration ? (
              <span className={`status ${userRegistration.status}`}>{userRegistration.status}</span>
            ) : (
              <button onClick={() => setShowModal(true)}>Register</button>
            )}
          </>
        )}

        {isAdmin && (
          <>
            <button className="btn-edit" onClick={handleEditEvent}>Edit</button>
            <button className="btn-delete" onClick={handleDeleteEvent}>Delete</button>
          </>
        )}
      </div>

      {isAdmin && event.registrations?.length > 0 && (
        <div className="admin-registrations">
          <h4>Registrations</h4>
          {event.registrations.map((reg) => (
            <div key={reg._id} className="registration-row">
              <span>{reg.user?.name || "Unknown"} ({reg.user?.email || "N/A"}) — <b>{reg.status}</b></span>
              {reg.status === "pending" && (
                <div className="reg-actions">
                  <button onClick={() => handleApprove(reg._id)}>Approve</button>
                  <button onClick={() => handleReject(reg._id)}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal">
          <h4>Register for {event.title}</h4>
          <input placeholder="College" value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})} />
          <input placeholder="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
          <input placeholder="Year" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
          <input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <div className="modal-buttons">
            <button onClick={() => setShowModal(false)}>Cancel</button>
            <button onClick={handleRegister} disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
