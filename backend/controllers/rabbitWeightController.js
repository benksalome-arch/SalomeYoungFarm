const db = require("../db");

// ======================================
// Get all rabbit weight records
// ======================================

exports.getWeightRecords = (req, res) => {
  db.query(
    `SELECT
        rw.*,
        r.tag_number,
        r.name
     FROM rabbit_weight rw
     JOIN rabbits r
       ON rw.rabbit_id = r.id
     ORDER BY rw.weight_date DESC, rw.id DESC`,
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
// Get weight history for one rabbit
// ======================================

exports.getRabbitWeight = (req, res) => {
  db.query(
    `SELECT *
     FROM rabbit_weight
     WHERE rabbit_id=?
     ORDER BY weight_date DESC, id DESC`,
    [req.params.rabbitId],
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
// Add rabbit weight record
// ======================================

exports.createWeightRecord = (req, res) => {
  const {
    rabbit_id,
    weight_date,
    weight,
    unit,
    notes,
  } = req.body;

  if (!rabbit_id || !weight_date || !weight) {
    return res.status(400).json({
      message:
        "Rabbit, weight date, and weight are required.",
    });
  }

  if (Number(weight) <= 0) {
    return res.status(400).json({
      message: "Weight must be greater than zero.",
    });
  }

  db.query(
    "SELECT * FROM rabbits WHERE id=?",
    [rabbit_id],
    (err, rabbits) => {
      if (err) {
        console.error(err);

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
        `INSERT INTO rabbit_weight
        (
          rabbit_id,
          weight_date,
          weight,
          unit,
          notes
        )
        VALUES (?,?,?,?,?)`,
        [
          rabbit_id,
          weight_date,
          weight,
          unit || "kg",
          notes || null,
        ],
        (insertErr, result) => {
          if (insertErr) {
            console.error(insertErr);

            return res.status(500).json({
              message: "Database error",
            });
          }

          res.json({
            message:
              "Rabbit weight record added successfully!",
            id: result.insertId,
          });
        }
      );
    }
  );
};

// ======================================
// Delete rabbit weight record
// ======================================

exports.deleteWeightRecord = (req, res) => {
  db.query(
    "DELETE FROM rabbit_weight WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.json({
        message:
          "Rabbit weight record deleted successfully!",
      });
    }
  );
};