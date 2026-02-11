import React from "react";

const Card = ({ title, value, image }) => {
  return (
    <div className="relative overflow-hidden shadow-lg hover:scale-105 transition-transform neon-card">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-60"></div>

      {/* Venue Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover relative z-10"
      />

      {/* Text content */}
      <div className="relative z-20 p-4 text-white flex flex-col items-start gap-2">
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Card;
