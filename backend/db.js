const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "salomefarm",
  password: "SalomeFarm123",
  database: "salome_young_farm",
  port: 3306,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }

  console.log("✅ Connected to MySQL");

  const schemaPath = path.join(
    __dirname,
    "database",
    "missing_tables.sql"
  );

  if (!fs.existsSync(schemaPath)) {
    console.log(
      "ℹ️ Database schema file not found:",
      schemaPath
    );
    return;
  }

  const schema = fs.readFileSync(
    schemaPath,
    "utf8"
  );

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