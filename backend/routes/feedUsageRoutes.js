const express = require("express");
const router = express.Router();

const feedUsageController = require("../controllers/feedUsageController");

// Get all feed usage
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", feedUsageController.getUsage);

// Record feed usage
router.post("/", feedUsageController.createUsage);

// Delete feed usage
router.delete("/:id",
  authenticateToken,
  requireAdmin, feedUsageController.deleteUsage);

module.exports = router;