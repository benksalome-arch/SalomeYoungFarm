const db = require("../db");

// =====================================
// Get all goat mortality records
// =====================================

exports.getAllGoatMortality = (req, res) => {
  db.query(
    `SELECT
       gm.id,
       gm.goat_id,
       gm.mortality_date,
       gm.cause,
       gm.notes,
       gm.created_at,
       g.tag,
       g.name,
       g.breed,
       g.sex
     FROM goat_mortality gm
     INNER JOIN goats g ON g.id = gm.goat_id
     ORDER BY gm.mortality_date DESC, gm.id DESC`,
    (err, results) => {
      if (err) {
        console.error("Get goat mortality error:", err);
        return res.status(500).json({
          message: "Database error while loading goat mortality records.",
        });
      }

      res.json(results);
    }
  );
};

// =====================================
// Create goat mortality record
// =====================================

exports.createGoatMortality = (req, res) => {
  const {
    goat_id,
    mortality_date,
    cause,
    notes,
  } = req.body;

  if (!goat_id) {
    return res.status(400).json({
      message: "Goat is required.",
    });
  }

  if (!mortality_date) {
    return res.status(400).json({
      message: "Mortality date is required.",
    });
  }

  // Check that the goat exists
  db.query(
    "SELECT id, status FROM goats WHERE id = ?",
    [goat_id],
    (checkErr, goats) => {
      if (checkErr) {
        console.error("Check goat mortality goat error:", checkErr);
        return res.status(500).json({
          message: "Database error while checking goat.",
        });
      }

      if (goats.length === 0) {
        return res.status(404).json({
          message: "Goat not found.",
        });
      }

      // Prevent registering the same death twice
      db.query(
        "SELECT id FROM goat_mortality WHERE goat_id = ? LIMIT 1",
        [goat_id],
        (existingErr, existing) => {
          if (existingErr) {
            console.error(
              "Check existing goat mortality error:",
              existingErr
            );
            return res.status(500).json({
              message: "Database error while checking mortality record.",
            });
          }

          if (existing.length > 0) {
            return res.status(409).json({
              message: "Mortality has already been registered for this goat.",
            });
          }

          // Save mortality record
          db.query(
            `INSERT INTO goat_mortality
             (goat_id, mortality_date, cause, notes)
             VALUES (?, ?, ?, ?)`,
            [
              goat_id,
              mortality_date,
              cause || null,
              notes || null,
            ],
            (insertErr, result) => {
              if (insertErr) {
                console.error(
                  "Create goat mortality error:",
                  insertErr
                );
                return res.status(500).json({
                  message: "Database error while saving goat mortality.",
                });
              }

              // Mark goat as dead
              db.query(
                `UPDATE goats
                 SET status = 'Dead'
                 WHERE id = ?`,
                [goat_id],
                (updateErr) => {
                  if (updateErr) {
                    console.error(
                      "Update goat status after mortality error:",
                      updateErr
                    );
                    return res.status(500).json({
                      message:
                        "Mortality was saved, but the goat status could not be updated.",
                    });
                  }

                  res.status(201).json({
                    message: "Goat mortality saved successfully!",
                    id: result.insertId,
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

// =====================================
// Get one goat mortality record
// =====================================

exports.getGoatMortalityById = (req, res) => {
  const { id } = req.params;

  db.query(
    `SELECT
       gm.id,
       gm.goat_id,
       gm.mortality_date,
       gm.cause,
       gm.notes,
       g.tag,
       g.name,
       g.breed,
       g.sex
     FROM goat_mortality gm
     INNER JOIN goats g ON g.id = gm.goat_id
     WHERE gm.id = ?`,
    [id],
    (err, results) => {
      if (err) {
        console.error("Get goat mortality by id error:", err);
        return res.status(500).json({
          message: "Database error while loading mortality record.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Mortality record not found.",
        });
      }

      res.json(results[0]);
    }
  );
};


// =====================================
// Update goat mortality record
// =====================================

exports.updateGoatMortality = (req, res) => {
  const { id } = req.params;
  const { mortality_date, cause, notes } = req.body;

  if (!mortality_date) {
    return res.status(400).json({
      message: "Mortality date is required.",
    });
  }

  db.query(
    "SELECT id FROM goat_mortality WHERE id = ?",
    [id],
    (findErr, records) => {
      if (findErr) {
        console.error("Find goat mortality for update error:", findErr);
        return res.status(500).json({
          message: "Database error while finding mortality record.",
        });
      }

      if (records.length === 0) {
        return res.status(404).json({
          message: "Mortality record not found.",
        });
      }

      db.query(
        `UPDATE goat_mortality
         SET mortality_date = ?,
             cause = ?,
             notes = ?
         WHERE id = ?`,
        [
          mortality_date,
          cause || null,
          notes || null,
          id,
        ],
        (updateErr) => {
          if (updateErr) {
            console.error(
              "Update goat mortality error:",
              updateErr
            );

            return res.status(500).json({
              message: "Database error while updating goat mortality.",
            });
          }

          res.json({
            message: "Goat mortality updated successfully!",
          });
        }
      );
    }
  );
};


// =====================================
// Delete goat mortality record
// =====================================

exports.deleteGoatMortality = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT goat_id FROM goat_mortality WHERE id = ?",
    [id],
    (findErr, records) => {
      if (findErr) {
        console.error("Find goat mortality error:", findErr);
        return res.status(500).json({
          message: "Database error while finding mortality record.",
        });
      }

      if (records.length === 0) {
        return res.status(404).json({
          message: "Mortality record not found.",
        });
      }

      const goatId = records[0].goat_id;

      db.query(
        "DELETE FROM goat_mortality WHERE id = ?",
        [id],
        (deleteErr, result) => {
          if (deleteErr) {
            console.error(
              "Delete goat mortality error:",
              deleteErr
            );
            return res.status(500).json({
              message: "Database error while deleting mortality record.",
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Mortality record not found.",
            });
          }

          // Do not automatically resurrect the goat.
          // The administrator can change the goat status manually
          // if the mortality record was entered by mistake.

          res.json({
            message: "Goat mortality record deleted successfully!",
            goat_id: goatId,
          });
        }
      );
    }
  );
};
