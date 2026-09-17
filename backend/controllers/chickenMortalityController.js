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
            `UPDATE chickens
             SET
               quantity = quantity - ?,
               status = CASE
                 WHEN quantity - ? <= 0 THEN 'Dead'
                 ELSE status
               END
             WHERE id=?`,
            [
              quantity,
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
// Update mortality record
// ======================================

exports.updateMortality = (req, res) => {
  const mortalityId = req.params.id;

  const {
    mortality_date,
    quantity,
    cause,
    notes,
  } = req.body;

  const newQuantity = Number(quantity);

  if (!mortality_date || !Number.isInteger(newQuantity) || newQuantity <= 0) {
    return res.status(400).json({
      message: "Mortality date and a valid positive quantity are required.",
    });
  }

  db.query(
    "SELECT * FROM chicken_mortality WHERE id=?",
    [mortalityId],
    (findErr, records) => {
      if (findErr) {
        console.error(findErr);
        return res.status(500).json({ message: "Database error" });
      }

      if (records.length === 0) {
        return res.status(404).json({
          message: "Mortality record not found.",
        });
      }

      const oldRecord = records[0];
      const oldQuantity = Number(oldRecord.quantity);
      const chickenId = oldRecord.chicken_id;

      db.query(
        "SELECT * FROM chickens WHERE id=?",
        [chickenId],
        (chickenErr, chickens) => {
          if (chickenErr) {
            console.error(chickenErr);
            return res.status(500).json({ message: "Database error" });
          }

          if (chickens.length === 0) {
            return res.status(404).json({
              message: "Chicken flock not found.",
            });
          }

          const chicken = chickens[0];

          // Restore the old mortality first, then apply the new one.
          const availableQuantity =
            Number(chicken.quantity) + oldQuantity;

          if (newQuantity > availableQuantity) {
            return res.status(400).json({
              message: "Mortality quantity exceeds flock quantity.",
            });
          }

          const quantityDifference = newQuantity - oldQuantity;

          db.query(
            `UPDATE chicken_mortality
             SET mortality_date=?,
                 quantity=?,
                 cause=?,
                 notes=?
             WHERE id=?`,
            [
              mortality_date,
              newQuantity,
              cause || null,
              notes || null,
              mortalityId,
            ],
            (updateErr) => {
              if (updateErr) {
                console.error(updateErr);
                return res.status(500).json({
                  message: "Database error",
                });
              }

              db.query(
                `UPDATE chickens
                 SET
                   quantity = quantity - ?,
                   status = CASE
                     WHEN quantity - ? <= 0 THEN 'Dead'
                     ELSE status
                   END
                 WHERE id=?`,
                [
                  quantityDifference,
                  quantityDifference,
                  chickenId,
                ],
                (flockErr) => {
                  if (flockErr) {
                    console.error(flockErr);
                    return res.status(500).json({
                      message:
                        "Mortality was updated, but flock quantity could not be updated.",
                    });
                  }

                  res.json({
                    message: "Chicken mortality updated successfully!",
                  });
                }
              );
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