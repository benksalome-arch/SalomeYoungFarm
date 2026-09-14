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

    // Safely allow chickens.tag_number to be NULL on older databases.
    db.query(
      `SELECT IS_NULLABLE
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'chickens'
       AND COLUMN_NAME = 'tag_number'`,
      (columnErr, rows) => {
        if (columnErr) {
          console.error("❌ Could not check chickens.tag_number:", columnErr);
          return;
        }

        if (rows.length && rows[0].IS_NULLABLE === "NO") {
          db.query(
            `ALTER TABLE chickens
             MODIFY COLUMN tag_number VARCHAR(100) DEFAULT NULL`,
            (alterErr) => {
              if (alterErr) {
                console.error(
                  "❌ Could not update chickens.tag_number:",
                  alterErr
                );
                return;
              }

              console.log("✅ Updated chickens.tag_number to allow NULL");
            }
          );
        } else {
          console.log("✅ chickens.tag_number already allows NULL");
        }
      }
    );

    // Safely add chicken gender quantities for flock registration.
    db.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'chickens'
       AND COLUMN_NAME IN ('male_quantity', 'female_quantity')`,
      (columnErr, rows) => {
        if (columnErr) {
          console.error("❌ Could not check chicken gender quantities:", columnErr);
          return;
        }

        const existing = rows.map((row) => row.COLUMN_NAME);
        const missing = [];

        if (!existing.includes("male_quantity")) {
          missing.push("ADD COLUMN male_quantity INT DEFAULT NULL");
        }

        if (!existing.includes("female_quantity")) {
          missing.push("ADD COLUMN female_quantity INT DEFAULT NULL");
        }

        if (missing.length === 0) {
          console.log("✅ Chicken gender quantity columns already exist");
          return;
        }

        db.query(
          `ALTER TABLE chickens ${missing.join(", ")}`,
          (alterErr) => {
            if (alterErr) {
              console.error("❌ Could not add chicken gender quantities:", alterErr);
              return;
            }

            console.log("✅ Added missing chicken gender quantity columns");
          }
        );
      }
    );

    // Safely add missing Rabbit registration columns on older databases.
    db.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'rabbits'
       AND COLUMN_NAME IN ('source', 'quantity', 'purchase_price')`,
      (columnErr, rows) => {
        if (columnErr) {
          console.error("❌ Could not check Rabbit registration columns:", columnErr);
          return;
        }

        const existing = rows.map((row) => row.COLUMN_NAME);
        const missing = [];

        if (!existing.includes("source")) {
          missing.push("ADD COLUMN source VARCHAR(150) DEFAULT NULL");
        }

        if (!existing.includes("quantity")) {
          missing.push("ADD COLUMN quantity INT DEFAULT 0");
        }

        if (!existing.includes("purchase_price")) {
          missing.push("ADD COLUMN purchase_price DECIMAL(12,2) DEFAULT NULL");
        }

        if (missing.length === 0) {
          console.log("✅ Rabbit registration columns already exist");
          return;
        }

        db.query(
          `ALTER TABLE rabbits ${missing.join(", ")}`,
          (alterErr) => {
            if (alterErr) {
              console.error("❌ Could not add Rabbit registration columns:", alterErr);
              return;
            }

            console.log("✅ Added missing Rabbit registration columns");
          }
        );
      }
    );

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
