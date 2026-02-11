import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getEvents } from "../components/utils/frontendFunctions";

/* IMPORT ALL EXISTING DASHBOARD STYLES */
import "../styles/Dashboard.css";
import "../styles/DashboardStyle.css";
import "../styles/DashboardUI.css";
import "../styles/DashboardCards.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getEvents();
      setEvents(data || []);
    };
    loadEvents();
  }, []);

  return (
    <div className="dashboard">
      {/* ================= HEADER ================= */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>
          Welcome, <strong>{user?.name || user?.username}</strong> (
          {user?.role})
        </p>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Events</h3>
          <span>{events.length}</span>
        </div>

        <div className="dashboard-card">
          <h3>Role</h3>
          <span>{user?.role}</span>
        </div>

        {/* ADMIN ADD EVENT CARD */}
        {user?.role === "admin" && (
          <div
            className="dashboard-card action-card"
            onClick={() => navigate("/events/add")}
          >
            <h3>Admin Action</h3>
            <button className="add-btn">+ Add Event</button>
          </div>
        )}
      </div>

      {/* ================= EVENTS SECTION ================= */}
      <div className="dashboard-events">
        <div className="events-header">
          <h2>Upcoming Events</h2>
          <button
            className="view-all-btn"
            onClick={() => navigate("/events")}
          >
            View All →
          </button>
        </div>

        {events.length === 0 ? (
          <p className="no-events">No events available.</p>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <div className="event-card" key={event._id}>
                <div className="event-card-header">
                  {event.title}
                </div>

                <div className="event-card-body">
                  <p className="event-date">
                    📅 {event.date || "Date not set"}
                  </p>

                  <p className="event-desc">
                    {event.description || "No description available"}
                  </p>

                  <div className="event-actions">
                    <button
                      className="register-btn"
                      onClick={() =>
                        navigate(`/events/${event._id}/register`)
                      }
                    >
                      Register
                    </button>

                    {/* ADMIN CRUD BUTTONS (UI ONLY) */}
                    {user?.role === "admin" && (
                      <div className="admin-actions">
                        <button
                          className="edit-btn"
                          onClick={() =>
                            navigate(`/events/edit/${event._id}`)
                          }
                        >
                          Edit
                        </button>

                        <button className="delete-btn">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
