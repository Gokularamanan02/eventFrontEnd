import React, { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Orb3D from "./Orb3D";
import { eventsApi } from "../Services/api";
import { useAuth } from "../context/AuthContext";
import {
  FaBolt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaTrophy,
  FaArrowRight,
  FaCheckCircle,
  FaLaptopCode,
  FaMicrochip,
  FaAward,
  FaShieldAlt,
} from "react-icons/fa";

const MainPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const orbRef = useRef(null);

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeEvents = async () => {
      try {
        const data = await eventsApi.getEvents({ limit: 3 });
        if (Array.isArray(data)) {
          setFeaturedEvents(data.slice(0, 3));
        } else if (data && Array.isArray(data.events)) {
          setFeaturedEvents(data.events.slice(0, 3));
        }
      } catch (err) {
        console.error("Home events fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeEvents();
  }, []);

  const handleMouseMove = (e) => {
    if (!orbRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * 25;
    const rotateX = (y / rect.height - 0.5) * -25;

    orbRef.current.style.transform = `
      rotateY(${rotateY}deg)
      rotateX(${rotateX}deg)
    `;
  };

  const handleMouseLeave = () => {
    if (!orbRef.current) return;
    orbRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  const categories = [
    { name: "Hackathon", icon: <FaLaptopCode />, color: "from-purple-500 to-indigo-500", desc: "24-Hour Code Challenges" },
    { name: "Coding", icon: <FaBolt />, color: "from-cyan-500 to-blue-500", desc: "Speed Debugging & DSA" },
    { name: "Robotics", icon: <FaMicrochip />, color: "from-amber-500 to-red-500", desc: "Combat & Autonomous Bots" },
    { name: "Paper Presentation", icon: <FaAward />, color: "from-emerald-500 to-teal-500", desc: "Original Research & AI" },
    { name: "Workshop", icon: <FaUsers />, color: "from-pink-500 to-rose-500", desc: "Hands-on Masterclasses" },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col tech-grid-bg">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Glow Spheres in background */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide shadow-lg shadow-indigo-500/10 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>National Level Technical Symposium 2026</span>
              <span className="text-white/40">|</span>
              <span className="text-pink-400 font-bold">Registrations Live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Unleash Your <br />
              <span className="gradient-text">Engineering Potential</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
              Step onto the national stage. Compete in high-intensity hackathons,
              showcase cutting-edge research, crack competitive programming arenas,
              and win from a grand prize pool of <strong className="text-white">₹2,00,000+</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2 w-full sm:w-auto">
              <button
                className="btn-modern-primary text-sm sm:text-base px-6 py-3.5 w-full sm:w-auto shadow-indigo-500/30"
                onClick={() => navigate("/events")}
              >
                <span>Explore All Events</span>
                <FaArrowRight className="text-xs" />
              </button>

              <button
                className="btn-modern-secondary text-sm sm:text-base px-6 py-3.5 w-full sm:w-auto"
                onClick={() => navigate(user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/signup")}
              >
                <span>{user ? "Go to Dashboard" : "Get Event Pass"}</span>
              </button>
            </div>

            {/* Quick Feature Perks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 w-full text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400" />
                <span>Verified ISO Certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-indigo-400" />
                <span>Cash Prize & Trophies</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-400" />
                <span>Instant Digital Passes</span>
              </div>
            </div>
          </div>

          {/* RIGHT 3D INTERACTIVE ORB CANVAS */}
          <div
            className="lg:col-span-5 flex justify-center items-center relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-full max-w-[480px] h-[450px] flex items-center justify-center">
              {/* Decorative Tech Rings */}
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 scale-105 pointer-events-none animate-spin" style={{ animationDuration: "35s" }} />
              <div className="absolute inset-6 rounded-full border border-pink-500/20 scale-95 pointer-events-none animate-spin" style={{ animationDuration: "25s", animationDirection: "reverse" }} />

              <div
                ref={orbRef}
                className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
              >
                <Orb3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= METRICS STATS BAR ================= */}
      <section className="border-y border-white/10 bg-[#0c1222]/80 backdrop-blur-md py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold gradient-text">25+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Flagship Events</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold gradient-text-cyan">₹2,00,000+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Grand Prize Pool</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">1,500+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Registered Delegates</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold gradient-text-gold">50+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Participating Colleges</div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">
            Event Spectrum
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
            Categories Tailored for Every Tech Enthusiast
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Choose your arena and demonstrate real-world engineering problem solving.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/events?category=${encodeURIComponent(cat.name)}`)}
              className="glass-card glass-card-hover p-5 flex flex-col items-center text-center cursor-pointer group transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}
              >
                {cat.icon}
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED EVENTS PREVIEW ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-pink-400">
              Spotlight Competitions
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">Featured Symposium Events</h2>
            <p className="text-slate-400 text-sm mt-1">
              Top events with limited seats and high prize pools.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All Events ({featuredEvents.length > 0 ? "20+" : "Loading..."})</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card p-6 h-80 animate-pulse bg-slate-900/50" />
            ))}
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((evt) => (
              <div
                key={evt._id}
                className="glass-card glass-card-hover overflow-hidden flex flex-col group"
              >
                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={
                      evt.image ||
                      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80"
                    }
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b101d] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-600/90 text-white backdrop-blur-md shadow-md">
                    {evt.category || "Technical"}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-slate-400">
                      <FaCalendarAlt className="text-indigo-400 text-xs" />
                      <span>{evt.date ? new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <FaMapMarkerAlt className="text-pink-400 text-xs" />
                      <span className="truncate">{evt.venue || "Campus Auditorium"}</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/events/${evt._id}/register`)}
                        className="btn-modern-primary text-xs py-2 px-3.5 w-full rounded-xl"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-400">Events are loading or scheduled soon.</p>
            <button
              onClick={() => navigate("/events")}
              className="btn-modern-primary text-xs mt-4 px-4 py-2"
            >
              Browse Event Directory
            </button>
          </div>
        )}
      </section>

      {/* ================= WHY ATTEND SECTION ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-cyan-400">
                Participation Value
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-2 leading-tight">
                Why Students Across India Choose Nexus Symposium
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                Whether you're presenting a groundbreaking ML research paper or
                stress-testing your coding chops in real time, Nexus gives you a
                platform to stand out, win, and get recognized.
              </p>

              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5">
                    <FaTrophy className="text-sm" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Prestigious Honors & Cash Awards</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Direct bank transfer awards, mementos, and medals for top 3 teams in all categories.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 mt-0.5">
                    <FaShieldAlt className="text-sm" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Cryptographically Verified Certificates</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Every registered participant receives an authorized verifiable digital credential for their LinkedIn & Resume.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 mt-0.5">
                    <FaUsers className="text-sm" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Industry Juries & Placement Leads</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Network directly with engineering leaders, CTOs, and startup founders judging the events.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-4 bg-slate-950/60 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-500/30">
                <FaBolt />
              </div>
              <h3 className="text-xl font-bold text-white">Ready to Claim Your Spot?</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Registrations are free and open to all undergraduate and postgraduate engineering students.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="btn-modern-primary text-sm px-6 py-3 rounded-xl mt-2 w-full max-w-xs"
              >
                Register as Student
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 bg-[#060910] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              <FaBolt />
            </div>
            <div>
              <span className="font-extrabold text-white text-base">NEXUS 2026</span>
              <p className="text-[11px] text-slate-400">National Technical Symposium Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/events" className="hover:text-white transition-colors">All Events</Link>
            <Link to="/login" className="hover:text-white transition-colors">Admin Login</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right">
            © 2026 Nexus Technical Symposium. Built with MERN Stack & Tailwind CSS.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
