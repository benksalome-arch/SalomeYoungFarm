const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const photoController = require("../controllers/photoController");

// Upload goat photo
router.post(
  "/:id",
  upload.single("photo"),
  photoController.uploadPhoto
);

// Delete goat photo
router.delete(
  "/:id",
  photoController.deletePhoto
);

module.exports = router;