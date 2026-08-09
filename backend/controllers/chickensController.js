const db = require("../db");

// ======================================
// Helper: clean MySQL DATE values
// ======================================

function cleanDate(value) {
  if (!value) {
    return null;
  }

  return String(value).split("T")[0];
}

// ======================================
// Get all chickens
// ======================================

exports.getChickens = (req, res) => {
  db.query(
    "SELECT * FROM chickens ORDER BY created_at DESC",
    (err, results) => {
      if (err) {
        console.error("Get chickens error:", err);

        return res.status(500).json({
          message:
            "Database error while loading chickens.",
        });
      }

      res.json(results);
    }
  );
};

// ======================================
// Get one chicken
// ======================================

exports.getChicken = (req, res) => {
  db.query(
    "SELECT * FROM chickens WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error("Get chicken error:", err);

        return res.status(500).json({
          message:
            "Database error while loading chicken.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Chicken not found.",
        });
      }

      res.json(results[0]);
    }
  );
};

// ======================================
// Create chicken
// ======================================

exports.createChicken = (req, res) => {
  const {
    tag_number,
    name,
    breed,
    type,
    sex,
    hatch_date,
    source,
    quantity,
    status,
    purchase_price,
    notes,
  } = req.body;

  if (!tag_number || !String(tag_number).trim()) {
    return res.status(400).json({
      message: "Chicken tag number is required.",
    });
  }

  db.query(
    "SELECT id FROM chickens WHERE tag_number = ?",
    [tag_number],
    (checkErr, rows) => {
      if (checkErr) {
        console.error(
          "Check chicken tag error:",
          checkErr
        );

        return res.status(500).json({
          message:
            "Database error while checking chicken tag.",
        });
      }

      if (rows.length > 0) {
        return res.status(409).json({
          message: `A chicken with tag ${tag_number} already exists. Please use a different tag.`,
        });
      }

      db.query(
        `INSERT INTO chickens
        (
          tag_number,
          name,
          breed,
          type,
          sex,
          hatch_date,
          source,
          quantity,
          status,
          purchase_price,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tag_number.trim(),
          name || null,
          breed || null,
          type || null,
          sex || null,
          cleanDate(hatch_date),
          source || null,
          quantity === "" ? null : quantity,
          status || "Active",
          purchase_price === ""
            ? null
            : purchase_price,
          notes || null,
        ],
        (err, result) => {
          if (err) {
            console.error(
              "Create chicken error:",
              err
            );

            if (err.code === "ER_DUP_ENTRY") {
              return res.status(409).json({
                message: `A chicken with tag ${tag_number} already exists. Please use a different tag.`,
              });
            }

            return res.status(500).json({
              message:
                "Database error while saving chicken.",
            });
          }

          res.status(201).json({
            message:
              "Chicken added successfully!",
            id: result.insertId,
          });
        }
      );
    }
  );
};

// ======================================
// Update chicken
// ======================================

exports.updateChicken = (req, res) => {
  const { id } = req.params;

  const {
    tag_number,
    name,
    breed,
    type,
    sex,
    hatch_date,
    source,
    quantity,
    status,
    purchase_price,
    notes,
  } = req.body;

  if (!tag_number || !String(tag_number).trim()) {
    return res.status(400).json({
      message: "Chicken tag number is required.",
    });
  }

  db.query(
    `SELECT id
     FROM chickens
     WHERE tag_number = ?
     AND id <> ?`,
    [tag_number, id],
    (checkErr, rows) => {
      if (checkErr) {
        console.error(
          "Check chicken tag during update error:",
          checkErr
        );

        return res.status(500).json({
          message:
            "Database error while checking chicken tag.",
        });
      }

      if (rows.length > 0) {
        return res.status(409).json({
          message: `Another chicken already uses tag ${tag_number}. Please use a different tag.`,
        });
      }

      db.query(
        `UPDATE chickens
         SET
           tag_number = ?,
           name = ?,
           breed = ?,
           type = ?,
           sex = ?,
           hatch_date = ?,
           source = ?,
           quantity = ?,
           status = ?,
           purchase_price = ?,
           notes = ?
         WHERE id = ?`,
        [
          tag_number.trim(),
          name || null,
          breed || null,
          type || null,
          sex || null,
          cleanDate(hatch_date),
          source || null,
          quantity === "" ? null : quantity,
          status || "Active",
          purchase_price === ""
            ? null
            : purchase_price,
          notes || null,
          id,
        ],
        (err, result) => {
          if (err) {
            console.error(
              "Update chicken error:",
              err
            );

            if (err.code === "ER_DUP_ENTRY") {
              return res.status(409).json({
                message: `Another chicken already uses tag ${tag_number}. Please use a different tag.`,
              });
            }

            return res.status(500).json({
              message:
                "Database error while updating chicken.",
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Chicken not found.",
            });
          }

          res.json({
            message:
              "Chicken updated successfully!",
          });
        }
      );
    }
  );
};

// ======================================
// Delete chicken
// ======================================

exports.deleteChicken = (req, res) => {
  db.query(
    "DELETE FROM chickens WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error(
          "Delete chicken error:",
          err
        );

        if (err.code === "ER_ROW_IS_REFERENCED_2") {
          return res.status(409).json({
            message:
              "This chicken cannot be deleted because it has related records such as health, vaccination, mortality, egg production, or egg sales records.",
          });
        }

        return res.status(500).json({
          message:
            "Database error while deleting chicken.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Chicken not found.",
        });
      }

      res.json({
        message:
          "Chicken deleted successfully!",
      });
    }
  );
};