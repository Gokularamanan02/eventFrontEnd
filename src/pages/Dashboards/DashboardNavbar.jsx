import React from "react";
import "../../styles/DashboardNavbar.css";

const DashboardNavbar = () => {
  return (
    <nav className="w-full p-4 bg-gray-900 bg-opacity-90 backdrop-blur-lg fixed top-0 left-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left nav links */}
        <div className="flex items-center gap-6 text-white font-semibold text-lg">
          <a href="#" className="hover:text-cyan-400 transition">
            Dashboard
          </a>
          <a href="#" className="hover:text-cyan-400 transition">
            Events
          </a>
          <a href="#" className="hover:text-cyan-400 transition">
            Venues
          </a>
        </div>

        {/* Center logo or title */}
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Admin Panel
        </div>

        {/* Right nav links / actions */}
        <div className="flex items-center gap-6 text-white font-semibold text-lg">
          <a href="#" className="hover:text-cyan-400 transition">
            Profile
          </a>
          <a href="#" className="hover:text-cyan-400 transition">
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
