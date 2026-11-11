import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import EventCard from "../../components/EventsUI/EventCard";
import { eventsApi } from "../../Services/api";
import {
  FaSearch,
  FaFilter,
  FaCalendarPlus,
  FaTimes,
  FaLayerGroup,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

const categories = [
  "All",
  "Hackathon",
  "Coding",
  "Robotics",
  "Workshop",
  "Paper Presentation",
  "Technical",
];

const EventsList = ({ user, token, isAdmin }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const activeCategory = searchParams.get("category") || "All";
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("date-asc");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventsApi.getEvents();
      if (Array.isArray(data)) {
        setEvents(data);
      } else if (data && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter & sort logic
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Category filter
    if (activeCategory && activeCategory !== "All") {
      result = result.filter(
        (e) => (e.category || "").toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      if (sortBy === "date-desc") {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

    return result;
  }, [events, activeCategory, searchQuery, sortBy]);

  const handleCategoryChange = (cat) => {
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.trim()) {
      searchParams.set("search", val);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 tech-grid-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <FaLayerGroup className="text-[10px]" />
              <span>Symposium 2026 Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore All Events
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Register for hackathons, paper presentations, speed debugging, robotics
              arenas, and workshops. Limited seats per venue.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => navigate("/events/add")}
              className="btn-modern-primary text-sm py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-indigo-500/25 shrink-0"
            >
              <FaCalendarPlus />
              <span>Create New Event</span>
            </button>
          )}
        </div>

        {/* SEARCH, CATEGORY PILLS & SORT CONTROLS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search events by title, keyword, or venue..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="sm:w-56 shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="date-asc">Date: Soonest First</option>
                <option value="date-desc">Date: Latest First</option>
                <option value="title">Title: Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const selected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400"
                      : "bg-slate-900/70 border border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESULTS BAR */}
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredEvents.length}</strong> {filteredEvents.length === 1 ? "event" : "events"}
          </span>
          {(activeCategory !== "All" || searchQuery) && (
            <button
              onClick={() => {
                handleCategoryChange("All");
                handleSearchChange("");
              }}
              className="text-indigo-400 hover:text-indigo-300 font-medium underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* EVENTS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card p-6 h-96 animate-pulse bg-slate-900/40" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard
                key={evt._id}
                event={evt}
                user={user}
                token={token}
                isAdmin={isAdmin}
                onUpdate={fetchEvents}
                onViewDetails={(item) => setSelectedEvent(item)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-16 text-center max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mx-auto text-slate-400">
              <FaFilter />
            </div>
            <h3 className="text-lg font-bold text-white">No Matching Events Found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search keywords or switching category filters.
            </p>
            <button
              onClick={() => {
                handleCategoryChange("All");
                handleSearchChange("");
              }}
              className="btn-modern-secondary text-xs py-2 px-4 rounded-xl"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* QUICK VIEW DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative max-h-[90vh] flex flex-col">
            {/* Modal Cover Image */}
            <div className="relative h-56 bg-slate-900 shrink-0">
              <img
                src={
                  selectedEvent.image ||
                  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80"
                }
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-black/40 to-black/20" />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                ✕
              </button>
              <span className="absolute bottom-4 left-6 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md">
                {selectedEvent.category || "Technical"}
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedEvent.title}</h2>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300">
                <div className="space-y-1">
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <FaCalendarAlt className="text-indigo-400" />
                    <span>Date</span>
                  </div>
                  <div className="font-semibold text-white">
                    {selectedEvent.date
                      ? new Date(selectedEvent.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBA"}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <FaClock className="text-purple-400" />
                    <span>Timing</span>
                  </div>
                  <div className="font-semibold text-white">{selectedEvent.time || "10:00 AM"}</div>
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-pink-400" />
                    <span>Venue</span>
                  </div>
                  <div className="font-semibold text-white truncate">
                    {selectedEvent.venue || "Main Campus Auditorium"}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Event Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-white/10 text-indigo-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = selectedEvent._id;
                    setSelectedEvent(null);
                    navigate(`/events/${id}/register`);
                  }}
                  className="flex-1 btn-modern-primary py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>Proceed to Register</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsList;
