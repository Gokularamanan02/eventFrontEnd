import React, { useState } from "react";
import axios from "axios";

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("admin@example.com"); // default admin email
  const [password, setPassword] = useState("Admin@123"); // default admin password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://eventserver-18lb.onrender.com/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // Save token in localStorage
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));

      // Call parent callback
      onLogin(user, token);

      setLoading(false);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login" style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Admin Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.5rem 1rem" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
