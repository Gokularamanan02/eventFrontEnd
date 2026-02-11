// src/pages/Dashboards/UserDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import EventCard from "../../components/EventsUI/EventCard";
import SummaryCard from "./SummaryCard";
import StatCard from "./StatCard";
import { getEvents } from "../../components/utils/frontendFunctions";
import { FaCalendarAlt, FaUniversity, FaUsers } from "react-icons/fa";

import "../../styles/DashboardCards.css";
import "../../styles/DashboardUI.css";

const UserDashboard = () => {
  const { token, user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    if (!token || !user) return;

    setLoading(true);
    try {
      const evts = await getEvents(token);

      // If network or error
      if (!Array.isArray(evts)) {
        console.error("Events data is not an array:", evts);
        setEvents([]);
        setRegistrations([]);
        return;
      }

      // Filter registrations belonging to this user
      const userRegs = evts.flatMap((e) =>
        (e.registrations || [])
          .filter((r) => r.user?._id === user._id)
          .map((r) => ({ ...r, event: e }))
      );

      setRegistrations(userRegs);
      setEvents(evts);
    } catch (err) {
      console.error("User dashboard fetch error:", err);
      setEvents([]);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?._id, token]);

  // ================= STATS =================
  const collegeCount = useMemo(() => {
    const colleges = registrations.map((r) => r.college).filter(Boolean);
    return new Set(colleges).size;
  }, [registrations]);

  const participantCount = useMemo(() => {
    const users = registrations.map((r) => r.user?._id);
    return new Set(users).size;
  }, [registrations]);

  const nextEvent = useMemo(() => {
    if (!registrations.length) return null;
    return registrations
      .map((r) => r.event)
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  }, [registrations]);

  if (loading) return <p className="loading-text">Loading dashboard...</p>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <h2>User Dashboard</h2>

        {/* STATS */}
        <div className="stats-row">
          <StatCard
            icon={<FaCalendarAlt />}
            title="Registered Events"
            value={registrations.length}
            color="purple"
          />
          <StatCard
            icon={<FaUniversity />}
            title="Colleges"
            value={collegeCount}
            color="blue"
          />
          <StatCard
            icon={<FaUsers />}
            title="Participants"
            value={participantCount}
            color="violet"
          />
        </div>

        {/* EVENTS */}
        <h3 className="section-title">Your Events</h3>
        <div className="events-grid">
          {events.length ? (
            events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                user={user}
                token={token}
                onUpdate={fetchData}
              />
            ))
          ) : (
            <p>No events available</p>
          )}
        </div>

        {/* SUMMARY */}
        <div className="summary-row">
          <SummaryCard title="Next Event" value={nextEvent?.title || "N/A"} />
          <SummaryCard title="Venue" value={nextEvent?.venue || "N/A"} />
          <SummaryCard
            title="Date"
            value={
              nextEvent?.date
                ? new Date(nextEvent.date).toLocaleDateString()
                : "N/A"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
