import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup(name, email, password);
    if (res.error) setError(res.error);
    else navigate("/"); // redirect to dashboard
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
