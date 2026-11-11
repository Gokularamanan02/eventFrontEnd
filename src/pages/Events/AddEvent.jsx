import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { eventsApi } from "../../Services/api";
import { useAuth } from "../../context/AuthContext";
import {
  FaCalendarPlus,
  FaArrowLeft,
  FaImage,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaTag,
} from "react-icons/fa";

const sampleImages = [
  { label: "Hackathon", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80" },
  { label: "Coding / DSA", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80" },
  { label: "AI Workshop", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80" },
  { label: "Robotics", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80" },
  { label: "Paper / Research", url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80" },
  { label: "Cyber Security", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80" },
];

const AddEditEvent = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technical",
    date: "",
    time: "10:00 AM",
    venue: "Main Campus Auditorium",
    image: "",
    capacity: 100,
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!eventId) return;

    const loadEvent = async () => {
      setLoading(true);
      try {
        const eventData = state?.event || (await eventsApi.getEventById(eventId));
        if (eventData) {
          setForm({
            title: eventData.title || "",
            description: eventData.description || "",
            category: eventData.category || "Technical",
            date: eventData.date ? new Date(eventData.date).toISOString().slice(0, 10) : "",
            time: eventData.time || "10:00 AM",
            venue: eventData.venue || "Main Campus Auditorium",
            image: eventData.image || "",
            capacity: eventData.capacity || 100,
            tags: Array.isArray(eventData.tags) ? eventData.tags.join(", ") : "",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load event data for editing");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim() || !form.date) {
      setError("Title, Description, and Event Date are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity) || 100,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };

      if (eventId) {
        await eventsApi.updateEvent(eventId, payload);
      } else {
        await eventsApi.createEvent(payload);
      }

      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save event. Please check inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 tech-grid-bg">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="text-[10px]" />
          <span>Back</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-1">
              <FaCalendarPlus className="text-[10px]" />
              <span>Admin Event Studio</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              {eventId ? "Edit Symposium Event" : "Create New Symposium Event"}
            </h1>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: FORM INPUTS */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TITLE */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Event Title <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  placeholder="e.g. HackMatrix: 24-Hour AI & Web3 Hackathon"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* CATEGORY & CAPACITY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Coding">Coding</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Paper Presentation">Paper Presentation</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Maximum Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    min="10"
                    max="1000"
                    placeholder="100"
                    value={form.capacity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Event Description <span className="text-pink-400">*</span>
                </label>
                <textarea
                  rows="4"
                  required
                  name="description"
                  placeholder="Describe the format, rounds, rules, eligibility, and cash prizes..."
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* DATE & TIME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Event Date <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Event Time
                  </label>
                  <input
                    type="text"
                    name="time"
                    placeholder="e.g. 10:00 AM - 01:00 PM"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* VENUE */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Venue / Hall Location
                </label>
                <input
                  type="text"
                  name="venue"
                  placeholder="e.g. Mechanical Seminar Hall 2"
                  value={form.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* BANNER IMAGE URL */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://images.unsplash.com/..."
                  value={form.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />

                {/* Quick Presets */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                  <span>Presets:</span>
                  {sampleImages.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, image: s.url }))}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 text-slate-300"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TAGS */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="AI, Web3, Coding, CashPrize"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-modern-primary py-2.5 rounded-xl text-xs font-semibold"
                >
                  {submitting ? "Saving Event..." : eventId ? "Save Changes" : "Publish Event"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: LIVE CARD PREVIEW */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Card Preview
            </span>
            <div className="glass-card overflow-hidden border border-white/15">
              <div className="relative h-44 bg-slate-900">
                <img
                  src={
                    form.image ||
                    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80"
                  }
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1527] to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-md">
                  {form.category || "Technical"}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-white line-clamp-1">
                  {form.title || "Your Event Title Here"}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {form.description || "Event summary and highlights will appear here."}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FaCalendarAlt className="text-indigo-400 text-xs" />
                    <span>{form.date || "Date TBA"}</span>
                    <span>•</span>
                    <FaClock className="text-purple-400 text-xs" />
                    <span>{form.time || "10:00 AM"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <FaMapMarkerAlt className="text-pink-400 text-xs" />
                    <span>{form.venue || "Campus Auditorium"}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-center text-xs font-medium text-slate-400">
                    Registration Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditEvent;
