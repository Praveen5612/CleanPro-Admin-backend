const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const pool = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Serve images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============ ROUTES ============ //

// Auth
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Protected Routes
const auth = require("./middleware/authMiddleware");

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", auth, dashboardRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", auth, userRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// DB check
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("MySQL Connected");
    conn.release();
  } catch (err) {
    console.error("DB Error:", err);
  }
})();

module.exports = app;
