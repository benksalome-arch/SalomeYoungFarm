const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const photoController = require("../controllers/photoController");

// Upload goat photo
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.post(
  "/:id",
  upload.single("photo"),
  photoController.uploadPhoto
);

// Delete goat photo
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  photoController.deletePhoto
);

module.exports = router;