// src/pages/Dashboards/UpcomingEventsDashboard.jsx
import React, { useEffect, useState } from "react";
import EventCard from "../../components/EventsUI/EventCard";
import "../../styles/DashboardCards.css";
import "../../styles/DashboardLikeUI.css";
import "../../styles/DashboardStyle.css";

import { getEvents } from "../../components/utils/frontendFunctions";

const UpcomingEventsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const evts = await getEvents();
        setEvents(evts || []);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading upcoming events...</p>;

  return (
    <div className="events-grid">
      {events.length > 0 ? (
        events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onRefresh={() =>
              setEvents((prev) => prev.filter((e) => e._id !== event._id))
            }
          />
        ))
      ) : (
        <p className="text-center text-lg text-gray-600">No upcoming events.</p>
      )}
    </div>
  );
};

export default UpcomingEventsDashboard;
