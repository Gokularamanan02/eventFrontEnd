import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NewHome.css";
import Orb3D from "./Orb3D";

const MainPage = () => {
  const navigate = useNavigate();
  const orbRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!orbRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 30;
    const rotateX = ((y / rect.height) - 0.5) * -30;

    orbRef.current.style.transform = `
      rotateY(${rotateY}deg)
      rotateX(${rotateX}deg)
    `;
  };

  const handleMouseLeave = () => {
    if (!orbRef.current) return;
    orbRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div className="hero-container">
      <div className="hero-left">
        <h1 className="hero-title">
          National Level <br />
          Technical Symposium
        </h1>

        <p className="hero-subtitle">
          A premium platform for students to participate in technical
          events, workshops, and innovation challenges across the nation.
        </p>

        <div className="hero-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate("/events")}
          >
            Explore Events
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </div>

      <div
        className="hero-right"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={orbRef} className="floating-orb">
          <Orb3D />
        </div>
        <div className="floating-orb-glow"></div>
      </div>
    </div>
  );
};

export default MainPage;