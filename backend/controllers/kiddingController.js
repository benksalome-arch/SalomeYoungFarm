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


// Update kidding record
exports.updateKidding = (req, res) => {
  const { breeding_id, kidding_date, male_kids, female_kids, stillborn, notes } = req.body;
  const id = req.params.id;

  if (!breeding_id || !kidding_date) {
    return res.status(400).json({ message: "Breeding and kidding date are required." });
  }

  db.query(
    `UPDATE goat_kidding
     SET breeding_id=?, kidding_date=?, male_kids=?, female_kids=?, stillborn=?, notes=?
     WHERE id=?`,
    [
      breeding_id,
      kidding_date,
      Number(male_kids) || 0,
      Number(female_kids) || 0,
      Number(stillborn) || 0,
      notes || "",
      id,
    ],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
      }

      db.query(
        `UPDATE goat_breeding
         SET pregnancy_status='Kidded'
         WHERE id=?`,
        [breeding_id]
      );

      res.json({ message: "Kidding updated successfully." });
    }
  );
};

// Delete kidding record
exports.deleteKidding = (req, res) => {
  const id = req.params.id;

  db.query(
    `SELECT breeding_id FROM goat_kidding WHERE id=?`,
    [id],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
      }

      if (!rows.length) {
        return res.status(404).json({ message: "Kidding record not found." });
      }

      const breedingId = rows[0].breeding_id;

      db.query(
        `DELETE FROM goat_kidding WHERE id=?`,
        [id],
        (deleteErr) => {
          if (deleteErr) {
            console.error(deleteErr);
            return res.status(500).json({ message: deleteErr.message });
          }

          db.query(
            `UPDATE goat_breeding
             SET pregnancy_status='Pregnant'
             WHERE id=?`,
            [breedingId]
          );

          res.json({ message: "Kidding deleted successfully." });
        }
      );
    }
  );
};
