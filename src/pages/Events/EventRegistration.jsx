import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import Button from "../../components/UIdesign/Button";
import "../../styles/AdminRegistration.css";

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await apiFetch(`/events/${id}/register`, {
      method: "POST",
      body: JSON.stringify({ phone, college }),
    });

    alert(res.message || "Registered successfully");
    navigate("/events");
  };

  return (
    <div className="registration-form-container">
      <h2>Event Registration</h2>

      <form onSubmit={handleSubmit} className="registration-form">
        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          placeholder="College Name"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          required
        />

        <Button type="submit">Confirm Registration</Button>
      </form>
    </div>
  );
};

export default EventRegistration;
