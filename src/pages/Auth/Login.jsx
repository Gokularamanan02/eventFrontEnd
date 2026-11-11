import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaBolt,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaUserGraduate,
  FaArrowRight,
} from "react-icons/fa";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/events";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please provide both email and password");
      return;
    }

    const res = await login(email, password);
    if (res.error) {
      setError(res.error);
    } else {
      if (res.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate(from === "/login" ? "/dashboard" : from);
      }
    }
  };

  const handleDemoLogin = (role) => {
    if (role === "admin") {
      setEmail("admin@example.com");
      setPassword("Admin@123");
    } else {
      setEmail("student@example.com");
      setPassword("Student@123");
    }
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4 relative overflow-hidden tech-grid-bg">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <FaBolt className="text-lg" />
            </div>
            <span className="font-extrabold text-2xl tracking-wider text-white">NEXUS 2026</span>
          </Link>
          <p className="text-xs text-slate-400">
            Sign in to access event registrations and digital symposium passes
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Account Login</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              Symposium Portal
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="email"
                  required
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-modern-primary py-2.5 rounded-xl text-xs font-semibold shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Nexus"}</span>
              <FaArrowRight className="text-[10px]" />
            </button>
          </form>

          {/* QUICK DEMO LOGINS (EXCELLENT FOR RECRUITERS & REVIEWERS) */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Quick One-Click Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("admin")}
                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FaShieldAlt className="text-xs" />
                <span>Admin Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("student")}
                className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FaUserGraduate className="text-xs" />
                <span>Student Demo</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 pt-2">
            Don't have an account yet?{" "}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
