const db = require("../db");

// ===============================
// Get all breeding records
// ===============================
exports.getBreedingRecords = (req, res) => {
  const sql = `
    SELECT
      gb.*,
      d.name AS doe_name,
      b.name AS buck_name,
      DATEDIFF(CURDATE(), gb.mating_date) AS pregnancy_days
    FROM goat_breeding gb
    JOIN goats d ON gb.doe_id = d.id
    JOIN goats b ON gb.buck_id = b.id
    ORDER BY gb.mating_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get breeding records error:", err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
};

// ===============================
// Add breeding record
// ===============================
exports.addBreedingRecord = (req, res) => {
  const {
    doe_id,
    buck_id,
    mating_date,
    expected_kidding,
    veterinarian,
    notes,
  } = req.body;

  // -------------------------------
  // Validate required fields
  // -------------------------------

  if (!doe_id || !buck_id || !mating_date || !expected_kidding) {
    return res.status(400).json({
      message:
        "Doe, buck, mating date and expected kidding date are required.",
    });
  }

  // -------------------------------
  // Check if the same breeding
  // already exists
  // -------------------------------

  const duplicateCheckSql = `
    SELECT id
    FROM goat_breeding
    WHERE doe_id = ?
      AND buck_id = ?
      AND mating_date = ?
    LIMIT 1
  `;

  db.query(
    duplicateCheckSql,
    [doe_id, buck_id, mating_date],
    (checkErr, existingRecords) => {
      if (checkErr) {
        console.error(
          "Check duplicate breeding error:",
          checkErr
        );

        return res.status(500).json({
          message:
            "Database error while checking breeding record.",
        });
      }

      // -------------------------------
      // Duplicate found
      // -------------------------------

      if (existingRecords.length > 0) {
        return res.status(409).json({
          message:
            "This breeding record already exists for this doe, buck and mating date.",
        });
      }

      // -------------------------------
      // Insert new breeding record
      // -------------------------------

      const sql = `
        INSERT INTO goat_breeding
        (
          doe_id,
          buck_id,
          mating_date,
          expected_kidding,
          veterinarian,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          doe_id,
          buck_id,
          mating_date,
          expected_kidding,
          veterinarian || null,
          notes || null,
        ],
        (err, result) => {
          if (err) {
            console.error(
              "Add breeding record error:",
              err
            );

            // Handle duplicate database errors too
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(409).json({
                message:
                  "This breeding record already exists.",
              });
            }

            return res.status(500).json({
              message:
                "Database error while saving breeding record.",
            });
          }

          res.status(201).json({
            message:
              "Breeding record added successfully.",
            id: result.insertId,
          });
        }
      );
    }
  );
};

// ===============================
// Mark breeding as Kidded
// ===============================
exports.markKidding = (req, res) => {
  const { id } = req.params;

  db.query(
    `
    UPDATE goat_breeding
    SET pregnancy_status = 'Kidded'
    WHERE id = ?
    `,
    [id],
    (err, result) => {
      if (err) {
        console.error(
          "Mark breeding as kidded error:",
          err
        );

        return res.status(500).json({
          message: "Database error.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Breeding record not found.",
        });
      }

      res.json({
        message:
          "Breeding record marked as Kidded successfully.",
      });
    }
  );
};

// ===============================
// Update breeding record
// ===============================
exports.updateBreedingRecord = (req, res) => {
  const { id } = req.params;
  const {
    doe_id,
    buck_id,
    mating_date,
    expected_kidding,
    veterinarian,
    notes,
  } = req.body;

  if (!doe_id || !buck_id || !mating_date || !expected_kidding) {
    return res.status(400).json({
      message: "Doe, buck, mating date and expected kidding date are required.",
    });
  }

  if (String(doe_id) === String(buck_id)) {
    return res.status(400).json({
      message: "Doe and buck must be different goats.",
    });
  }

  db.query(
    "SELECT id, sex FROM goats WHERE id IN (?, ?)",
    [doe_id, buck_id],
    (goatErr, goats) => {
      if (goatErr) {
        console.error(goatErr);
        return res.status(500).json({ message: "Database error" });
      }

      const doe = goats.find((g) => String(g.id) === String(doe_id));
      const buck = goats.find((g) => String(g.id) === String(buck_id));

      if (!doe || !buck) {
        return res.status(400).json({
          message: "Selected goats were not found.",
        });
      }

      if (doe.sex !== "Female") {
        return res.status(400).json({
          message: "Selected doe must be female.",
        });
      }

      if (buck.sex !== "Male") {
        return res.status(400).json({
          message: "Selected buck must be male.",
        });
      }

      const sql = `
        UPDATE goat_breeding
        SET
          doe_id = ?,
          buck_id = ?,
          mating_date = ?,
          expected_kidding = ?,
          veterinarian = ?,
          notes = ?
        WHERE id = ?
      `;

      db.query(
        sql,
        [
          doe_id,
          buck_id,
          mating_date,
          expected_kidding,
          veterinarian || null,
          notes || null,
          id,
        ],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              message: err.message,
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Breeding record not found.",
            });
          }

          res.json({
            message: "Breeding record updated successfully.",
          });
        }
      );
    }
  );
};

// ===============================
// Delete breeding record
// ===============================
exports.deleteBreedingRecord = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM goat_breeding WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(
          "Delete breeding record error:",
          err
        );

        return res.status(500).json({
          message:
            "Database error while deleting breeding record.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Breeding record not found.",
        });
      }

      res.json({
        message:
          "Breeding record deleted successfully.",
      });
    }
  );
};