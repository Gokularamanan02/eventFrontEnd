import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEvents, deleteEvent, approveRegistration, rejectRegistration } from "../../components/utils/frontendFunctions";
import StatCard from "./StatCard";
import EventCard from "../../components/EventsUI/EventCard";
import SummaryCard from "./SummaryCard";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import "../../styles/DashboardCards.css";
import "../../styles/DashboardUI.css";

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try { const evts = await getEvents(); setEvents(evts || []); } 
    catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { if(user?.role === "admin") fetchEvents(); }, [user, token]);

  const participantCount = useMemo(() => {
    const ids = events.flatMap(e => e.registrations || []).map(r => r.user?._id).filter(Boolean);
    return new Set(ids).size;
  }, [events]);

  const nextEvent = useMemo(() => {
    if(!events.length) return null;
    return [...events].sort((a,b)=> new Date(a.date) - new Date(b.date))[0];
  }, [events]);

  const handleDelete = async (eventId) => {
    if(!window.confirm("Delete this event?")) return;
    try { await deleteEvent(eventId, token); fetchEvents(); } 
    catch(err){ console.error(err); }
  };

  const handleApprove = async (eventId, regId) => { try { await approveRegistration(eventId, regId, token); fetchEvents(); } catch(err){ console.error(err); } };
  const handleReject = async (eventId, regId) => { try { await rejectRegistration(eventId, regId, token); fetchEvents(); } catch(err){ console.error(err); } };

  if(!user || user.role !== "admin") return <p className="access-denied">Access denied.</p>;
  if(loading) return <p className="loading-text">Loading dashboard...</p>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <h2 className="dashboard-title">Admin Dashboard</h2>

        <div className="stats-row">
          <StatCard icon={<FaCalendarAlt />} title="Total Events" value={events.length.toString()} color="purple" />
          <StatCard icon={<FaUsers />} title="Participants" value={participantCount.toString()} color="violet" />
        </div>

        <h3 className="section-title">Upcoming Events</h3>
        <div className="events-grid">
          {events.length ? events.map(event => (
            <EventCard
              key={event._id}
              event={event}
              isAdmin
              user={user}
              token={token}
              onDelete={()=>handleDelete(event._id)}
              onApprove={(regId)=>handleApprove(event._id, regId)}
              onReject={(regId)=>handleReject(event._id, regId)}
              onUpdate={fetchEvents}
            />
          )) : <p>No events available</p>}
        </div>

        <div className="summary-row">
          <SummaryCard title="Next Event" value={nextEvent?.title || "N/A"} />
          <SummaryCard title="Venue" value={nextEvent?.venue || "N/A"} />
          <SummaryCard title="Date" value={nextEvent?.date ? new Date(nextEvent.date).toLocaleDateString() : "N/A"} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
