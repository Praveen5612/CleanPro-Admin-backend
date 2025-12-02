const pool = require("../config/db");

// ======================================================================================
// CREATE USER
// ======================================================================================
const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, role, profile } = req.body;

    if (!first_name || !last_name || !email || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const sql = `
      INSERT INTO users (first_name, last_name, email, role, profile)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [
      first_name,
      last_name,
      email,
      role,
      profile || null,
    ]);

    return res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ======================================================================================
// GET ALL USERS
// ======================================================================================
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users ORDER BY user_id DESC");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ======================================================================================
// GET USER BY ID
// ======================================================================================
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ======================================================================================
// UPDATE USER
// ======================================================================================
const updateUserByPayload = async (req, res) => {
  try {
    const { user_id, ...rest } = req.body;

    if (!user_id)
      return res.status(400).json({ message: "user_id is required" });

    if (Object.keys(rest).length === 0)
      return res.status(400).json({ message: "No fields provided to update" });

    // dynamic SQL
    const fields = [];
    const values = [];

    for (let key in rest) {
      fields.push(`${key} = ?`);
      values.push(rest[key]);
    }

    values.push(user_id);

    const sql = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE user_id = ?
    `;

    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ======================================================================================
// DELETE USER
// ======================================================================================
const deleteUserByPayload = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id)
      return res.status(400).json({ message: "user_id is required" });

    const [result] = await pool.query(
      "DELETE FROM users WHERE user_id = ?",
      [user_id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ======================================================================================
// USER STATS (ADMIN, USER, PARTNER, CLEANER)
// ======================================================================================
const getUserStats = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        SUM(role = 'admin')   AS admin_count,
        SUM(role = 'user')    AS user_count,
        SUM(role = 'partner') AS partner_count,
        SUM(role = 'cleaner') AS cleaner_count
      FROM users
    `);

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ======================================================================================
// SEARCH + FILTER + PAGINATION
// ======================================================================================
const searchUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const q = req.query.q || "";
    const role = req.query.role || "";

    let where = "WHERE 1=1 ";
    const values = [];

    if (q) {
      where += "AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?) ";
      values.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (role) {
      where += "AND role = ? ";
      values.push(role);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM users ${where}`,
      values
    );

    const [rows] = await pool.query(
      `
      SELECT * FROM users
      ${where}
      ORDER BY user_id DESC
      LIMIT ? OFFSET ?
    `,
      [...values, limit, offset]
    );

    return res.json({
      page,
      total: countRows[0].total,
      users: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserByPayload,
  deleteUserByPayload,
  getUserStats,
  searchUsers
};
