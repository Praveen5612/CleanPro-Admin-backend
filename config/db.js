const mysql = require("mysql2/promise");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
  ssl: {
    ca: process.env.DB_CA_CERT,
  }


});

module.exports = pool;
