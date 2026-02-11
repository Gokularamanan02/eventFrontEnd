import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/HomeRegistration.css";
import "../styles/Mainpage.css";
import "../styles/Event.css";
const eventsData = [
  { id: 1, name: "Tech Symposium", date: "2026-01-10", venue: "Auditorium" },
  { id: 2, name: "Coding Hackathon", date: "2026-01-15", venue: "Lab 3" },
  { id: 3, name: "Cultural Fest", date: "2026-01-20", venue: "Open Ground" },
];

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="home-wrapper"><p>Loading...</p></div>;

  const handleRegister = (event) => {
    if (!user || user.role !== "user") {
      alert("You must be logged in as a user to register!");
      return;
    }
    alert(`Registered for ${event.name} successfully!`);
    // Here you can call your API to save the registration
  };

  return (
    <div className="home-wrapper">
      <h2>Ongoing Events</h2>
      <div className="events-container">
        {eventsData.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <p>Date: {event.date}</p>
            <p>Venue: {event.venue}</p>

            {user && user.role === "user" ? (
              <button onClick={() => handleRegister(event)}>Register</button>
            ) : (
              <button disabled>Register</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
