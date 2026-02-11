import React from "react";
import { useNavigate } from "react-router-dom";
import { registerForEvent } from "../components/utils/frontendFunctions"; // Correct path
import "../styles/Details.css";
import { events } from "../pages/Events/EventsList"; // Ensure this file exists
import "../styles/Dashboard.css";
import "../styles/EventCard.css";

const Details = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const todaysEvents = events.filter(event => event.date === today);

  return (
    <div className="pt-24 min-h-screen p-10 text-white dashboard-bg">
      <h1 className="text-3xl font-bold mb-6">Today's Events</h1>
      {todaysEvents.length === 0 ? (
        <p className="text-gray-300">No events today.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysEvents.map(event => (
            <div
              key={event.id}
              className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Price:</strong> {event.price}</p>
              </div>

              <button
                onClick={() => registerForEvent(event.id, event.name)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl transition"
              >
                Register Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Details;
