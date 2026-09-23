const db = require("../db");

// Get all breeding records
exports.getBreedingRecords = (req, res) => {
  const sql = `
    SELECT
      gb.*,
      doe.name AS doe_name,
      doe.earTag AS doe_earTag,
      buck.name AS buck_name,
      buck.earTag AS buck_earTag,
      DATEDIFF(CURDATE(), gb.mating_date) AS pregnancy_days
    FROM goat_breeding gb
    JOIN goats doe ON gb.doe_id = doe.id
    JOIN goats buck ON gb.buck_id = buck.id
    ORDER BY gb.mating_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get breeding records error:", err.code, err.sqlMessage, err.sql);
      return res.status(500).json({
        message: "Database error.",
      });
    }

    res.json(results);
  });
};

// Get one breeding record
exports.getBreedingRecord = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      gb.*,
      doe.name AS doe_name,
      doe.earTag AS doe_earTag,
      buck.name AS buck_name,
      buck.earTag AS buck_earTag
    FROM goat_breeding gb
    JOIN goats doe ON gb.doe_id = doe.id
    JOIN goats buck ON gb.buck_id = buck.id
    WHERE gb.id = ?
    LIMIT 1
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Get breeding record error:", err);
      return res.status(500).json({
        message: "Database error.",
      });
    }

    if (!results.length) {
      return res.status(404).json({
        message: "Breeding record not found.",
      });
    }

    res.json(results[0]);
  });
};

// Add breeding record
exports.addBreedingRecord = (req, res) => {
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
      message:
        "Doe, buck, mating date and expected kidding date are required.",
    });
  }

  if (String(doe_id) === String(buck_id)) {
    return res.status(400).json({
      message: "Doe and buck must be different goats.",
    });
  }

  db.query(
    "SELECT id, sex, status FROM goats WHERE id IN (?, ?)",
    [doe_id, buck_id],
    (goatErr, goats) => {
      if (goatErr) {
        console.error(goatErr);
        return res.status(500).json({
          message: "Database error",
        });
      }

      const doe = goats.find((g) => String(g.id) === String(doe_id));
      const buck = goats.find((g) => String(g.id) === String(buck_id));

      if (!doe || !buck) {
        return res.status(400).json({
          message: "Selected goats were not found.",
        });
      }

      if (
        String(doe.status).toLowerCase() === "dead" ||
        String(buck.status).toLowerCase() === "dead"
      ) {
        return res.status(409).json({
          message:
            "This goat is dead. No new records can be added or changed for this goat.",
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

      db.query(
        `
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
        `,
        [
          doe_id,
          buck_id,
          mating_date,
          expected_kidding,
          veterinarian,
          notes,
        ],
        (err, result) => {
          if (err) {
            console.error("Add breeding record error:", err);
            return res.status(500).json({
              message: "Database error.",
            });
          }

          res.status(201).json({
            message: "Breeding record added successfully!",
            id: result.insertId,
          });
        }
      );
    }
  );
};

// Mark breeding as Kidded
exports.markKidding = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      doe.status AS doe_status,
      buck.status AS buck_status
    FROM goat_breeding b
    LEFT JOIN goats doe ON b.doe_id = doe.id
    LEFT JOIN goats buck ON b.buck_id = buck.id
    WHERE b.id = ?
    LIMIT 1
  `;

  db.query(sql, [id], (statusErr, rows) => {
    if (statusErr) {
      console.error(statusErr);
      return res.status(500).json({
        message: "Database error.",
      });
    }

    if (!rows.length) {
      return res.status(404).json({
        message: "Breeding record not found.",
      });
    }

    const { doe_status, buck_status } = rows[0];

    if (
      String(doe_status).toLowerCase() === "dead" ||
      String(buck_status).toLowerCase() === "dead"
    ) {
      return res.status(409).json({
        message:
          "This goat is dead. No new records can be added or changed for this goat.",
      });
    }

    db.query(
      `
        UPDATE goat_breeding
        SET pregnancy_status = 'Kidded'
        WHERE id = ?
      `,
      [id],
      (err, result) => {
        if (err) {
          console.error("Mark breeding as kidded error:", err);

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
          message: "Breeding record marked as Kidded successfully.",
        });
      }
    );
  });
};

// Update breeding record
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
      message:
        "Doe, buck, mating date and expected kidding date are required.",
    });
  }

  if (String(doe_id) === String(buck_id)) {
    return res.status(400).json({
      message: "Doe and buck must be different goats.",
    });
  }

  db.query(
    "SELECT id, sex, status FROM goats WHERE id IN (?, ?)",
    [doe_id, buck_id],
    (goatErr, goats) => {
      if (goatErr) {
        console.error(goatErr);
        return res.status(500).json({
          message: "Database error",
        });
      }

      const doe = goats.find((g) => String(g.id) === String(doe_id));
      const buck = goats.find((g) => String(g.id) === String(buck_id));

      if (!doe || !buck) {
        return res.status(400).json({
          message: "Selected goats were not found.",
        });
      }

      if (
        String(doe.status).toLowerCase() === "dead" ||
        String(buck.status).toLowerCase() === "dead"
      ) {
        return res.status(409).json({
          message:
            "This goat is dead. No new records can be added or changed for this goat.",
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

      db.query(
        `
          UPDATE goat_breeding
          SET
            doe_id = ?,
            buck_id = ?,
            mating_date = ?,
            expected_kidding = ?,
            veterinarian = ?,
            notes = ?
          WHERE id = ?
        `,
        [
          doe_id,
          buck_id,
          mating_date,
          expected_kidding,
          veterinarian,
          notes,
          id,
        ],
        (err, result) => {
          if (err) {
            console.error("Update breeding record error:", err);
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
            message: "Breeding record updated successfully!",
          });
        }
      );
    }
  );
};

// Delete breeding record
exports.deleteBreedingRecord = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM goat_breeding WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Delete breeding record error:", err);
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
        message: "Breeding record deleted successfully!",
      });
    }
  );
};