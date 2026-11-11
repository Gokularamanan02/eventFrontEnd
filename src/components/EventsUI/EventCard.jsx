import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaTicketAlt,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";
import { deleteEvent, registerForEvent } from "../utils/frontendFunctions";

const categoryColors = {
  Hackathon: "from-purple-600 to-indigo-600",
  Coding: "from-blue-600 to-cyan-600",
  Robotics: "from-amber-600 to-rose-600",
  Workshop: "from-pink-600 to-rose-600",
  "Paper Presentation": "from-emerald-600 to-teal-600",
  Technical: "from-indigo-600 to-purple-600",
  General: "from-slate-600 to-slate-700",
};

const defaultImageByCategory = {
  Hackathon: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
  Coding: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
  Robotics: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
  Workshop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
  "Paper Presentation": "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
  Technical: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
};

const EventCard = ({
  event,
  isAdmin = false,
  user,
  token,
  onUpdate,
  onViewDetails,
}) => {
  const navigate = useNavigate();
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [formData, setFormData] = useState({
    college: "",
    department: "",
    year: "3rd Year",
    phone: "",
  });

  const category = event.category || "Technical";
  const bgGradient = categoryColors[category] || categoryColors.Technical;
  const imageUrl =
    event.image ||
    defaultImageByCategory[category] ||
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80";

  // Check if current user is registered
  const userRegistration = event.registrations?.find((r) => {
    const regUserId = r.user?._id || r.user;
    const currentUserId = user?._id || user?.id;
    return regUserId && currentUserId && regUserId.toString() === currentUserId.toString();
  });

  const registeredCount = event.registrations?.length || 0;
  const capacity = event.capacity || 100;
  const capacityPercent = Math.min(100, Math.round((registeredCount / capacity) * 100));
  const isFull = registeredCount >= capacity;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    try {
      const res = await deleteEvent(event._id);
      if (res?.error) {
        alert(res.error);
      } else {
        onUpdate && onUpdate();
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (!formData.college || !formData.phone) {
      alert("Please fill in College name and Phone number");
      return;
    }

    setRegistering(true);
    try {
      const res = await registerForEvent(event._id, formData);
      if (res?.error) {
        alert(res.error);
      } else {
        alert("🎉 Registration submitted successfully!");
        setShowQuickRegister(false);
        onUpdate && onUpdate();
      }
    } catch (err) {
      alert("Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <>
      <div className="glass-card glass-card-hover overflow-hidden flex flex-col group relative border border-white/10 hover:border-indigo-500/40 transition-all duration-300">
        {/* IMAGE & BADGES */}
        <div className="relative h-48 overflow-hidden bg-slate-900">
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1527] via-transparent to-black/30" />

          {/* Category Pill */}
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r ${bgGradient} shadow-md backdrop-blur-md`}
          >
            {category}
          </span>

          {/* Status Badge */}
          {userRegistration && (
            <span
              className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg ${
                userRegistration.status === "approved"
                  ? "bg-emerald-500 text-white"
                  : userRegistration.status === "rejected"
                  ? "bg-rose-500 text-white"
                  : "bg-amber-500 text-slate-950 font-black"
              }`}
            >
              {userRegistration.status === "approved" ? (
                <>
                  <FaCheckCircle className="text-[10px]" /> Approved
                </>
              ) : userRegistration.status === "rejected" ? (
                <>
                  <FaTimesCircle className="text-[10px]" /> Rejected
                </>
              ) : (
                <>
                  <FaHourglassHalf className="text-[10px]" /> Pending
                </>
              )}
            </span>
          )}

          {/* Admin Edit/Delete Floating Overlay */}
          {isAdmin && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/events/edit/${event._id}`, { state: { event } });
                }}
                className="p-2 rounded-lg bg-slate-900/90 text-slate-200 hover:text-indigo-400 hover:bg-slate-900 transition-colors shadow-md border border-white/10"
                title="Edit Event"
              >
                <FaEdit className="text-xs" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg bg-slate-900/90 text-slate-200 hover:text-rose-400 hover:bg-slate-900 transition-colors shadow-md border border-white/10"
                title="Delete Event"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3
              onClick={() => (onViewDetails ? onViewDetails(event) : navigate(`/events/${event._id}`))}
              className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-1"
            >
              {event.title}
            </h3>

            <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* EVENT META INFO */}
          <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-slate-300">
              <FaCalendarAlt className="text-indigo-400 text-xs shrink-0" />
              <span>
                {event.date
                  ? new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Date TBA"}
              </span>
              <span className="text-slate-600">•</span>
              <FaClock className="text-purple-400 text-xs shrink-0" />
              <span>{event.time || "10:00 AM"}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <FaMapMarkerAlt className="text-pink-400 text-xs shrink-0" />
              <span className="truncate">{event.venue || "Main Campus Auditorium"}</span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <FaUsers className="text-cyan-400 text-[10px]" />
                  <span>Slots Filled</span>
                </span>
                <span className="font-semibold text-slate-300">
                  {registeredCount} / {capacity}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    capacityPercent > 85
                      ? "bg-rose-500"
                      : capacityPercent > 60
                      ? "bg-amber-400"
                      : "bg-indigo-500"
                  }`}
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => (onViewDetails ? onViewDetails(event) : navigate(`/events/${event._id}`))}
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors"
            >
              Details
            </button>

            {userRegistration ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1.5"
              >
                <FaTicketAlt className="text-[10px]" /> View Pass
              </button>
            ) : isFull ? (
              <button
                disabled
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 text-slate-500 cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!user) navigate("/login");
                  else setShowQuickRegister(true);
                }}
                className="flex-1 btn-modern-primary py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1"
              >
                <span>Register</span>
                <FaArrowRight className="text-[10px]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QUICK REGISTRATION MODAL */}
      {showQuickRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-white/20 shadow-2xl relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Event Registration
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{event.title}</h3>
              </div>
              <button
                onClick={() => setShowQuickRegister(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.name || ""}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  College / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Institute of Technology"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSE / IT / ECE"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="PG">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuickRegister(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="flex-1 btn-modern-primary py-2.5 rounded-xl text-xs font-semibold"
                >
                  {registering ? "Submitting..." : "Confirm Pass"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;
