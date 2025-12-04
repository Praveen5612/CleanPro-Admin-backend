const express = require("express");
const router = express.Router();

const uploadProfile = require("../middleware/uploadProfile");
const { signupUser, loginUser } = require("../controllers/authController");

// SIGNUP with image upload
// router.post("/signup", uploadProfile.single("profile_image"), signupUser);

// LOGIN
router.post("/login", loginUser);

module.exports = router;
