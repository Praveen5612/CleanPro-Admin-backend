const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });

const bcrypt = require("bcryptjs");
const pool = require("./db");

// -------------------------------------------------------
// CREATE DEFAULT ADMIN
// -------------------------------------------------------
async function createDefaultAdmin() {
  try {
    const [rows] = await pool.query(
      "SELECT id FROM users WHERE email = 'admin@admin.com' LIMIT 1"
    );

    if (rows.length > 0) {
      console.log("Default admin already exists. Skipping.");
      return;
    }

    console.log("Creating default admin...");

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await pool.query(
      `
      INSERT INTO users (full_name, email, phone, password, role, profile_image)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      ["Super Admin", "admin@admin.com", "9999999999", hashedPassword, "admin", null]
    );

    console.log("Default admin created: admin@admin.com / Admin@123");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

// -------------------------------------------------------
// CREATE TABLES — ONLY THE ONES YOU NEED
// -------------------------------------------------------
async function createTables() {
  try {
    console.log("Creating required tables...");

    // MAIN USERS TABLE (ONLY TABLE YOU NEED NOW)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        role ENUM('admin','partner','cleaner','user') NOT NULL,
        profile_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Users table created/verified successfully.");

    // Create default admin
    await createDefaultAdmin();

    console.log("Database setup complete.");
    process.exit(0);

  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
}

createTables();
