const pool = require("../config/db");

// CREATE partner
exports.createPartner = async (req, res) => {
  try {
    const { company_name, company_license, business_address, city } = req.body;

    const [result] = await pool.query(
      `INSERT INTO partners (company_name, company_license, business_address, city)
       VALUES (?, ?, ?, ?)`,
      [company_name, company_license, business_address, city]
    );

    res.json({
      success: true,
      message: "Partner added successfully",
      id: result.insertId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL partners
exports.getAllPartners = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM partners ORDER BY id DESC`);
    res.json({ success: true, data: rows });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET partner by ID
exports.getPartnerById = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM partners WHERE id = ?`, [
      req.params.id,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Partner not found" });

    res.json({ success: true, data: rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE partner
exports.updatePartner = async (req, res) => {
  try {
    const { company_name, company_license, business_address, city } = req.body;

    const [exists] = await pool.query(
      `SELECT id FROM partners WHERE id = ?`,
      [req.params.id]
    );

    if (exists.length === 0)
      return res.status(404).json({ message: "Partner not found" });

    await pool.query(
      `UPDATE partners SET
       company_name=?, company_license=?, business_address=?, city=?
       WHERE id=?`,
      [
        company_name,
        company_license,
        business_address,
        city,
        req.params.id,
      ]
    );

    res.json({
      success: true,
      message: "Partner updated successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE partner
exports.deletePartner = async (req, res) => {
  try {
    const [exists] = await pool.query(
      `SELECT id FROM partners WHERE id = ?`,
      [req.params.id]
    );

    if (exists.length === 0)
      return res.status(404).json({ message: "Partner not found" });

    await pool.query(`DELETE FROM partners WHERE id = ?`, [req.params.id]);

    res.json({
      success: true,
      message: "Partner deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
