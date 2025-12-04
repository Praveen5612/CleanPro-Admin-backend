const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =============================
// SIGNUP USER
// =============================
const signupUser = async (req, res) => {
  try {
    const { full_name, email, phone, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ message: "full_name, email, password, role required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [exists] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (exists.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImgPath = null;
    if (req.file) profileImgPath = req.file.path;

    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, phone, password, role, profile_image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [full_name, normalizedEmail, phone || "", hashedPassword, role, profileImgPath]
    );

    return res.status(201).json({
      message: "Signup successful",
      user_id: result.insertId,
      profile_image: profileImgPath
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};



// =============================
// LOGIN USER
// =============================
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const user = rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Check role
    if (user.role !== role) {
      return res.status(403).json({
        message: "Role does not match account. Choose the correct role.",
      });
    }

    // Generate JWT
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile_image: user.profile_image
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
};
