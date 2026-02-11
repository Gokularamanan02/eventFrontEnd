import React from "react";
import "../styles/Dashboard.css";

const UpcomingEventCard = ({ event }) => {
  return (
    <div className="upcoming-card">
      <div className="upcoming-card-img">
        <img src={event.image} alt={event.title} />
        <div className="overlay">
          <h3>{event.title}</h3>
          <p>{event.date} | {event.venue}</p>
        </div>
      </div>
      <div className="upcoming-events-list">
        {event.events.map((e, idx) => (
          <span key={idx} className="event-item">{e}</span>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventCard;
