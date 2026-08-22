const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const db = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }

  console.log("✅ Connected to MySQL");
  connection.release();

  const schemaPath = path.join(
    __dirname,
    "database",
    "missing_tables.sql"
  );

  if (!fs.existsSync(schemaPath)) {
    console.log("ℹ️ Database schema file not found:", schemaPath);
    return;
  }

  const schema = fs.readFileSync(schemaPath, "utf8");

  db.query(schema, (schemaErr) => {
    if (schemaErr) {
      console.error("❌ Database table setup failed:", schemaErr);
      return;
    }

    console.log("✅ Database tables checked/created successfully");
  });
});

module.exports = db;
