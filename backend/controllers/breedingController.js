const db = require("../db");

// ===============================
// Get all breeding records
// ===============================
exports.getBreedingRecords = (req, res) => {
  const sql = `
    SELECT
      gb.*,
      d.name AS doe_name,
      b.name AS buck_name,
      DATEDIFF(CURDATE(), gb.mating_date) AS pregnancy_days
    FROM goat_breeding gb
    JOIN goats d ON gb.doe_id = d.id
    JOIN goats b ON gb.buck_id = b.id
    ORDER BY gb.mating_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
};

// ===============================
// Add breeding record
// ===============================
exports.addBreedingRecord = (req, res) => {
  const {
    doe_id,
    buck_id,
    mating_date,
    expected_kidding,
    veterinarian,
    notes,
  } = req.body;

  const sql = `
    INSERT INTO goat_breeding
    (
      doe_id,
      buck_id,
      mating_date,
      expected_kidding,
      veterinarian,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      doe_id,
      buck_id,
      mating_date,
      expected_kidding,
      veterinarian,
      notes,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Breeding record added successfully.",
        id: result.insertId,
      });
    }
  );
};

// ===============================
// Mark as Kidded
// ===============================
exports.markKidding = (req, res) => {
  const { id } = req.params;

  db.query(
    `
    UPDATE goat_breeding
    SET pregnancy_status = 'Kidded'
    WHERE id = ?
    `,
    [id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Kidding recorded successfully.",
      });
    }
  );
};

// ===============================
// Delete breeding record
// ===============================
exports.deleteBreedingRecord = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM goat_breeding WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Breeding record deleted successfully.",
      });
    }
  );
};