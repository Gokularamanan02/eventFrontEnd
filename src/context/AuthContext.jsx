// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

// ✅ Fix the base URL to your backend
const API = axios.create({
  baseURL: "https://eventserver-18lb.onrender.com/api", // backend + /api prefix
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  }, [user, token]);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || "Login failed" };
    }
  };

  // ✅ Add role to signup
  const signup = async (name, email, password, role = "user") => {
    try {
      const res = await API.post("/auth/signup", { name, email, password, role });
      setUser(res.data.user);
      setToken(res.data.token);
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || "Signup failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
