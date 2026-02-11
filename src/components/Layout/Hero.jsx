// src/components/Mainpage/Hero.jsx
import React from "react";

const Hero = () => {
  return (
    <div className="w-full h-[80vh] relative">
      <img
        src="/bannere.png" // place the image in public folder
        alt="Symposium Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          National Level Symposium
        </h1>
        <p className="text-lg md:text-2xl text-white mb-6">
          Innovate • Inspire • Implement
        </p>
        <a
          href="/events"
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
        >
          Explore Events
        </a>
      </div>
    </div>
  );
};

export default Hero;
