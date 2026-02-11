import React from "react";
import "../styles/Dashboard.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">Symposium Admin</h2>
      <ul className="menu">
        <li>Dashboard</li>
        <li>Events</li>
        <li>Registrations</li>
        <li>Users</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
