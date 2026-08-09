const db = require("../db");
const fs = require("fs");
const path = require("path");

// Get all gallery photos for one goat
exports.getPhotos = (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT * FROM goat_photos WHERE goat_id=? ORDER BY uploaded_at DESC",
        [id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.json(results);
        }
    );
};

// Upload gallery photo
exports.uploadPhoto = (req, res) => {

    const { id } = req.params;

    if (!req.file) {
        return res.status(400).json({
            message: "No photo selected."
        });
    }

    db.query(
        "INSERT INTO goat_photos (goat_id,photo) VALUES (?,?)",
        [
            id,
            req.file.filename
        ],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to upload."
                });
            }

            res.json({
                message: "Gallery photo uploaded successfully."
            });

        }
    );

};

// Delete gallery photo
exports.deletePhoto = (req, res) => {

    const { photoId } = req.params;

    db.query(
        "SELECT * FROM goat_photos WHERE id=?",
        [photoId],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (results.length === 0) {

                return res.status(404).json({
                    message: "Photo not found."
                });

            }

            const photo = results[0];

            const filePath = path.join(
                __dirname,
                "..",
                "uploads",
                "goats",
                photo.photo
            );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            db.query(
                "DELETE FROM goat_photos WHERE id=?",
                [photoId],
                (err) => {

                    if (err) {

                        console.error(err);

                        return res.status(500).json({
                            message: "Delete failed."
                        });

                    }

                    res.json({
                        message: "Photo deleted."
                    });

                }
            );

        }
    );

};