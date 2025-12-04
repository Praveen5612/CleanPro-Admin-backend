const express = require("express");
const path = require("path")
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const pool = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());


// Serve images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========================= //
//          ROUTES           //
// ========================= //

// Auth (public)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Protected Routes
const auth = require("./middleware/authMiddleware"); // JWT Middleware

const cleanerRoutes = require("./routes/cleanerRoutes");
app.use("/api/cleaners", auth, cleanerRoutes);

const customerRoutes = require("./routes/customerRoutes");
app.use("/api/customers", auth, customerRoutes);

const partnerRoutes = require("./routes/partnerRoutes");
app.use("/api/partners", auth, partnerRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", auth, dashboardRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", auth, userRoutes);


// Default Check Route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// MySQL Connection Test
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("MySQL Connected");
    conn.release();
  } catch (err) {
    console.error("DB Error:", err);
  }
})();

// Show secret for debugging
// console.log("JWT SECRET:", process.env.JWT_SECRET);

module.exports = app;

