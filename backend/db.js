const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
    return;
  }

  console.log("✅ Connected to MySQL");

  const schemaPath = path.join(
    __dirname,
    "database",
    "missing_tables.sql"
  );

  if (!fs.existsSync(schemaPath)) {
    console.log("ℹ️ Database schema file not found.");
    return;
  }

  const schema = fs.readFileSync(schemaPath, "utf8");

  db.query(schema, (schemaErr) => {
    if (schemaErr) {
      console.error(
        "❌ Database table setup failed:",
        schemaErr
      );
      return;
    }

    console.log(
      "✅ Database tables checked/created successfully"
    );
  });
});

module.exports = db;