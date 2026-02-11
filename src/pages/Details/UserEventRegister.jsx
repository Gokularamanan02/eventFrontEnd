import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import Button from "../../components/UIdesign/Button";
import axios from "axios";
import "../../styles/AdminRegistrations.css";
import "../../styles/Event.css";

const AdminRegistrations = () => {
  const { id } = useParams(); // Event ID
  const { token } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const res = await axios.get(`https://eventserver-18lb.onrender.com/events/${id}/registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setRegistrations(res.data.registrations);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [id]);

  // Accept or Decline
  const updateStatus = async (registrationId, status) => {
    try {
      const res = await axios.put(
        `https://eventserver-18lb.onrender.com/events/${id}/registrations/status`,
        { registrationId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r._id === registrationId ? res.data.registration : r))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading registrations...</p>;
  if (registrations.length === 0) return <p>No registrations found.</p>;

  return (
    <div className="admin-registrations-container">
      <h2>Event Registrations</h2>
      <table className="registrations-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((r, index) => (
            <tr key={r._id}>
              <td>{index + 1}</td>
              <td>{r.name || r.user?.name}</td>
              <td>{r.email || r.user?.email}</td>
              <td>{r.phone}</td>
              <td>{r.status}</td>
              <td>
                {r.status === "pending" && (
                  <>
                    <Button
                      onClick={() => updateStatus(r._id, "accepted")}
                      style={{ marginRight: "8px" }}
                    >
                      Accept
                    </Button>
                    <Button onClick={() => updateStatus(r._id, "declined")}>
                      Decline
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRegistrations;
