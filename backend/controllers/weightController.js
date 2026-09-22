const db = require("../db");
const { checkGoatAlive } = require("../utils/goatStatus");

// Get weight history for one goat
exports.getWeightHistory = (req, res) => {
  const { goatId } = req.params;

  db.query(
    "SELECT * FROM goat_weights WHERE goat_id = ? ORDER BY record_date DESC",
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

// Add a new weight record
exports.addWeightRecord = (req, res) => {
  const { goat_id, weight, record_date, notes } = req.body;

  checkGoatAlive(goat_id, (statusErr, goatStatus) => {
    if (statusErr) {
      console.error(statusErr);
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (!goatStatus.exists) {
      return res.status(404).json({
        message: "Goat not found.",
      });
    }

    if (!goatStatus.alive) {
      return res.status(409).json({
        message:
          "This goat is dead. No new records can be added or changed for this goat.",
      });
    }

    db.query(
      `INSERT INTO goat_weights
      (goat_id, weight, record_date, notes)
      VALUES (?, ?, ?, ?)`,
      [goat_id, weight, record_date, notes],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Database error",
          });
        }

        res.json({
          message: "Weight record added successfully!",
          id: result.insertId,
        });
      }
    );
  });
};