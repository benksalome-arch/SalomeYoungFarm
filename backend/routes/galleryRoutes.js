const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const galleryController = require("../controllers/galleryController");

// Get all gallery photos for a goat
router.get(
  "/:id",
  galleryController.getPhotos
);

// Upload a gallery photo
router.post(
  "/:id",
  upload.single("photo"),
  galleryController.uploadPhoto
);

// Delete a gallery photo
router.delete(
  "/photo/:photoId",
  galleryController.deletePhoto
);

module.exports = router;