const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserByPayload,
  deleteUserByPayload,
  getUserStats,
  searchUsers
} = require("../controllers/userController");

// CREATE USER
router.post("/", createUser);

// GET ALL USERS
router.get("/", getAllUsers);

// GET USER BY SPECIFIC ID
router.get("/:id", getUserById);

// UPDATE USER (payload)
router.put("/", updateUserByPayload);

// DELETE USER (payload)
router.delete("/", deleteUserByPayload);

// USER STATISTICS
router.get("/stats/all", getUserStats);

// SEARCH + FILTER + PAGINATION
router.get("/search/all", searchUsers);

module.exports = router;
