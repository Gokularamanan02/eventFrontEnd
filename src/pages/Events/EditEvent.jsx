import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../components/utils/api";
import Button from "../../components/UIdesign/Button";
import "../../styles/EventForm.css";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", venue: "", date: "", time: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await apiFetch(`/events/${id}`);
        setForm({ name: data.name, description: data.description, venue: data.venue, date: data.date.split("T")[0], time: data.time });
      } catch (err) {
        console.error(err);
        alert("Failed to load event");
      } finally { setLoading(false); }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/events/${id}`, { method: "PUT", body: JSON.stringify(form) });
      alert("Event updated!");
      navigate("/events");
    } catch (err) {
      console.error(err);
      alert("Failed to update event");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Event</h2>
      <input name="name" value={form.name} onChange={handleChange} required />
      <input name="description" value={form.description} onChange={handleChange} required />
      <input name="venue" value={form.venue} onChange={handleChange} required />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input type="time" name="time" value={form.time} onChange={handleChange} required />
      <Button type="submit">Update Event</Button>
    </form>
  );
};

export default EditEvent;
