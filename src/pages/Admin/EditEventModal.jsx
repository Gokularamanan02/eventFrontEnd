import React, { useState } from "react";
import { updateEvent } from "../../utils/frontendFunctions";

const EditEventModal = ({ event, onClose, onSave }) => {
  const [form, setForm] = useState(event);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    updateEvent(event.id, form);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Edit Event</h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          name="venue"
          value={form.venue}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-400 text-white">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-3 py-1 bg-blue-600 text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
