const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");
const verifyToken = require("../middleware/authMiddleware");

// CREATE customer
router.post(
  "/create",
  verifyToken,
  customerController.createCustomer
);

// GET ALL customers
router.get(
  "/",
  verifyToken,
  customerController.getAllCustomers
);

// GET single customer
router.get(
  "/:id",
  verifyToken,
  customerController.getCustomerById
);

// UPDATE customer
router.put(
  "/update/:id",
  verifyToken,
  customerController.updateCustomer
);

// DELETE customer
router.delete(
  "/delete/:id",
  verifyToken,
  customerController.deleteCustomer
);

module.exports = router;
