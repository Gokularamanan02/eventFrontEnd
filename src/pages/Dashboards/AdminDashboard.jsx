// src/pages/Dashboards/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  eventsApi,
  registrationsApi,
  adminApi,
} from "../../Services/api";

import AdminDashboardCharts from "./AdminDashboardCharts";

import {
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaHourglassHalf,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFileDownload,
  FaSearch,
  FaFilter,
  FaShieldAlt,
  FaTimesCircle,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "events" | "attendees"
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Attendees search & filter state
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [attendeeStatusFilter, setAttendeeStatusFilter] = useState("all");

  const fetchData = async () => {
    if (!token || user?.role !== "admin") return;
    setLoading(true);
    try {
      const [eventsData, registrationsData] = await Promise.all([
        eventsApi.getEvents(),
        registrationsApi.getAllRegistrations(),
      ]);

      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setRegistrations(Array.isArray(registrationsData) ? registrationsData : []);
    } catch (err) {
      console.error("Fetch dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, token]);

  // Derived metrics
  const pendingCount = useMemo(
    () => registrations.filter((r) => r.status === "pending").length,
    [registrations]
  );

  const approvedCount = useMemo(
    () => registrations.filter((r) => r.status === "approved").length,
    [registrations]
  );

  // Status handlers
  const handleStatusUpdate = async (regId, status) => {
    try {
      await registrationsApi.updateStatus(regId, status);
      // Update local state smoothly
      setRegistrations((prev) =>
        prev.map((r) => (r._id === regId ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status");
    }
  };

  const handleDeleteRegistration = async (regId) => {
    if (!window.confirm("Are you sure you want to delete this attendee registration?")) return;
    try {
      await registrationsApi.deleteRegistration(regId);
      setRegistrations((prev) => prev.filter((r) => r._id !== regId));
    } catch (err) {
      console.error("Delete registration error:", err);
      alert("Failed to delete registration");
    }
  };

  const handleDeleteEvent = async (eventId, title) => {
    if (!window.confirm(`Delete event "${title}" and all its attendee registrations?`)) return;
    try {
      await eventsApi.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      setRegistrations((prev) => prev.filter((r) => (r.event?._id || r.event) !== eventId));
    } catch (err) {
      console.error("Delete event error:", err);
      alert("Failed to delete event");
    }
  };

  // Filter attendees
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      // Status filter
      if (attendeeStatusFilter !== "all" && r.status !== attendeeStatusFilter) {
        return false;
      }

      // Search query
      if (attendeeSearch.trim()) {
        const q = attendeeSearch.toLowerCase();
        const attendeeName = (r.user?.name || "").toLowerCase();
        const attendeeEmail = (r.user?.email || "").toLowerCase();
        const eventName = (r.eventName || r.event?.title || "").toLowerCase();
        const college = (r.college || "").toLowerCase();
        const phone = (r.phone || "").toLowerCase();

        return (
          attendeeName.includes(q) ||
          attendeeEmail.includes(q) ||
          eventName.includes(q) ||
          college.includes(q) ||
          phone.includes(q)
        );
      }

      return true;
    });
  }, [registrations, attendeeStatusFilter, attendeeSearch]);

  // Export Attendees to CSV
  const handleExportCSV = () => {
    if (!registrations.length) {
      alert("No registrations to export");
      return;
    }

    const headers = [
      "Registration ID",
      "Attendee Name",
      "Attendee Email",
      "Event Title",
      "College",
      "Department",
      "Year",
      "Phone",
      "Status",
      "Registration Date",
    ];

    const rows = registrations.map((r) => [
      r._id,
      `"${r.user?.name || "N/A"}"`,
      `"${r.user?.email || "N/A"}"`,
      `"${r.eventName || r.event?.title || "N/A"}"`,
      `"${r.college || "N/A"}"`,
      `"${r.department || "N/A"}"`,
      `"${r.year || "N/A"}"`,
      `"${r.phone || "N/A"}"`,
      r.status,
      r.createdAt ? new Date(r.createdAt).toISOString() : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexus_symposium_attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center">
          <FaShieldAlt className="text-4xl text-rose-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-400 mt-2">
            This administrative console is reserved for authorized Symposium Coordinators.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 tech-grid-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER & QUICK ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-1">
              <FaShieldAlt className="text-[10px]" />
              <span>Symposium Administrator Console</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Executive Control Center</h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time attendee approvals, event publishing, and capacity metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/events/add")}
              className="btn-modern-primary text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-indigo-500/20"
            >
              <FaPlus />
              <span>Create Event</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="btn-modern-secondary text-xs py-2.5 px-4 rounded-xl flex items-center gap-2"
              title="Download attendee list as CSV"
            >
              <FaFileDownload />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* STATS METRIC ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl shrink-0">
              <FaCalendarAlt />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">{events.length}</div>
              <div className="text-xs text-slate-400">Total Events</div>
            </div>
          </div>

          <div className="glass-card p-5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl shrink-0">
              <FaUsers />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-cyan-400">{registrations.length}</div>
              <div className="text-xs text-slate-400">Total Registrations</div>
            </div>
          </div>

          <div className="glass-card p-5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
              <FaHourglassHalf />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-amber-300">{pendingCount}</div>
              <div className="text-xs text-slate-400">Pending Approvals</div>
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
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Overview & Analytics
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "events"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>Manage Events</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-[10px]">
              {events.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("attendees")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "attendees"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>Attendee Roster</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                {pendingCount} new
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <AdminDashboardCharts events={events} registrations={registrations} />

            {/* QUICK HIGHLIGHT OF RECENT REGISTRATIONS */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recent Attendee Applications
                </h3>
                <button
                  onClick={() => setActiveTab("attendees")}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  View all registrations →
                </button>
              </div>

              {registrations.slice(0, 5).length > 0 ? (
                <div className="divide-y divide-white/5">
                  {registrations.slice(0, 5).map((r) => (
                    <div key={r._id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{r.user?.name || "Unknown"}</div>
                        <div className="text-slate-400 text-[11px]">
                          {r.eventName || r.event?.title} • {r.college}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            r.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : r.status === "rejected"
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {r.status}
                        </span>

                        {r.status === "pending" && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStatusUpdate(r._id, "approved")}
                              className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(r._id, "rejected")}
                              className="px-2 py-1 rounded-md bg-rose-600/80 hover:bg-rose-500 text-white text-[11px]"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">No registrations yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE EVENTS TABLE */}
        {activeTab === "events" && (
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden animate-fade-in">
            <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">Symposium Event Directory</h3>
                <p className="text-xs text-slate-400">Total {events.length} published competitions and workshops</p>
              </div>

              <button
                onClick={() => navigate("/events/add")}
                className="btn-modern-primary text-xs py-2 px-3.5 rounded-xl flex items-center gap-2"
              >
                <FaPlus className="text-[10px]" />
                <span>New Event</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Venue</th>
                    <th className="py-3 px-4">Registrations</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {events.map((evt) => {
                    const count =
                      registrations.filter(
                        (r) => (r.event?._id || r.event) === evt._id
                      ).length || 0;
                    const cap = evt.capacity || 100;

                    return (
                      <tr key={evt._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                evt.image ||
                                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80"
                              }
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-800"
                            />
                            <div>
                              <div className="font-bold text-white line-clamp-1">{evt.title}</div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">
                                {evt.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-indigo-300 font-semibold text-[11px]">
                            {evt.category || "Technical"}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="text-white">
                            {evt.date ? new Date(evt.date).toLocaleDateString() : "TBA"}
                          </div>
                          <div className="text-slate-400 text-[11px]">{evt.time || "10:00 AM"}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{evt.venue || "Main Auditorium"}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">
                            {count} / {cap}
                          </div>
                          <div className="w-20 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${Math.min(100, (count / cap) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/events/edit/${evt._id}`, { state: { event: evt } })}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(evt._id, evt.title)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDEE MANAGEMENT TABLE */}
        {activeTab === "attendees" && (
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden animate-fade-in space-y-4">
            {/* Filter controls */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Filter by name, email, college, or event..."
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={attendeeStatusFilter}
                  onChange={(e) => setAttendeeStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="all">All Statuses ({registrations.length})</option>
                  <option value="pending">Pending ({pendingCount})</option>
                  <option value="approved">Approved ({approvedCount})</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  onClick={handleExportCSV}
                  className="btn-modern-secondary text-xs py-2 px-3 rounded-xl flex items-center gap-1.5"
                >
                  <FaFileDownload />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Delegate</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">College & Dept</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{reg.user?.name || "N/A"}</div>
                          <div className="text-[11px] text-slate-400">{reg.user?.email || "N/A"}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-indigo-300">
                            {reg.eventName || reg.event?.title || "N/A"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-white font-medium max-w-[200px] truncate">
                            {reg.college || "N/A"}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {reg.department || "N/A"} • {reg.year || ""}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">{reg.phone || "N/A"}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              reg.status === "approved"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : reg.status === "rejected"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {reg.status !== "approved" && (
                              <button
                                onClick={() => handleStatusUpdate(reg._id, "approved")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-sm"
                                title="Approve Entry Pass"
                              >
                                Approve
                              </button>
                            )}

                            {reg.status !== "rejected" && (
                              <button
                                onClick={() => handleStatusUpdate(reg._id, "rejected")}
                                className="px-2.5 py-1 rounded-lg bg-rose-600/70 hover:bg-rose-600 text-white text-[11px]"
                                title="Decline Registration"
                              >
                                Decline
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteRegistration(reg._id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 ml-1"
                              title="Delete Record"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500 text-xs">
                        No registrations match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
