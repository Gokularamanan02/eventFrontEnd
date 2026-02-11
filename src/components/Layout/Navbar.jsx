// src/components/Layout/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">Symposium</Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="nav-user">Hello, {user.name}</span>

            {user.role === "admin" && (
              <Link to="/events/add" className="nav-btn">Add Event</Link>
            )}

            <button onClick={handleLogout} className="nav-btn logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/signup" className="nav-btn">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
