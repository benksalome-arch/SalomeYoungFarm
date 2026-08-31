const db = require("../db");

// ======================================
// Get all rabbit health records
// ======================================

exports.getHealthRecords = (req, res) => {
  db.query(
    `SELECT
        rh.*,
        r.tag,
        r.name
     FROM rabbit_health rh
     JOIN rabbits r
       ON rh.rabbit_id = r.id
     ORDER BY rh.treatment_date DESC, rh.id DESC`,
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
// Get health history for one rabbit
// ======================================

exports.getRabbitHealth = (req, res) => {
  db.query(
    `SELECT *
     FROM rabbit_health
     WHERE rabbit_id=?
     ORDER BY treatment_date DESC, id DESC`,
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
// Add health record
// ======================================

exports.createHealthRecord = (req, res) => {
  const {
    rabbit_id,
    treatment_date,
    treatment_type,
    diagnosis,
    medication,
    veterinarian,
    cost,
    notes,
  } = req.body;

  // Check that the rabbit exists
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
        `INSERT INTO rabbit_health
        (
          rabbit_id,
          treatment_date,
          treatment_type,
          diagnosis,
          medication,
          veterinarian,
          cost,
          notes
        )
        VALUES (?,?,?,?,?,?,?,?)`,
        [
          rabbit_id,
          treatment_date,
          treatment_type,
          diagnosis,
          medication,
          veterinarian,
          cost || 0,
          notes,
        ],
        (err, result) => {
          if (err) {
            console.error(err);

            return res.status(500).json({
              message: "Database error",
            });
          }

          // ======================================
          // Automatically create finance expense
          // ======================================

          if (Number(cost) > 0) {
            db.query(
              `INSERT INTO finance
              (
                transaction_date,
                type,
                category,
                description,
                amount,
                payment_method,
                created_by
              )
              VALUES (?,?,?,?,?,?,?)`,
              [
                treatment_date,
                "Expense",
                "Rabbit Health",
                `${treatment_type} treatment`,
                cost,
                "Cash",
                null,
              ],
              (financeErr) => {
                if (financeErr) {
                  console.error(
                    "Finance record error:",
                    financeErr
                  );
                }
              }
            );
          }

          res.json({
            message: "Rabbit health record added successfully!",
            id: result.insertId,
          });
        }
      );
    }
  );
};

// ======================================
// Delete health record
// ======================================

exports.deleteHealthRecord = (req, res) => {
  db.query(
    "DELETE FROM rabbit_health WHERE id=?",
    [req.params.id],
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