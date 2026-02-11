// src/pages/Events.jsx
import React, { useEffect, useState, useMemo } from "react";
import EventCard from "../components/EventsUI/EventCard";
import { useAuth } from "../context/AuthContext";
import "../styles/Events.css";
import "../styles/EventFilter.css";
import "../styles/EventCard.css";
import "../styles/Pagination.css";
import "../styles/Mainpage.css";

import { getEvents, registerForEvent, deleteEvent, updateEvent } from "../utils/frontendFunctions";

const EVENTS_PER_PAGE = 6;

const Events = () => {
  const { user, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortType, setSortType] = useState("date");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [editingEvent, setEditingEvent] = useState(null);
  const [editData, setEditData] = useState({ title: "", date: "", venue: "", category: "" });

  const isAdmin = user?.role === "admin";

  // Load events from backend
  const loadEvents = async () => {
    setLoading(true);
    const data = await getEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Filter & sort
  const processedEvents = useMemo(() => {
    let filtered = [...events];

    if (search) filtered = filtered.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
    if (category) filtered = filtered.filter((e) => e.category === category);

    filtered.sort((a, b) =>
      sortType === "title" ? a.title.localeCompare(b.title) : new Date(a.date) - new Date(b.date)
    );

    return filtered;
  }, [events, search, category, sortType]);

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * EVENTS_PER_PAGE;
    return processedEvents.slice(start, start + EVENTS_PER_PAGE);
  }, [processedEvents, page]);

  const totalPages = Math.ceil(processedEvents.length / EVENTS_PER_PAGE);

  // Register user for event
  const handleRegister = async (eventId) => {
    const res = await registerForEvent(eventId, user.id, token);
    if (res.error) return alert(res.error);
    alert("Registered successfully!");
  };

  // Admin actions
  const handleAdminAction = (type, event) => {
    if (!isAdmin) return;

    if (type === "delete") {
      if (window.confirm("Are you sure you want to delete this event?")) {
        deleteEvent(event._id, token).then((res) => {
          if (res.error) return alert(res.error);
          alert("Event deleted!");
          loadEvents();
        });
      }
    }

    if (type === "edit") {
      setEditingEvent(event);
      setEditData({
        title: event.title || "",
        date: event.date ? new Date(event.date).toISOString().slice(0, 10) : "",
        venue: event.venue || "",
        category: event.category || "",
      });
    }
  };

  const handleSaveEdit = async () => {
    const res = await updateEvent(editingEvent._id, editData, token);
    if (res.error) return alert(res.error);
    alert("Event updated successfully!");
    setEditingEvent(null);
    loadEvents();
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="border p-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="Workshop">Workshop</option>
          <option value="General">General</option>
        </select>
        <select className="border p-2 rounded" value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {/* Event grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paginatedEvents.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onRegister={() => handleRegister(event._id)}
            onAdminAction={(type) => handleAdminAction(type, event)}
            isAdmin={isAdmin}
            onRefresh={loadEvents}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Edit modal */}
      {editingEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Event</h2>
            <input
              type="text"
              placeholder="Title"
              className="border p-2 rounded w-full mb-2"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
            <input
              type="date"
              className="border p-2 rounded w-full mb-2"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            />
            <input
              type="text"
              placeholder="Venue"
              className="border p-2 rounded w-full mb-2"
              value={editData.venue}
              onChange={(e) => setEditData({ ...editData, venue: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              className="border p-2 rounded w-full mb-4"
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded bg-gray-300" onClick={() => setEditingEvent(null)}>Cancel</button>
              <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
