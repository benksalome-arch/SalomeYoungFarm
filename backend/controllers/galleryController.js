const db = require("../db");

// Get goat photos
exports.getPhotos = (req, res) => {
  const { goatId } = req.params;

  db.query(
    "SELECT * FROM goat_photos WHERE goat_id = ? ORDER BY uploaded_at DESC",
    [goatId],
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

// Add goat photo
exports.uploadPhoto = (req, res) => {
  const { goat_id } = req.body;

  if (!goat_id) {
    return res.status(400).json({
      message: "Goat is required.",
    });
  }

  db.query(
    "SELECT id, status FROM goats WHERE id = ? LIMIT 1",
    [goat_id],
    (statusErr, rows) => {
      if (statusErr) {
        console.error(statusErr);
        return res.status(500).json({
          message: "Database error",
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

      const photo = req.file ? req.file.buffer : null;

      if (!photo) {
        return res.status(400).json({
          message: "Photo is required.",
        });
      }

      db.query(
        "INSERT INTO goat_photos (goat_id, photo) VALUES (?, ?)",
        [goat_id, photo],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              message: "Database error",
            });
          }

          res.json({
            message: "Photo uploaded successfully!",
            id: result.insertId,
          });
        }
      );
    }
  );
};

// Delete goat photo
exports.deletePhoto = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM goat_photos WHERE id = ?",
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
          message: "Photo not found.",
        });
      }

      res.json({
        message: "Photo deleted successfully!",
      });
    }
  );
};