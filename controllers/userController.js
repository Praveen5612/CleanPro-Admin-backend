const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// ==================================================
// CREATE USER (HASH PASSWORD)
// ==================================================
const createUser = async (req, res) => {
  try {
    const { full_name, email, phone, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ message: "full_name, email, password, role required." });
    }

    const check = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (check[0].length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (full_name, email, phone, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, phone || null, hashedPassword, role]
    );

    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// ==================================================
// GET ALL USERS
// ==================================================
const getAllUsers = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users ORDER BY id DESC");
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// ==================================================
// UPDATE USER BY EMAIL (HASH PASSWORD IF UPDATED)
// ==================================================
const updateUserByPayload = async (req, res) => {
  try {
    const { email, password, ...otherFields } = req.body;

    if (!email) return res.status(400).json({ message: "email is required to update user" });

    const fields = { ...otherFields };

    // If password is included → hash it
    if (password) {
      fields.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(fields).length === 0)
      return res.status(400).json({ message: "No fields provided to update" });

    const updates = [];
    const values = [];

    for (let key in fields) {
      updates.push(`${key} = ?`);
      values.push(fields[key]);
    }

    values.push(email);

    const [result] = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE email = ?`,
      values
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// ==================================================
// DELETE USER BY EMAIL
// ==================================================
const deleteUserByPayload = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "email required" });

    const [result] = await pool.query("DELETE FROM users WHERE email = ?", [email]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }

};

const getUserStats = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) AS total_users,
        SUM(role = 'admin') AS admin_count,
        SUM(role = 'user') AS user_count,
        SUM(role = 'partner') AS partner_count,
        SUM(role = 'cleaner') AS cleaner_count
      FROM users
    `);

    return res.json(rows[0]);
  } catch (error) {
    console.error("Stats error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};




module.exports = {
  createUser,
  getAllUsers,
  updateUserByPayload,
  deleteUserByPayload,
  getUserStats,
};
