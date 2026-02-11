import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { registerForEvent } from "../../components/utils/frontendFunctions";
import "../../styles/Details.css";
import "../../styles/Event.css";

const OngoingEvents = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  const eventsList = [
    { id: 1, title: "Tech Innovation Fest 2026", description: "Competitions & workshops.", venue: "Main Auditorium", date: "2026-01-28", time: "10:00 AM - 6:00 PM", organizer: "Tech Club", registeredUsers: 120, ongoing: true },
    // add more events...
  ];

  useEffect(() => {
    const ev = eventsList.find((e) => e.id === Number(id));
    if (ev) setEvent(ev);
  }, [id]);

  if (!event) return <div className="text-center mt-20">Loading Event...</div>;

  const handleRegister = () => {
    registerForEvent(event.id, event.title);
    setEvent((prev) => ({ ...prev, registeredUsers: prev.registeredUsers + 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-indigo-600">{event.title}</h1>
        <p className="text-gray-700 mb-6">{event.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-gray-800">Venue</h3>
            <p className="text-gray-600">{event.venue}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Date & Time</h3>
            <p className="text-gray-600">{event.date} | {event.time}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Organizer</h3>
            <p className="text-gray-600">{event.organizer}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Registered Users</h3>
            <p className="text-gray-600">{event.registeredUsers}</p>
          </div>
        </div>

        {event.ongoing && (
          <div className="text-center mt-6">
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">Ongoing</span>
          </div>
        )}

        <div className="text-center mt-6">
          <button onClick={handleRegister} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition">
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OngoingEvents;
