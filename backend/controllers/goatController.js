const db = require("../db");

// Get all goats
exports.getAllGoats = (req, res) => {
  db.query(
    "SELECT * FROM goats ORDER BY id DESC",
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
          error: err.message,
          code: err.code,
        });
      }

      res.json(results);
    }
  );
};

// Get one goat
exports.getGoatById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM goats WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
          error: err.message,
          code: err.code,
        });
      }

      if (!results.length) {
        return res.status(404).json({
          message: "Goat not found.",
        });
      }

      res.json(results[0]);
    }
  );
};

// Add goat
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

  if (!tag || !breed || !sex) {
    return res.status(400).json({
      message: "Tag, breed and sex are required.",
    });
  }

  const sql = `
    INSERT INTO goats
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      tag,
      name || null,
      breed,
      sex,
      date_of_birth || null,
      weight || null,
      color || null,
      status || "Healthy",
      notes || null,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message: "This tag already exists.",
          });
        }

        return res.status(500).json({
          message: "Database error",
          error: err.message,
          code: err.code,
        });
      }

      res.json({
        message: "Goat added successfully!",
        id: result.insertId,
      });
    }
  );
};

// Update goat
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

  if (!tag || !breed || !sex) {
    return res.status(400).json({
      message: "Tag, breed and sex are required.",
    });
  }

  // Do not allow normal goat editing after the goat has been marked dead.
  db.query(
    "SELECT id, status FROM goats WHERE id = ? LIMIT 1",
    [id],
    (statusErr, rows) => {
      if (statusErr) {
        console.error(statusErr);
        return res.status(500).json({
          message: "Database error",
          error: statusErr.message,
          code: statusErr.code,
        });
      }

      if (!rows.length) {
        return res.status(404).json({
          message: "Goat not found.",
        });
      }

      if (String(rows[0].status).toLowerCase() === "dead") {
        return res.status(409).json({
          message:
            "This goat is dead. No new records can be added or changed for this goat.",
        });
      }

      const sql = `
        UPDATE goats
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
        WHERE id = ?
      `;

      db.query(
        sql,
        [
          tag,
          name || null,
          breed,
          sex,
          date_of_birth || null,
          weight || null,
          color || null,
          status || "Healthy",
          notes || null,
          id,
        ],
        (err, result) => {
          if (err) {
            console.error(err);

            if (err.code === "ER_DUP_ENTRY") {
              return res.status(409).json({
                message: "This tag already exists.",
              });
            }

            return res.status(500).json({
              message: "Database error",
              error: err.message,
              code: err.code,
            });
          }

          if (!result.affectedRows) {
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

exports.deleteGoat = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM goats WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error",
          error: err.message,
          code: err.code,
        });
      }

      if (!result.affectedRows) {
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
