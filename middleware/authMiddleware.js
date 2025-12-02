const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // VERIFY TOKEN FIRST
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ONLY AFTER VERIFYING → YOU CAN LOG OR USE decoded
    console.log("TOKEN PAYLOAD:", decoded);

    req.user = decoded; // attach decoded payload
    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
