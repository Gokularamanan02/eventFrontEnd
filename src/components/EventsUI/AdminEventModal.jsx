import React, { useState, useEffect } from "react";
import { createEvent, updateEvent } from "../../utils/frontendFunctions";
import { useAuth } from "../../context/AuthContext";
import "../../styles/EventModal.css";

const AdminEventModal = ({ isOpen, onClose, eventToEdit, onSave }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tech");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || "");
      setCategory(eventToEdit.category || "Tech");
      setDescription(eventToEdit.description || "");
      setDate(eventToEdit.date ? eventToEdit.date.split("T")[0] : "");
    } else {
      setTitle("");
      setCategory("Tech");
      setDescription("");
      setDate("");
    }
  }, [eventToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = { title, category, description, date };

    let res;
    if (eventToEdit) {
      res = await updateEvent(eventToEdit._id, eventData, token);
    } else {
      res = await createEvent(eventData, token);
    }

    if (res.error) {
      alert(res.error);
    } else {
      alert("Event saved successfully!");
      onSave(); // reload events in parent
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {eventToEdit ? "Edit Event" : "Create Event"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Tech">Tech</option>
            <option value="Workshop">Workshop</option>
            <option value="General">General</option>
          </select>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded"
            rows={3}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-3 py-1 rounded bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEventModal;
