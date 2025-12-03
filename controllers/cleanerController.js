const pool = require("../config/db");

/*---------------------------------------------------
    CREATE CLEANER  (JSON ONLY)
----------------------------------------------------*/
exports.createCleaner = async (req, res) => {
  try {
    const { user_id, experience_years, skills, city, profile_image } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const [result] = await pool.query(
      `INSERT INTO cleaners (user_id, experience_years, skills, profile_image, city)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, experience_years || 0, skills, profile_image, city]
    );

    res.json({
      message: "Cleaner created successfully",
      cleaner_id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*---------------------------------------------------
    GET ALL CLEANERS
----------------------------------------------------*/
exports.getAllCleaners = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM cleaners ORDER BY id DESC`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*---------------------------------------------------
    GET CLEANER BY ID
----------------------------------------------------*/
exports.getCleanerById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM cleaners WHERE id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cleaner not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*---------------------------------------------------
    UPDATE CLEANER  (JSON ONLY)
----------------------------------------------------*/
exports.updateCleaner = async (req, res) => {
  try {
    const { experience_years, skills, city, profile_image } = req.body;

    const [rows] = await pool.query(
      `SELECT profile_image FROM cleaners WHERE id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cleaner not found" });
    }

    const old_image = rows[0].profile_image;

    await pool.query(
      `UPDATE cleaners SET 
        experience_years = ?, 
        skills = ?, 
        city = ?, 
        profile_image = IFNULL(?, profile_image)
      WHERE id = ?`,
      [experience_years, skills, city, profile_image, req.params.id]
    );

    res.json({
      message: "Cleaner updated successfully",
      removed_old_image: profile_image ? old_image : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*---------------------------------------------------
    DELETE CLEANER
----------------------------------------------------*/
exports.deleteCleaner = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT profile_image FROM cleaners WHERE id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cleaner not found" });
    }

    await pool.query(`DELETE FROM cleaners WHERE id = ?`, [req.params.id]);

    res.json({
      message: "Cleaner deleted successfully",
      deleted_profile_image: rows[0].profile_image,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
