const pool = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const [[{ total_customers }]] = await pool.query(
      "SELECT COUNT(*) AS total_customers FROM customers"
    );

    const [[{ total_cleaners }]] = await pool.query(
      "SELECT COUNT(*) AS total_cleaners FROM cleaners"
    );

    const [[{ total_partners }]] = await pool.query(
      "SELECT COUNT(*) AS total_partners FROM partners"
    );

    res.json({
      success: true,
      data: {
        customers: total_customers,
        cleaners: total_cleaners,
        partners: total_partners
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
