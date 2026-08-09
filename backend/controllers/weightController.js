const db = require("../db");

// Get all weight records for one goat
exports.getWeightHistory = (req, res) => {
  const { id } = req.params;

  db.query(
    `SELECT *
     FROM goat_weights
     WHERE goat_id = ?
     ORDER BY record_date ASC, id ASC`,
    [id],
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

// Add a new weight record
exports.addWeightRecord = (req, res) => {
  const { goat_id, weight, record_date, notes } = req.body;

  db.query(
    `INSERT INTO goat_weights
    (goat_id, weight, record_date, notes)
    VALUES (?, ?, ?, ?)`,
    [goat_id, weight, record_date, notes],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Weight record added successfully!",
        id: result.insertId,
      });
    }
  );
};