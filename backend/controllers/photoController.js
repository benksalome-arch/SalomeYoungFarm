const db = require("../db");
const fs = require("fs");
const path = require("path");

// Upload goat photo
exports.uploadPhoto = (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({
      message: "No photo selected.",
    });
  }

  db.query(
    "SELECT photo FROM goats WHERE id=?",
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Goat not found.",
        });
      }

      const oldPhoto = results[0].photo;

      if (oldPhoto) {
        const oldPath = path.join(
          __dirname,
          "..",
          "uploads",
          "goats",
          oldPhoto
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      db.query(
        "UPDATE goats SET photo=? WHERE id=?",
        [req.file.filename, id],
        (err) => {
          if (err) {
            console.error(err);

            return res.status(500).json({
              message: "Failed to save photo.",
            });
          }

          res.json({
            message: "Photo uploaded successfully!",
            filename: req.file.filename,
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
    "SELECT photo FROM goats WHERE id=?",
    [id],
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Goat not found.",
        });
      }

      const photo = results[0].photo;

      if (photo) {
        const photoPath = path.join(
          __dirname,
          "..",
          "uploads",
          "goats",
          photo
        );

        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      }

      db.query(
        "UPDATE goats SET photo=NULL WHERE id=?",
        [id],
        (err) => {
          if (err) {
            console.error(err);

            return res.status(500).json({
              message: "Database error.",
            });
          }

          res.json({
            message: "Photo removed successfully!",
          });
        }
      );
    }
  );
};