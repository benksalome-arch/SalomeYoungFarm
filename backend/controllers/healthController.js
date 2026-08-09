const db = require("../db");

// Get all health records for one goat
exports.getHealthByGoat = (req, res) => {
  const { goatId } = req.params;

  db.query(
    "SELECT * FROM goat_health WHERE goat_id = ? ORDER BY record_date DESC",
    [goatId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json(results);
    }
  );
};

// Add a new health record
exports.addHealthRecord = (req, res) => {
  const { goat_id, record_date, record_type, medicine, dosage, veterinarian, notes } = req.body;

  db.query(
    `INSERT INTO goat_health
    (goat_id, record_date, record_type, medicine, dosage, veterinarian, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [goat_id, record_date, record_type, medicine, dosage, veterinarian, notes],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Health record added successfully!",
        id: result.insertId,
      });
    }
  );
};

// Delete a health record
exports.deleteHealthRecord = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM goat_health WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Health record deleted successfully!",
      });
    }
  );
};