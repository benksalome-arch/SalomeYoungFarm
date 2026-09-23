const db = require("../db");

// Get all kidding records
exports.getKidding = (req, res) => {
  const sql = `
    SELECT
      k.*,
      b.doe_id,
      b.buck_id,
      doe.name AS doe_name,
      doe.tag AS doe_earTag,
      buck.name AS buck_name,
      buck.tag AS buck_earTag
    FROM goat_kidding k
    LEFT JOIN goat_breeding b ON k.breeding_id = b.id
    LEFT JOIN goats doe ON b.doe_id = doe.id
    LEFT JOIN goats buck ON b.buck_id = buck.id
    ORDER BY k.kidding_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get kidding records error:", err.code, err.sqlMessage, err.sql);
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
};

// Get one kidding record
exports.getKiddingById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      k.*,
      b.doe_id,
      b.buck_id,
      doe.name AS doe_name,
      doe.tag AS doe_earTag,
      buck.name AS buck_name,
      buck.tag AS buck_earTag
    FROM goat_kidding k
    LEFT JOIN goat_breeding b ON k.breeding_id = b.id
    LEFT JOIN goats doe ON b.doe_id = doe.id
    LEFT JOIN goats buck ON b.buck_id = buck.id
    WHERE k.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (!results.length) {
      return res.status(404).json({
        message: "Kidding record not found.",
      });
    }

    res.json(results[0]);
  });
};

// Add kidding record
exports.addKidding = (req, res) => {
  const {
    breeding_id,
    kidding_date,
    male_kids,
    female_kids,
    stillborn,
    notes,
  } = req.body;

  if (!breeding_id || !kidding_date) {
    return res.status(400).json({
      message: "Breeding record and kidding date are required.",
    });
  }

  const goatStatusSql = `
    SELECT
      b.id AS breeding_id,
      doe.id AS doe_id,
      doe.name AS doe_name,
      doe.status AS doe_status,
      buck.id AS buck_id,
      buck.name AS buck_name,
      buck.status AS buck_status
    FROM goat_breeding b
    LEFT JOIN goats doe ON b.doe_id = doe.id
    LEFT JOIN goats buck ON b.buck_id = buck.id
    WHERE b.id = ?
    LIMIT 1
  `;

  db.query(goatStatusSql, [breeding_id], (statusErr, rows) => {
    if (statusErr) {
      console.error(statusErr);
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (!rows.length) {
      return res.status(404).json({
        message: "Breeding record not found.",
      });
    }

    const breeding = rows[0];

    if (
      String(breeding.doe_status).toLowerCase() === "dead" ||
      String(breeding.buck_status).toLowerCase() === "dead"
    ) {
      return res.status(409).json({
        message:
          "This goat is dead. No new records can be added or changed for this goat.",
      });
    }

    const insertSql = `
      INSERT INTO goat_kidding
      (
        breeding_id,
        kidding_date,
        male_kids,
        female_kids,
        stillborn,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [
        breeding_id,
        kidding_date,
        male_kids || 0,
        female_kids || 0,
        stillborn || 0,
        notes,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Database error",
          });
        }

        db.query(
          `UPDATE goat_breeding
           SET pregnancy_status = 'Kidded'
           WHERE id = ?`,
          [breeding_id],
          (updateErr) => {
            if (updateErr) {
              console.error(updateErr);
            }
          }
        );

        res.json({
          message: "Kidding record added successfully!",
          id: result.insertId,
        });
      }
    );
  });
};

// Update kidding record
exports.updateKidding = (req, res) => {
  const { id } = req.params;

  const {
    breeding_id,
    kidding_date,
    male_kids,
    female_kids,
    stillborn,
    notes,
  } = req.body;

  if (!breeding_id || !kidding_date) {
    return res.status(400).json({
      message: "Breeding record and kidding date are required.",
    });
  }

  const goatStatusSql = `
    SELECT
      b.id AS breeding_id,
      doe.id AS doe_id,
      doe.name AS doe_name,
      doe.status AS doe_status,
      buck.id AS buck_id,
      buck.name AS buck_name,
      buck.status AS buck_status
    FROM goat_breeding b
    LEFT JOIN goats doe ON b.doe_id = doe.id
    LEFT JOIN goats buck ON b.buck_id = buck.id
    WHERE b.id = ?
    LIMIT 1
  `;

  db.query(goatStatusSql, [breeding_id], (statusErr, rows) => {
    if (statusErr) {
      console.error(statusErr);
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (!rows.length) {
      return res.status(404).json({
        message: "Breeding record not found.",
      });
    }

    const breeding = rows[0];

    if (
      String(breeding.doe_status).toLowerCase() === "dead" ||
      String(breeding.buck_status).toLowerCase() === "dead"
    ) {
      return res.status(409).json({
        message:
          "This goat is dead. No new records can be added or changed for this goat.",
      });
    }

    const updateSql = `
      UPDATE goat_kidding
      SET
        breeding_id = ?,
        kidding_date = ?,
        male_kids = ?,
        female_kids = ?,
        stillborn = ?,
        notes = ?
      WHERE id = ?
    `;

    db.query(
      updateSql,
      [
        breeding_id,
        kidding_date,
        male_kids || 0,
        female_kids || 0,
        stillborn || 0,
        notes,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (!result.affectedRows) {
          return res.status(404).json({
            message: "Kidding record not found.",
          });
        }

        db.query(
          `UPDATE goat_breeding
           SET pregnancy_status = 'Kidded'
           WHERE id = ?`,
          [breeding_id],
          (updateErr) => {
            if (updateErr) {
              console.error(updateErr);
            }
          }
        );

        res.json({
          message: "Kidding record updated successfully!",
        });
      }
    );
  });
};

// Delete kidding record
exports.deleteKidding = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM goat_kidding WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          message: "Kidding record not found.",
        });
      }

      res.json({
        message: "Kidding record deleted successfully!",
      });
    }
  );
};