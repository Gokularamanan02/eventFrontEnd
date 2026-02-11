import React from "react";
import "../../styles/Event.css";
import "../../styles/Mainpage.css";

const MyRegistrations = () => {
  const myEvents = [
    {
      id: 1,
      title: "National Technical Symposium",
      venue: "ABC Engineering College",
      date: "28 March 2025",
      status: "LIVE",
    },
  ];

  return (
    <div className="my-events">
      <h1>My Registered Events</h1>

      <div className="my-event-list">
        {myEvents.map((e) => (
          <div key={e.id} className="my-event-card">
            <h3>{e.title}</h3>
            <p>📍 {e.venue}</p>
            <p>📅 {e.date}</p>
            <span className="live-badge">{e.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRegistrations;
