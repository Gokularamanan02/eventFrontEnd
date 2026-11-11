// src/pages/Dashboards/UserDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registrationsApi, eventsApi } from "../../Services/api";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaTicketAlt,
  FaUniversity,
  FaQrcode,
  FaPrint,
  FaArrowRight,
  FaLayerGroup,
  FaUserGraduate,
} from "react-icons/fa";

const UserDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [regs, evts] = await Promise.all([
        registrationsApi.getMyRegistrations(),
        eventsApi.getEvents(),
      ]);

      setRegistrations(Array.isArray(regs) ? regs : []);
      setAllEvents(Array.isArray(evts) ? evts : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Derived metrics
  const approvedCount = useMemo(
    () => registrations.filter((r) => r.status === "approved").length,
    [registrations]
  );

  const pendingCount = useMemo(
    () => registrations.filter((r) => r.status === "pending").length,
    [registrations]
  );

  const nextUpcomingEvent = useMemo(() => {
    if (!registrations.length) return null;
    const sorted = [...registrations]
      .filter((r) => r.event && r.event.date)
      .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));
    return sorted[0]?.event || null;
  }, [registrations]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Loading your symposium passes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 tech-grid-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* WELCOME BANNER */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <FaUserGraduate />
              <span>Student Delegate Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {user?.name || "Delegate"}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Access your digital symposium passes, check review status, and prepare
              for your events.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={() => navigate("/events")}
              className="btn-modern-primary text-xs py-2.5 px-4 rounded-xl flex items-center gap-2"
            >
              <span>Explore More Events</span>
              <FaArrowRight className="text-[10px]" />
            </button>

            {registrations.length > 0 && (
              <button
                onClick={handlePrint}
                className="btn-modern-secondary text-xs py-2.5 px-4 rounded-xl flex items-center gap-2"
                title="Print your digital passes"
              >
                <FaPrint />
                <span>Print Passes</span>
              </button>
            )}
          </div>
        </div>

        {/* METRIC STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl shrink-0">
              <FaTicketAlt />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">{registrations.length}</div>
              <div className="text-xs text-slate-400">Total Registered</div>
            </div>
          </div>

          <div className="glass-card p-5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
              <FaCheckCircle />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-400">{approvedCount}</div>
              <div className="text-xs text-slate-400">Approved Passes</div>
            </div>
          </div>

          <div className="glass-card p-5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
              <FaHourglassHalf />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-amber-300">{pendingCount}</div>
              <div className="text-xs text-slate-400">Pending Review</div>
            </div>
          </div>

          <div className="glass-card p-5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl shrink-0">
              <FaCalendarAlt />
            </div>
            <div className="truncate">
              <div className="text-sm font-bold text-white truncate">
                {nextUpcomingEvent ? new Date(nextUpcomingEvent.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "None"}
              </div>
              <div className="text-xs text-slate-400">Next Event Date</div>
            </div>
          </div>
        </div>

        {/* MY EVENT PASSES SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaTicketAlt className="text-indigo-400" />
              <span>My Digital Event Passes</span>
            </h2>
            <span className="text-xs text-slate-400">
              {registrations.length} {registrations.length === 1 ? "pass" : "passes"} issued
            </span>
          </div>

          {registrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registrations.map((reg) => {
                const event = reg.event || {};
                const isApproved = reg.status === "approved";
                const isRejected = reg.status === "rejected";

                return (
                  <div
                    key={reg._id}
                    className="glass-card overflow-hidden border border-white/10 flex flex-col justify-between relative shadow-xl hover:border-indigo-500/40 transition-all duration-300"
                  >
                    {/* TICKET TOP HEADER */}
                    <div className="p-5 pb-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-white/10 flex justify-between items-start gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                          {event.category || "Symposium Event"}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-0.5 line-clamp-1">
                          {reg.eventName || event.title || "Technical Event"}
                        </h3>
                      </div>

                      {/* Status Chip */}
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
                          isApproved
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : isRejected
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        }`}
                      >
                        {isApproved ? (
                          <>
                            <FaCheckCircle className="text-xs" /> Approved
                          </>
                        ) : isRejected ? (
                          <>
                            <FaTimesCircle className="text-xs" /> Declined
                          </>
                        ) : (
                          <>
                            <FaHourglassHalf className="text-xs" /> Pending Review
                          </>
                        )}
                      </span>
                    </div>

                    {/* TICKET BODY */}
                    <div className="p-5 space-y-4">
                      {/* Event Date, Time, Venue */}
                      <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                        <div className="space-y-1">
                          <span className="text-slate-500 text-[11px] block">Date & Time</span>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <FaCalendarAlt className="text-indigo-400 text-xs" />
                            <span>
                              {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}
                            </span>
                          </div>
                          <span className="text-slate-400 text-[11px] block pl-5">
                            {event.time || "10:00 AM"}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-500 text-[11px] block">Venue Hall</span>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <FaMapMarkerAlt className="text-pink-400 text-xs" />
                            <span className="truncate">{event.venue || "Campus Hall"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Attendee Info Card */}
                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Delegate:</span>
                          <span className="font-semibold text-slate-200">{user?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">College:</span>
                          <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                            {reg.college || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Dept & Year:</span>
                          <span className="font-semibold text-slate-200">
                            {reg.department || "N/A"} ({reg.year || "N/A"})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Phone:</span>
                          <span className="font-mono text-slate-300">{reg.phone || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* TICKET STUB / FOOTER */}
                    <div className="p-4 bg-slate-950/80 border-t border-dashed border-white/15 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <FaQrcode className="text-2xl text-indigo-400" />
                        <div>
                          <div className="text-[10px] font-mono text-slate-500">PASS ID</div>
                          <div className="font-mono text-xs text-slate-300 font-bold">
                            {reg._id.slice(-8).toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">ADMISSION</span>
                        <span className="font-bold text-xs text-indigo-300">
                          {isApproved ? "VALID PASS" : "PENDING"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-3xl flex items-center justify-center mx-auto">
                <FaTicketAlt />
              </div>
              <h3 className="text-lg font-bold text-white">No Event Registrations Yet</h3>
              <p className="text-xs text-slate-400">
                You haven't registered for any symposium events yet. Browse the schedule and enroll in hackathons, workshops, and coding challenges!
              </p>
              <button
                onClick={() => navigate("/events")}
                className="btn-modern-primary text-xs py-2.5 px-5 rounded-xl inline-flex items-center gap-2"
              >
                <span>Browse All Events</span>
                <FaArrowRight className="text-[10px]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
