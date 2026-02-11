import React, { useEffect, useState } from "react";
import EventCard from "../../components/EventsUI/EventCard";
import { getEvents } from "../../components/utils/frontendFunctions";
import "../../styles/EventCard.css";

const EventsList = ({ user, token }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 NEW (safe additions)
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents(token, {
        search,
        page,
        limit: 6,
      });

      if (!data?.error) {
        // 🔒 Backward compatible handling
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents(data.events);
          setTotalPages(data.totalPages);
        }
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [search, page]);

  if (loading) return <p>Loading events...</p>;
  if (!events.length) return <p>No events available</p>;

  return (
    <>
      {/* 🔍 Search (no design change) */}
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ marginBottom: "16px", padding: "8px", width: "100%" }}
      />

      <div className="events-list">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            user={user}
            token={token}
            isAdmin={user?.role === "admin"}
            onUpdate={fetchEvents}
          />
        ))}
      </div>

      {/* 🔢 Pagination (plain, safe UI) */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default EventsList;
