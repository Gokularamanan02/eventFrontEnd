import { Link } from "react-router-dom";
import "../../styles/Navbar.css"; // optional, remove if not using

const UserNavbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">Event Portal</h2>

      <ul className="nav-links">
        <li>
          <Link to="/user/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/events">Events</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/login">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default UserNavbar;
