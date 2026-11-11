// src/App.jsx
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
import EventDetails from "./pages/Events/Eventdetails";
import AddEditEvent from "./pages/Events/AddEvent";
import RegisterEvent from "./pages/Events/RegisterEvent";

// ================= PROTECTED ROUTE =================
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
};

// ================= APP ROUTES =================
const App = () => {
  const { user, token } = useAuth();

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* PUBLIC PAGES */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* EVENTS BROWSING (PUBLIC) */}
          <Route
            path="/events"
            element={
              <EventsList
                user={user}
                token={token}
                isAdmin={user?.role === "admin"}
              />
            }
          />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* EVENT REGISTRATION (PROTECTED) */}
          <Route
            path="/events/:id/register"
            element={
              <ProtectedRoute>
                <RegisterEvent />
              </ProtectedRoute>
            }
          />

          {/* EVENT MANAGEMENT (ADMIN ONLY) */}
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

          {/* CATCH ALL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
