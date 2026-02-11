import React from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/Mainnavbar";

import "../styles/Mainpage.css";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* HERO SECTION */}
      <div
        className="hero-container"
        style={{
          backgroundImage: "url('/bannere.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <MainNavbar />

        <div className="hero-overlay">
          <div className="hero-content text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              NATIONAL LEVEL <br /> TECHNICAL SYMPOSIUM
            </h1>

            <p className="text-xl text-white mb-6 max-w-2xl mx-auto">
              A national platform for students to participate in technical events,
              workshops, and innovation challenges.
            </p>

            <div className="hero-actions flex justify-center gap-4">
              <button
                className="btn-primary"
                onClick={() => navigate("/events")}
              >
                EXPLORE EVENTS
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/dashboard")}
              >
                DASHBOARD
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* UPCOMING EVENTS SECTION */}
      <section className="max-w-7xl mx-auto py-12 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Upcoming Events
        </h2>

        <p className="text-lg text-gray-600 mb-6">
          Explore all upcoming events in detail on the dedicated page.
        </p>

        <button
          className="btn-primary"
          onClick={() => navigate("/upcoming-events")}
        >
          View Upcoming Events
        </button>
      </section>
    </div>
  );
};

export default MainPage;
