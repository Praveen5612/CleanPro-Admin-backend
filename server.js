const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const pool = require("./config/db");
const auth = require("./middleware/authMiddleware"); // IMPORTANT

const app = express();
app.use(cors());
app.use(express.json());

// Public route (no JWT)
app.use("/api/auth", require("./routes/authRoutes"));

// Protected routes (JWT required)
app.use("/api/users", auth, require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("Backend running...");
});

// MySQL Test
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("MySQL Connected");
    conn.release();
  } catch (err) {
    console.error("DB Error:", err);
  }
})();


console.log("JWT SECRET BEING USED:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
