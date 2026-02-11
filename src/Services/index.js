// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/Authroutes");
const eventRoutes = require("./routes/Eventroutes");
const seedEvents = require("./seed/seedEvents"); // ✅ ADD THIS

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

// Root route
app.get("/", (req, res) => res.send("Backend running"));

// ================= DB CONNECTION =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    // ✅ AUTO INSERT DEFAULT EVENTS
    await seedEvents();
  })
  .catch((err) => console.error("MongoDB error:", err));

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
