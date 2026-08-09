const db = require("../db");

// =====================================
// Get all goats
// =====================================

exports.getAllGoats = (req, res) => {
  db.query(
    "SELECT * FROM goats ORDER BY id DESC",
    (err, results) => {
      if (err) {
        console.error("Get goats error:", err);

        return res.status(500).json({
          message: "Database error while loading goats.",
        });
      }

      res.json(results);
    }
  );
};

// =====================================
// Get one goat
// =====================================

exports.getGoatById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM goats WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Get goat error:", err);

        return res.status(500).json({
          message: "Database error while loading goat.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Goat not found.",
        });
      }

      res.json(results[0]);
    }
  );
};

// =====================================
// Create goat
// =====================================

exports.createGoat = (req, res) => {
  const {
    tag,
    name,
    breed,
    sex,
    date_of_birth,
    weight,
    color,
    status,
    notes,
  } = req.body;

  // Basic validation
  if (!tag || !String(tag).trim()) {
    return res.status(400).json({
      message: "Ear tag is required.",
    });
  }

  if (!name || !String(name).trim()) {
    return res.status(400).json({
      message: "Goat name is required.",
    });
  }

  // Check whether tag already exists
  db.query(
    "SELECT id FROM goats WHERE tag = ?",
    [tag],
    (checkErr, existing) => {
      if (checkErr) {
        console.error(
          "Check goat tag error:",
          checkErr
        );

        return res.status(500).json({
          message: "Database error while checking goat tag.",
        });
      }

      if (existing.length > 0) {
        return res.status(409).json({
          message: `A goat with tag ${tag} already exists. Please use a different tag.`,
        });
      }

      // Insert goat
      db.query(
        `INSERT INTO goats
        (
          tag,
          name,
          breed,
          sex,
          date_of_birth,
          weight,
          color,
          status,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tag,
          name,
          breed || null,
          sex || null,
          date_of_birth || null,
          weight || null,
          color || null,
          status || "Healthy",
          notes || null,
        ],
        (err, result) => {
          if (err) {
            console.error(
              "Create goat error:",
              err
            );

            // Extra protection if the database
            // itself reports a duplicate tag.
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(409).json({
                message: `A goat with tag ${tag} already exists. Please use a different tag.`,
              });
            }

            return res.status(500).json({
              message: "Database error while saving goat.",
            });
          }

          res.status(201).json({
            message: "Goat saved successfully!",
            id: result.insertId,
          });
        }
      );
    }
  );
};

// =====================================
// Update goat
// =====================================

exports.updateGoat = (req, res) => {
  const { id } = req.params;

  const {
    tag,
    name,
    breed,
    sex,
    date_of_birth,
    weight,
    color,
    status,
    notes,
  } = req.body;

  // Basic validation
  if (!tag || !String(tag).trim()) {
    return res.status(400).json({
      message: "Ear tag is required.",
    });
  }

  if (!name || !String(name).trim()) {
    return res.status(400).json({
      message: "Goat name is required.",
    });
  }

  // Check whether another goat already
  // uses this tag.
  db.query(
    `SELECT id
     FROM goats
     WHERE tag = ?
     AND id != ?`,
    [tag, id],
    (checkErr, existing) => {
      if (checkErr) {
        console.error(
          "Check goat tag during update error:",
          checkErr
        );

        return res.status(500).json({
          message: "Database error while checking goat tag.",
        });
      }

      if (existing.length > 0) {
        return res.status(409).json({
          message: `Another goat already uses tag ${tag}. Please use a different tag.`,
        });
      }

      db.query(
        `UPDATE goats
         SET
           tag = ?,
           name = ?,
           breed = ?,
           sex = ?,
           date_of_birth = ?,
           weight = ?,
           color = ?,
           status = ?,
           notes = ?
         WHERE id = ?`,
        [
          tag,
          name,
          breed || null,
          sex || null,
          date_of_birth || null,
          weight || null,
          color || null,
          status || "Healthy",
          notes || null,
          id,
        ],
        (err, result) => {
          if (err) {
            console.error(
              "Update goat error:",
              err
            );

            if (err.code === "ER_DUP_ENTRY") {
              return res.status(409).json({
                message: `Another goat already uses tag ${tag}. Please use a different tag.`,
              });
            }

            return res.status(500).json({
              message: "Database error while updating goat.",
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Goat not found.",
            });
          }

          res.json({
            message: "Goat updated successfully!",
          });
        }
      );
    }
  );
};

// =====================================
// Delete goat
// =====================================

exports.deleteGoat = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM goats WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(
          "Delete goat error:",
          err
        );

        // Foreign-key protection
        if (err.code === "ER_ROW_IS_REFERENCED_2") {
          return res.status(409).json({
            message:
              "This goat cannot be deleted because it has related records such as health, weight, breeding, or other farm records.",
          });
        }

        return res.status(500).json({
          message: "Database error while deleting goat.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Goat not found.",
        });
      }

      res.json({
        message: "Goat deleted successfully!",
      });
    }
  );
};