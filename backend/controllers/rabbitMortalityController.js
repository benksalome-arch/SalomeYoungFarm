const db = require("../db");

// ======================================
// Get all rabbit mortality records
// ======================================

exports.getMortality = (req, res) => {
  db.query(
    `SELECT
        rm.*,
        r.tag,
        r.name
     FROM rabbit_mortality rm
     JOIN rabbits r
       ON rm.rabbit_id = r.id
     ORDER BY rm.mortality_date DESC, rm.id DESC`,
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
// Record rabbit mortality
// ======================================

exports.createMortality = (req, res) => {
  const {
    rabbit_id,
    mortality_date,
    quantity,
    cause,
    notes,
  } = req.body;

  if (!rabbit_id || !mortality_date || !quantity) {
    return res.status(400).json({
      message:
        "Rabbit, mortality date, and quantity are required.",
    });
  }

  if (Number(quantity) <= 0) {
    return res.status(400).json({
      message:
        "Mortality quantity must be greater than zero.",
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

      const rabbit = rabbits[0];

      if (Number(quantity) > Number(rabbit.quantity)) {
        return res.status(400).json({
          message:
            "Mortality quantity exceeds rabbit quantity.",
        });
      }

      db.query(
        `INSERT INTO rabbit_mortality
        (
          rabbit_id,
          mortality_date,
          quantity,
          cause,
          notes
        )
        VALUES (?,?,?,?,?)`,
        [
          rabbit_id,
          mortality_date,
          quantity,
          cause || null,
          notes || null,
        ],
        (insertErr, result) => {
          if (insertErr) {
            console.error(insertErr);

            return res.status(500).json({
              message: "Database error",
            });
          }

          db.query(
            "UPDATE rabbits SET quantity = quantity - ? WHERE id=?",
            [
              quantity,
              rabbit_id,
            ],
            (updateErr) => {
              if (updateErr) {
                console.error(updateErr);

                return res.status(500).json({
                  message:
                    "Mortality was recorded, but rabbit quantity could not be updated.",
                });
              }

              res.json({
                message:
                  "Rabbit mortality recorded successfully!",
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
    rabbit_id,
    mortality_date,
    quantity,
    cause,
    notes,
  } = req.body;

  if (!rabbit_id || !mortality_date || !quantity) {
    return res.status(400).json({
      message:
        "Rabbit, mortality date, and quantity are required.",
    });
  }

  if (Number(quantity) <= 0) {
    return res.status(400).json({
      message:
        "Mortality quantity must be greater than zero.",
    });
  }

  db.query(
    "SELECT * FROM rabbit_mortality WHERE id=?",
    [mortalityId],
    (err, records) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (records.length === 0) {
        return res.status(404).json({
          message: "Mortality record not found.",
        });
      }

      const oldMortality = records[0];

      db.query(
        "SELECT * FROM rabbits WHERE id=?",
        [rabbit_id],
        (rabbitErr, rabbits) => {
          if (rabbitErr) {
            console.error(rabbitErr);
            return res.status(500).json({
              message: "Database error",
            });
          }

          if (rabbits.length === 0) {
            return res.status(404).json({
              message: "Rabbit not found.",
            });
          }

          const rabbit = rabbits[0];

          // If the rabbit changes, restore the old rabbit's quantity first.
          const oldRabbitId = oldMortality.rabbit_id;
          const oldQuantity = Number(oldMortality.quantity);
          const newQuantity = Number(quantity);

          if (oldRabbitId === Number(rabbit_id)) {
            const availableQuantity =
              Number(rabbit.quantity) + oldQuantity;

            if (newQuantity > availableQuantity) {
              return res.status(400).json({
                message:
                  "Mortality quantity exceeds rabbit quantity.",
              });
            }

            const difference = newQuantity - oldQuantity;

            db.query(
              `UPDATE rabbit_mortality
               SET rabbit_id=?,
                   mortality_date=?,
                   quantity=?,
                   cause=?,
                   notes=?
               WHERE id=?`,
              [
                rabbit_id,
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

                if (difference === 0) {
                  return res.json({
                    message:
                      "Rabbit mortality record updated successfully!",
                  });
                }

                db.query(
                  "UPDATE rabbits SET quantity = quantity - ? WHERE id=?",
                  [difference, rabbit_id],
                  (quantityErr) => {
                    if (quantityErr) {
                      console.error(quantityErr);
                      return res.status(500).json({
                        message:
                          "Mortality record was updated, but rabbit quantity could not be updated.",
                      });
                    }

                    res.json({
                      message:
                        "Rabbit mortality record updated successfully!",
                    });
                  }
                );
              }
            );

            return;
          }

          // Different rabbit: restore old rabbit first.
          db.query(
            "UPDATE rabbits SET quantity = quantity + ? WHERE id=?",
            [oldQuantity, oldRabbitId],
            (restoreErr) => {
              if (restoreErr) {
                console.error(restoreErr);
                return res.status(500).json({
                  message:
                    "Could not restore the previous rabbit quantity.",
                });
              }

              if (newQuantity > Number(rabbit.quantity)) {
                return res.status(400).json({
                  message:
                    "Mortality quantity exceeds rabbit quantity.",
                });
              }

              db.query(
                "UPDATE rabbits SET quantity = quantity - ? WHERE id=?",
                [newQuantity, rabbit_id],
                (subtractErr) => {
                  if (subtractErr) {
                    console.error(subtractErr);
                    return res.status(500).json({
                      message:
                        "Could not update the new rabbit quantity.",
                    });
                  }

                  db.query(
                    `UPDATE rabbit_mortality
                     SET rabbit_id=?,
                         mortality_date=?,
                         quantity=?,
                         cause=?,
                         notes=?
                     WHERE id=?`,
                    [
                      rabbit_id,
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

                      res.json({
                        message:
                          "Rabbit mortality record updated successfully!",
                      });
                    }
                  );
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
  const mortalityId = req.params.id;

  // Find the mortality record first
  db.query(
    "SELECT * FROM rabbit_mortality WHERE id=?",
    [mortalityId],
    (err, records) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (records.length === 0) {
        return res.status(404).json({
          message: "Mortality record not found.",
        });
      }

      const mortality = records[0];

      // Restore rabbit quantity
      db.query(
        "UPDATE rabbits SET quantity = quantity + ? WHERE id=?",
        [
          mortality.quantity,
          mortality.rabbit_id,
        ],
        (updateErr) => {
          if (updateErr) {
            console.error(updateErr);

            return res.status(500).json({
              message:
                "Could not restore rabbit quantity.",
            });
          }

          // Delete mortality record
          db.query(
            "DELETE FROM rabbit_mortality WHERE id=?",
            [mortalityId],
            (deleteErr) => {
              if (deleteErr) {
                console.error(deleteErr);

                return res.status(500).json({
                  message:
                    "Rabbit quantity was restored, but the mortality record could not be deleted.",
                });
              }

              res.json({
                message:
                  "Rabbit mortality record deleted successfully and rabbit quantity restored!",
              });
            }
          );
        }
      );
    }
  );
};