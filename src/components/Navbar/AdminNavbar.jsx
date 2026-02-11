import { Link } from "react-router-dom";
import "../../styles/Navbar.css";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { registrations } = useAuth();

  // Count of pending registrations
  const pendingCount = registrations.filter(r => r.status === "pending").length;

  return (
    <nav className="navbar">
      <h2 className="logo">Admin Panel</h2>

      <ul className="nav-links">
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li>
          <Link to="/pending" className="pending-btn">
            Pending {pendingCount > 0 && `(${pendingCount})`}
          </Link>
        </li>
        <li><Link to="/login">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
