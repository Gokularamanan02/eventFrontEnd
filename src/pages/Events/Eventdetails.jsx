// src/pages/Events/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { eventsApi } from "../../Services/api";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaArrowLeft,
  FaTicketAlt,
  FaEdit,
  FaTrash,
  FaShieldAlt,
  FaShareAlt,
} from "react-icons/fa";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getEventById(id);
      setEvent(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await eventsApi.deleteEvent(id);
      alert("Event deleted successfully");
      navigate("/events");
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Check out ${event?.title} at Nexus Symposium 2026!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event || error) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Event Not Found</h2>
          <p className="text-xs text-slate-400">The event could not be found or has ended.</p>
          <Link to="/events" className="btn-modern-primary text-xs py-2 px-4 rounded-xl inline-block">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const registeredCount = event.registrations?.length || 0;
  const capacity = event.capacity || 100;
  const isFull = registeredCount >= capacity;
  const isRegistered = event.registrations?.some((r) => {
    const regUser = r.user?._id || r.user;
    const currentUserId = user?._id || user?.id;
    return regUser && currentUserId && regUser.toString() === currentUserId.toString();
  });

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 tech-grid-bg">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* TOP BACK & SHARE */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/events")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <FaArrowLeft className="text-[10px]" />
            <span>All Events</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs flex items-center gap-1.5 transition-colors"
          >
            <FaShareAlt />
            <span>Share</span>
          </button>
        </div>

        {/* HERO BANNER */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 relative">
          <div className="relative h-72 sm:h-96 bg-slate-900">
            <img
              src={
                event.image ||
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80"
              }
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-lg inline-block">
                  {event.category || "Technical"}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  {event.title}
                </h1>
              </div>

              {user?.role === "admin" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/events/edit/${event._id}`, { state: { event } })}
                    className="p-2.5 rounded-xl bg-slate-900/90 text-white hover:text-indigo-400 border border-white/10"
                    title="Edit Event"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2.5 rounded-xl bg-slate-900/90 text-rose-400 hover:bg-rose-500/20 border border-white/10"
                    title="Delete Event"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* META BAR */}
          <div className="p-6 bg-[#0c1222] border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                Date
              </span>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <FaCalendarAlt className="text-indigo-400" />
                <span>
                  {event.date
                    ? new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBA"}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                Time
              </span>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <FaClock className="text-purple-400" />
                <span>{event.time || "10:00 AM"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                Location
              </span>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-pink-400" />
                <span className="truncate">{event.venue || "Campus Auditorium"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                Seats Remaining
              </span>
              <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
                <FaUsers />
                <span>{Math.max(0, capacity - registeredCount)} slots open</span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white">About the Event</h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Rules / Perks */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white">Delegate Guidelines & Perks</h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Open to all enrolled undergraduate and postgraduate college students.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Bring college student ID card along with your digital Nexus symposium pass.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Participants receive verified digital certificates and complimentary lunch coupon.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Winners receive cash prizes, trophies, and direct recognition.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT ACTION CARD */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/10 space-y-5 sticky top-28">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Registration Status
              </span>
              <div className="text-xl font-black text-white mt-1">
                {isRegistered ? "You're Registered!" : isFull ? "Event Full" : "Open for Registration"}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Registration Fee:</span>
                <span className="font-bold text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Certificate:</span>
                <span className="font-semibold text-white">Verified E-Cert</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mode:</span>
                <span className="font-semibold text-white">On Campus (In-Person)</span>
              </div>
            </div>

            {isRegistered ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full btn-modern-primary py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <FaTicketAlt />
                <span>View My Digital Pass</span>
              </button>
            ) : isFull ? (
              <button
                disabled
                className="w-full py-3 rounded-xl bg-slate-800 text-slate-500 font-semibold text-xs cursor-not-allowed"
              >
                Capacity Reached
              </button>
            ) : (
              <button
                onClick={() => navigate(`/events/${event._id}/register`)}
                className="w-full btn-modern-primary py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-indigo-500/30"
              >
                <span>Register for Event</span>
                <FaTicketAlt className="text-xs" />
              </button>
            )}

            <div className="pt-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <FaShieldAlt className="text-indigo-400" />
                <span>Authorized Nexus Symposium Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
