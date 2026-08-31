const db = require("../db");

// ======================================
// Get all rabbit vaccinations
// ======================================

exports.getVaccinations = (req, res) => {

  db.query(
    `SELECT
        rv.*,
        r.tag,
        r.name,
        r.breed
     FROM rabbit_vaccinations rv
     JOIN rabbits r
       ON rv.rabbit_id = r.id
     ORDER BY rv.vaccination_date DESC, rv.id DESC`,
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

// ======================================
// Record rabbit vaccination
// ======================================

exports.createVaccination = (req, res) => {

  const {
    rabbit_id,
    vaccination_date,
    vaccine_name,
    dosage,
    next_due_date,
    administered_by,
    notes,
  } = req.body;

  db.query(
    "SELECT id FROM rabbits WHERE id=?",
    [rabbit_id],
    (checkErr, rabbits) => {

      if (checkErr) {
        console.error(checkErr);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (rabbits.length === 0) {
        return res.status(404).json({
          message: "Rabbit not found.",
        });
      }

      db.query(
        `INSERT INTO rabbit_vaccinations
        (
          rabbit_id,
          vaccination_date,
          vaccine_name,
          dosage,
          next_due_date,
          administered_by,
          notes
        )
        VALUES (?,?,?,?,?,?,?)`,
        [
          rabbit_id,
          vaccination_date,
          vaccine_name,
          dosage,
          next_due_date,
          administered_by,
          notes,
        ],
        (err, result) => {

          if (err) {
            console.error(err);

            return res.status(500).json({
              message: "Database error",
            });
          }

          res.json({
            message: "Rabbit vaccination recorded successfully!",
            id: result.insertId,
          });

        }
      );

    }
  );

};

// ======================================
// Delete rabbit vaccination
// ======================================

exports.deleteVaccination = (req, res) => {

  db.query(
    "DELETE FROM rabbit_vaccinations WHERE id=?",
    [req.params.id],
    (err) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Rabbit vaccination deleted successfully!",
      });

    }
  );

};