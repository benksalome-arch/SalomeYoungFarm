const db = require("../db");

// ======================================
// Get all vaccinations
// ======================================

exports.getVaccinations = (req, res) => {

  db.query(
    `SELECT
        cv.*,
        c.tag_number,
        c.name,
        c.breed
     FROM chicken_vaccinations cv
     JOIN chickens c
       ON cv.chicken_id = c.id
     ORDER BY cv.vaccination_date DESC, cv.id DESC`,
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
// Record vaccination
// ======================================

exports.createVaccination = (req, res) => {

  const {
    chicken_id,
    vaccination_date,
    vaccine_name,
    dosage,
    next_due_date,
    administered_by,
    notes,
  } = req.body;

  db.query(
    "SELECT id FROM chickens WHERE id=?",
    [chicken_id],
    (checkErr, chickens) => {

      if (checkErr) {
        console.error(checkErr);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (chickens.length === 0) {
        return res.status(404).json({
          message: "Chicken not found.",
        });
      }

      db.query(
        `INSERT INTO chicken_vaccinations
        (
          chicken_id,
          vaccination_date,
          vaccine_name,
          dosage,
          next_due_date,
          administered_by,
          notes
        )
        VALUES (?,?,?,?,?,?,?)`,
        [
          chicken_id,
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
            message: "Vaccination recorded successfully!",
            id: result.insertId,
          });

        }
      );

    }
  );

};

// ======================================
// Delete vaccination
// ======================================

exports.deleteVaccination = (req, res) => {

  db.query(
    "DELETE FROM chicken_vaccinations WHERE id=?",
    [req.params.id],
    (err) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Vaccination deleted successfully!",
      });

    }
  );

};