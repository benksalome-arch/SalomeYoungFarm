const db = require("../db");

// Get all kidding records
exports.getKidding = (req, res) => {
  const sql = `
    SELECT
      k.*,
      d.name AS doe_name,
      b.name AS buck_name
    FROM goat_kidding k
    JOIN goat_breeding br ON k.breeding_id = br.id
    JOIN goats d ON br.doe_id = d.id
    JOIN goats b ON br.buck_id = b.id
    ORDER BY k.kidding_date DESC
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

// Register kidding
exports.addKidding = (req, res) => {
  const {
    breeding_id,
    kidding_date,
    male_kids,
    female_kids,
    stillborn,
    notes,
  } = req.body;

  db.query(
    `INSERT INTO goat_kidding
    (
      breeding_id,
      kidding_date,
      male_kids,
      female_kids,
      stillborn,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      breeding_id,
      kidding_date,
      male_kids,
      female_kids,
      stillborn,
      notes,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: err.message,
        });
      }

      // Mark breeding as kidded
      db.query(
        `UPDATE goat_breeding
         SET pregnancy_status='Kidded'
         WHERE id=?`,
        [breeding_id]
      );

      res.json({
        message: "Kidding recorded successfully.",
        id: result.insertId,
      });
    }
  );
};