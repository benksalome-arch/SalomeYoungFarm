const db = require("../db");

// ======================================
// Get all mortality records
// ======================================

exports.getMortality = (req, res) => {

  db.query(
    `SELECT
        cm.*,
        c.tag_number,
        c.name
     FROM chicken_mortality cm
     JOIN chickens c
       ON cm.chicken_id = c.id
     ORDER BY cm.mortality_date DESC, cm.id DESC`,
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
// Record mortality
// ======================================

exports.createMortality = (req, res) => {

  const {
    chicken_id,
    mortality_date,
    quantity,
    cause,
    notes,
  } = req.body;

  db.query(
    "SELECT * FROM chickens WHERE id=?",
    [chicken_id],
    (err, chickens) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (chickens.length === 0) {
        return res.status(404).json({
          message: "Chicken not found.",
        });
      }

      const chicken = chickens[0];

      if (Number(quantity) > Number(chicken.quantity)) {
        return res.status(400).json({
          message: "Mortality quantity exceeds flock quantity.",
        });
      }

      db.query(
        `INSERT INTO chicken_mortality
        (
          chicken_id,
          mortality_date,
          quantity,
          cause,
          notes
        )
        VALUES (?,?,?,?,?)`,
        [
          chicken_id,
          mortality_date,
          quantity,
          cause,
          notes,
        ],
        (insertErr, result) => {

          if (insertErr) {
            console.error(insertErr);

            return res.status(500).json({
              message: "Database error",
            });
          }

          db.query(
            "UPDATE chickens SET quantity = quantity - ? WHERE id=?",
            [
              quantity,
              chicken_id,
            ],
            (updateErr) => {

              if (updateErr) {
                console.error(updateErr);
              }

              res.json({
                message: "Chicken mortality recorded successfully!",
                id: result.insertId,
              });

            }
          );

        }
      );

    }
  );

};

// ======================================
// Delete mortality record
// ======================================

exports.deleteMortality = (req, res) => {

  db.query(
    "DELETE FROM chicken_mortality WHERE id=?",
    [req.params.id],
    (err) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message: "Mortality record deleted successfully!",
      });

    }
  );

};