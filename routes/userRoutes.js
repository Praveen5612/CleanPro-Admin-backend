const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  updateUserByPayload,
  deleteUserByPayload,
  getUserStats
} = require("../controllers/userController");

// CREATE USER
router.post("/", createUser);

// GET ALL USERS
router.get("/", getAllUsers);

// UPDATE USER (email-based)
router.put("/", updateUserByPayload);

// DELETE USER (email-based)
router.delete("/", deleteUserByPayload);

// GET STATS
router.get("/stats/all", getUserStats);

module.exports = router;
