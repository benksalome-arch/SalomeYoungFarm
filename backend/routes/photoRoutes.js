const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const photoController = require("../controllers/photoController");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

// Photo for a newly created goat.
// The controller must reject goats that already have a photo.
router.post(
  "/new/:id",
  authenticateToken,
  upload.single("photo"),
  photoController.uploadPhoto
);

// Replace photo on an existing goat - Admin only
router.post(
  "/:id",
  authenticateToken,
  requireAdmin,
  upload.single("photo"),
  photoController.uploadPhoto
);

// Delete goat photo - Admin only
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  photoController.deletePhoto
);

module.exports = router;
