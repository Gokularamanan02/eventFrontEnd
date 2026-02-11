import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import navbarBg from "../assets/hero/navbar.png";

// ✅ CORRECT IMPORT (THIS FIXES THE ERROR)
import Navbar from "./Layout/Navbar";

const MainNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="w-full h-screen flex flex-col justify-between"
      style={{
        backgroundImage: `url(${navbarBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="w-full h-full bg-black/50 flex flex-col justify-between">

        {/* TOP NAVBAR (your original one) */}
        <Navbar />

        {/* HERO CONTENT */}
        <div className="text-center mb-32">
          <h1 className="text-white text-5xl font-bold mb-6">
            Welcome, {user?.role === "admin" ? "Admin" : "User"}!
          </h1>
         
        </div>
      </div>
    </div>
  );
};

/* Reusable Nav Button */
const NavButton = ({ to, children }) => (
  <Link
    to={to}
    className="relative hover:text-yellow-300 transition
      after:absolute after:left-0 after:-bottom-1
      after:w-0 after:h-[2px] after:bg-yellow-300
      hover:after:w-full after:transition-all"
  >
    {children}
  </Link>
);

export default MainNavbar;
