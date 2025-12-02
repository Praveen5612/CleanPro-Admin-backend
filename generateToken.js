const jwt = require("jsonwebtoken");
require("dotenv").config();

const token = jwt.sign(
  {
    user_id: 1,
    email: "admin@cleanpro.com",
    role: "admin"
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

console.log("Your static admin token:");
console.log(token);
