// src/components/EventsUI/EventGrid.jsx
import React from "react";
import EventCard from "../../components/EventsUI/EventCard";
import "../../styles/Event.css";

const EventGrid = ({ events }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

export default EventGrid;
