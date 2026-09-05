const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load the project-root .env file
dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

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

    // Safely add users.phone if an older database does not have it.
    db.query(
      `SELECT COUNT(*) AS count
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'users'
       AND COLUMN_NAME = 'phone'`,
      (columnErr, rows) => {
        if (columnErr) {
          console.error("❌ Could not check users.phone:", columnErr);
          return;
        }

        if (rows[0].count === 0) {
          db.query(
            `ALTER TABLE users ADD COLUMN phone VARCHAR(30) DEFAULT NULL`,
            (alterErr) => {
              if (alterErr) {
                console.error("❌ Could not add users.phone:", alterErr);
                return;
              }

              console.log("✅ Added missing users.phone column");
            }
          );
        } else {
          console.log("✅ users.phone column already exists");
        }
      }
    );


  });
});

module.exports = db;
