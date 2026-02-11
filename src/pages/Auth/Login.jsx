// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import "../../styles/Auth.css"; 

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.error) setError(res.error);
    else navigate("/events"); // redirect to events page
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p className="auth-link">
          Don't have an account? <a href="/signup">Signup</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
