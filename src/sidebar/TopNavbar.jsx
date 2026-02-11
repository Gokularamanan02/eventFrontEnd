import React from "react";
import "../styles/Dashboard.css";

const TopNavbar = () => {
  return (
    <div className="top-navbar">
      <div className="search-bar">
        <input type="text" placeholder="Search events..." />
      </div>
      <div className="user-info">
        <span>Admin</span>
        <img src="/images/admin-avatar.png" alt="admin" className="avatar" />
      </div>
    </div>
  );
};

export default TopNavbar;
