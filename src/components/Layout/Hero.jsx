import { useEffect } from "react";

const Hero = () => {

  useEffect(() => {
    if (window.tsParticles) {
      window.tsParticles.load("tsparticles", {
        fullScreen: { enable: false },

        particles: {
          number: { value: 80 },

          color: { value: ["#ffffff", "#ff0080", "#00c6ff"] },

          size: { value: { min: 1, max: 3 } },

          move: {
            enable: true,
            speed: 0.5,
          },

          opacity: { value: 0.7 },

          links: { enable: false },
        },
      });
    }
  }, []);

  return (
    <div className="hero-container">

      {/* 🌌 PARTICLES */}
      <div id="tsparticles"></div>

      {/* BACKGROUND */}
      <img
        src="/bannere.png"
        alt="banner"
        className="bg-image"
      />

      {/* OVERLAY */}
      <div className="overlay"></div>

      {/* CONTENT */}
      <div className="content">

        {/* LEFT */}
        <div className="text-section">
          <h1>National Level Symposium</h1>
          <p>Innovate • Inspire • Implement</p>

          <a href="/events" className="btn">
            Explore Events
          </a>
        </div>

        {/* SATURN */}
        <div className="saturn-wrapper">
          <div className="saturn-container">

            <div className="saturn-glow"></div>

            <div className="saturn">
              <div className="ring ring-back"></div>
              <div className="planet"></div>
              <div className="ring ring-front"></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;