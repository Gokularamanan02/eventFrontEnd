// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { authApi } from "../Services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [user, token]);

  const normalizeUser = (userData) => {
    if (!userData) return null;
    const id = userData._id || userData.id;
    return {
      ...userData,
      _id: id,
      id: id,
    };
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      const normalized = normalizeUser(data.user);
      setUser(normalized);
      setToken(data.token);
      return { success: true, user: normalized, token: data.token };
    } catch (err) {
      return { error: err.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, role = "user") => {
    setLoading(true);
    try {
      const data = await authApi.signup(name, email, password, role);
      const normalized = normalizeUser(data.user);
      setUser(normalized);
      setToken(data.token);
      return { success: true, user: normalized, token: data.token };
    } catch (err) {
      return { error: err.message || "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
