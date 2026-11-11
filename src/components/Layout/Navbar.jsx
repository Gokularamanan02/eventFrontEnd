// src/components/Layout/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaBolt,
  FaCalendarAlt,
  FaChartLine,
  FaUserShield,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaTicketAlt,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#080c14]/85 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* BRAND LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
                <FaBolt className="text-indigo-400 group-hover:text-pink-400 transition-colors text-lg" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-white group-hover:text-indigo-300 transition-colors">
                NEXUS
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-indigo-400 uppercase">
                Symposium 2026
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Home
            </Link>

            <Link
              to="/events"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                isActive("/events")
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <FaCalendarAlt className="text-xs" />
              Explore Events
            </Link>

            {user && (
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive("/dashboard") || isActive("/admin")
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {user.role === "admin" ? (
                  <>
                    <FaUserShield className="text-xs text-amber-400" />
                    Admin Portal
                  </>
                ) : (
                  <>
                    <FaTicketAlt className="text-xs text-cyan-400" />
                    My Passes
                  </>
                )}
              </Link>
            )}
          </nav>

          {/* RIGHT ACTIONS / USER PILL */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 bg-slate-900/90 border border-white/10 py-1.5 px-3 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-medium capitalize">
                      {user.role === "admin" ? "Admin" : "Student"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all text-sm"
                  title="Log out"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <FaSignInAlt className="text-xs" />
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="btn-modern-primary text-xs py-2 px-4 rounded-xl flex items-center gap-2"
                >
                  <FaUserPlus className="text-xs" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#080c14]/95 backdrop-blur-2xl px-4 py-6 space-y-3 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
              isActive("/") ? "bg-indigo-600/30 text-indigo-300" : "text-slate-300"
            }`}
          >
            Home
          </Link>

          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
              isActive("/events") ? "bg-indigo-600/30 text-indigo-300" : "text-slate-300"
            }`}
          >
            Explore Events
          </Link>

          {user && (
            <Link
              to={user.role === "admin" ? "/admin" : "/dashboard"}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive("/dashboard") || isActive("/admin")
                  ? "bg-indigo-600/30 text-indigo-300"
                  : "text-slate-300"
              }`}
            >
              {user.role === "admin" ? "Admin Portal" : "My Passes & Dashboard"}
            </Link>
          )}

          <div className="pt-4 border-t border-white/10">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{user.name}</div>
                    <div className="text-xs text-indigo-400 capitalize">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center btn-modern-primary py-2.5 px-4 rounded-xl text-sm font-medium"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
