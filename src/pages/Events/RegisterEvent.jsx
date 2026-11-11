import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { eventsApi, registrationsApi } from "../../Services/api";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaTicketAlt,
  FaShieldAlt,
  FaUserGraduate,
} from "react-icons/fa";

const RegisterEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    college: "",
    department: "",
    year: "3rd Year",
    phone: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchEventData = async () => {
      setLoading(true);
      try {
        const data = await eventsApi.getEventById(id);
        setEvent(data);

        // Check if user is already registered
        const already = data.registrations?.some((r) => {
          const regUser = r.user?._id || r.user;
          const currentUserId = user?._id || user?.id;
          return regUser && currentUserId && regUser.toString() === currentUserId.toString();
        });
        if (already) {
          setSuccess(true);
        }
      } catch (err) {
        console.error("Fetch event failed:", err);
        setError("Failed to load event details. Please verify the event exists.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.college.trim() || !formData.phone.trim()) {
      setError("Please fill in all mandatory fields (College and Phone)");
      return;
    }

    setSubmitting(true);
    try {
      await registrationsApi.registerForEvent(id, formData);
      setSuccess(true);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Loading event registration...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Event Not Found</h3>
          <p className="text-xs text-slate-400">The requested event could not be found or has been removed.</p>
          <Link to="/events" className="btn-modern-primary text-xs py-2 px-4 rounded-xl inline-block">
            Back to All Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 tech-grid-bg">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* TOP BACK BUTTON */}
        <button
          onClick={() => navigate("/events")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="text-[10px]" />
          <span>Back to Events Directory</span>
        </button>

        {success ? (
          /* SUCCESS SCREEN */
          <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-emerald-500/30 max-w-xl mx-auto space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl mx-auto">
              <FaCheckCircle />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Registration Confirmed!</h2>
              <p className="text-sm text-slate-300">
                You have successfully registered for <strong>{event.title}</strong>. Your entry pass is generated and available in your dashboard.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Delegate:</span>
                <span className="font-semibold text-white">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Event:</span>
                <span className="font-semibold text-indigo-300">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-white">
                  {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-400">Registered (Pending Review)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 btn-modern-primary py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <FaTicketAlt />
                <span>View My Passes</span>
              </button>
              <button
                onClick={() => navigate("/events")}
                className="flex-1 btn-modern-secondary py-3 rounded-xl text-xs font-semibold"
              >
                Explore Other Events
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM & SUMMARY */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: EVENT SUMMARY CARD */}
            <div className="lg:col-span-5 glass-card overflow-hidden">
              <div className="relative h-44 bg-slate-900">
                <img
                  src={
                    event.image ||
                    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80"
                  }
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1527] to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-md">
                  {event.category || "Technical"}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">{event.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <FaCalendarAlt className="text-indigo-400 text-xs shrink-0" />
                    <span>
                      {event.date
                        ? new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "TBA"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <FaClock className="text-purple-400 text-xs shrink-0" />
                    <span>{event.time || "10:00 AM"}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <FaMapMarkerAlt className="text-pink-400 text-xs shrink-0" />
                    <span>{event.venue || "Main Campus Auditorium"}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-2">
                  <FaShieldAlt className="shrink-0" />
                  <span>Free Registration • Verified E-Certificate Included</span>
                </div>
              </div>
            </div>

            {/* RIGHT: REGISTRATION FORM */}
            <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
                  <FaUserGraduate />
                  <span>Delegate Enrollment</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Complete Your Registration</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Please provide your academic credentials for your official symposium ID pass.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* PREFILLED USER DETAILS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user?.name || ""}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-400 text-xs cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-400 text-xs cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* COLLEGE */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    College / University Name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PSG College of Technology / NIT Trichy"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* DEPARTMENT & YEAR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Department / Specialization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science & Engg"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Year of Study
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="1st Year">1st Year (Fresher)</option>
                      <option value="2nd Year">2nd Year (Sophomore)</option>
                      <option value="3rd Year">3rd Year (Junior)</option>
                      <option value="4th Year">4th Year (Senior)</option>
                      <option value="PG">Postgraduate / Research</option>
                    </select>
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    WhatsApp Contact Number <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-modern-primary py-3 rounded-xl text-sm font-semibold shadow-indigo-500/30 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span>Submitting Registration...</span>
                    ) : (
                      <>
                        <FaTicketAlt />
                        <span>Confirm & Generate Event Pass</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterEvent;
