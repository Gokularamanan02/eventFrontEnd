// src/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Layout/Navbar";

// Pages
import MainPage from "./components/Mainpage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import UserDashboard from "./pages/Dashboards/UserDashboard";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";

import EventsList from "./pages/Events/EventsList";
import AddEditEvent from "./pages/Events/AddEvent";
import RegisterEvent from "./pages/Events/RegisterEvent";

// ================= PROTECTED ROUTE =================
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // wait for auth status

  if (!user) return <Navigate to="/login" replace />; // not logged in

  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />; // admin-only route guard

  return children;
};

// ================= APP ROUTES =================
const AppRoutes = () => {
  const { user, token } = useAuth();

  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC PAGES */}
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARDS */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <UserDashboard />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* EVENTS */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsList
                user={user}
                token={token}
                isAdmin={user?.role === "admin"}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/add"
          element={
            <ProtectedRoute adminOnly>
              <AddEditEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/edit/:id"
          element={
            <ProtectedRoute adminOnly>
              <AddEditEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id/register"
          element={
            <ProtectedRoute>
              <RegisterEvent user={user} token={token} />
            </ProtectedRoute>
          }
        />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
