const pool = require("../config/db");

// CREATE customer
exports.createCustomer = async (req, res) => {
  try {
    const { full_name, phone, email, address, city } = req.body;

    const [result] = await pool.query(
      `INSERT INTO customers (full_name, phone, email, address, city)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, phone, email, address, city]
    );

    res.json({
      success: true,
      message: "Customer added successfully",
      id: result.insertId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL customers
exports.getAllCustomers = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM customers ORDER BY id DESC`);
    res.json({ success: true, data: rows });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM customers WHERE id = ?`, [
      req.params.id,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Customer not found" });

    res.json({ success: true, data: rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE customer
exports.updateCustomer = async (req, res) => {
  try {
    const { full_name, phone, email, address, city } = req.body;

    const [exists] = await pool.query(
      `SELECT id FROM customers WHERE id = ?`,
      [req.params.id]
    );

    if (exists.length === 0)
      return res.status(404).json({ message: "Customer not found" });

    await pool.query(
      `UPDATE customers SET
       full_name=?, phone=?, email=?, address=?, city=?
       WHERE id=?`,
      [full_name, phone, email, address, city, req.params.id]
    );

    res.json({
      success: true,
      message: "Customer updated successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE customer
exports.deleteCustomer = async (req, res) => {
  try {
    const [exists] = await pool.query(
      `SELECT id FROM customers WHERE id = ?`,
      [req.params.id]
    );

    if (exists.length === 0)
      return res.status(404).json({ message: "Customer not found" });

    await pool.query(`DELETE FROM customers WHERE id = ?`, [req.params.id]);

    res.json({
      success: true,
      message: "Customer deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
