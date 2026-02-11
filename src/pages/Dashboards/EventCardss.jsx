import React from "react";
import "../../styles/DashboardCards.css";

const EventCard = ({ name, date, venue }) => {
  return (
    <div className="event-card">
      <h4>{name}</h4>
      <p>{date}</p>
      <span>{venue}</span>
    </div>
  );
};

export default EventCard;
