const express = require("express");
const router = express.Router();

const healthController = require("../controllers/healthController");

// Get all health records for one goat
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/:goatId", healthController.getHealthByGoat);

// Add a health record
router.post("/", healthController.addHealthRecord);

// Delete a health record
router.delete("/:id",
  authenticateToken,
  requireAdmin, healthController.deleteHealthRecord);

module.exports = router;