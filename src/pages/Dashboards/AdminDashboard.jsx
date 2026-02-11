// src/pages/Dashboards/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getEvents,
  deleteEvent,
  getAllRegistrations,
  updateRegistrationStatus,
} from "../../components/utils/frontendFunctions";

import StatCard from "./StatCard";
import EventCard from "../../components/EventsUI/EventCard";
import SummaryCard from "./SummaryCard";
import AdminDashboardCharts from "./AdminDashboardCharts";

import { FaCalendarAlt, FaUsers } from "react-icons/fa";

import "../../styles/DashboardCards.css";
import "../../styles/DashboardUI.css";

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const eventsData = await getEvents(token);
      const registrationsData = await getAllRegistrations(token);

      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setRegistrations(Array.isArray(registrationsData) ? registrationsData : []);
    } catch (err) {
      console.error("Fetch dashboard data error:", err);
      alert("Unexpected error fetching dashboard data");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetchData();
  }, [user, token]);

  const participantCount = useMemo(() => {
    const ids = events.flatMap((e) => e.registrations || []).map((r) => r.user?._id).filter(Boolean);
    return new Set(ids).size;
  }, [events]);

  const nextEvent = useMemo(() => {
    if (!events.length) return null;
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  }, [events]);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    const res = await deleteEvent(eventId, token);
    if (res?.error) return alert(res.error);
    fetchData();
  };

  const handleApprove = async (regId) => {
    const res = await updateRegistrationStatus(regId, "approved", token);
    if (res?.error) return alert(res.error);
    fetchData();
  };

  const handleReject = async (regId) => {
    const res = await updateRegistrationStatus(regId, "rejected", token);
    if (res?.error) return alert(res.error);
    fetchData();
  };

  if (!user || user.role !== "admin") return <p className="access-denied">Access denied.</p>;
  if (loading) return <p className="loading-text">Loading dashboard...</p>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <h2 className="dashboard-title">Admin Dashboard</h2>

        <div className="stats-row">
          <StatCard icon={<FaCalendarAlt />} title="Total Events" value={events.length} color="purple" />
          <StatCard icon={<FaUsers />} title="Participants" value={participantCount} color="violet" />
        </div>

        <AdminDashboardCharts events={events} registrations={registrations} />

        <h3 className="section-title">Upcoming Events</h3>
        <div className="events-grid">
          {events.length ? (
            events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isAdmin
                user={user}
                token={token}
                onDelete={() => handleDeleteEvent(event._id)}
                onUpdate={fetchData}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          ) : (
            <p>No events available</p>
          )}
        </div>

        <div className="summary-row">
          <SummaryCard title="Next Event" value={nextEvent?.title || "N/A"} />
          <SummaryCard title="Venue" value={nextEvent?.venue || "N/A"} />
          <SummaryCard
            title="Date"
            value={nextEvent?.date ? new Date(nextEvent.date).toLocaleDateString() : "N/A"}
          />
        </div>

        <section className="registrations-section">
          <h2>Registrations Pending Approval</h2>
          {registrations.length === 0 ? (
            <p>No registrations found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Event</th>
                  <th>College</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id}>
                    <td>{reg.user?.name || "Unknown"}</td>
                    <td>{reg.event?.title || "Unknown"}</td>
                    <td>{reg.college || "N/A"}</td>
                    <td>{reg.status}</td>
                    <td>
                      {reg.status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(reg._id)}>Approve</button>
                          <button onClick={() => handleReject(reg._id)}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
