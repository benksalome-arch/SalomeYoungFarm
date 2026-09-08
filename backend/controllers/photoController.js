const db = require("../db");
const fs = require("fs");
const path = require("path");
const { put, del } = require("@vercel/blob");

function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

function isBlobUrl(value) {
  return typeof value === "string" && value.startsWith("https://");
}

// Upload goat photo
exports.uploadPhoto = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({
      message: "No photo selected.",
    });
  }

  try {
    const results = await query(
      "SELECT photo FROM goats WHERE id=?",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "Goat not found.",
      });
    }

    const oldPhoto = results[0].photo;

    // Only allow non-admin users to attach a photo to a goat
    // that does not already have one.
    if (oldPhoto && req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Administrator access required to replace a goat photo.",
      });
    }

    const fileBuffer = req.file.buffer;

    const blob = await put(
      `goats/${Date.now()}-${req.file.originalname}`,
      fileBuffer,
      {
        access: "public",
        contentType: req.file.mimetype,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    if (oldPhoto) {
      try {
        if (isBlobUrl(oldPhoto)) {
          await del(oldPhoto);
        } else {
          const oldPath = path.join(
            __dirname,
            "..",
            "uploads",
            "goats",
            oldPhoto
          );

          if (fs.existsSync(oldPath)) {
            await fs.promises.unlink(oldPath);
          }
        }
      } catch (deleteErr) {
        console.error("Old photo delete error:", deleteErr);
      }
    }

    await query(
      "UPDATE goats SET photo=? WHERE id=?",
      [blob.url, id]
    );

    return res.json({
      message: "Photo uploaded successfully!",
      photo: blob.url,
    });
  } catch (err) {
    console.error("Photo upload error:", err);

    return res.status(500).json({
      message: "Failed to upload photo.",
    });
  }
};

// Delete goat photo
exports.deletePhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const results = await query(
      "SELECT photo FROM goats WHERE id=?",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "Goat not found.",
      });
    }

    const photo = results[0].photo;

    if (photo) {
      if (isBlobUrl(photo)) {
        await del(photo);
      } else {
        const photoPath = path.join(
          __dirname,
          "..",
          "uploads",
          "goats",
          photo
        );

        if (fs.existsSync(photoPath)) {
          await fs.promises.unlink(photoPath);
        }
      }
    }

    await query(
      "UPDATE goats SET photo=NULL WHERE id=?",
      [id]
    );

    return res.json({
      message: "Photo removed successfully!",
    });
  } catch (err) {
    console.error("Photo delete error:", err);

    return res.status(500).json({
      message: "Failed to delete photo.",
    });
  }
};
