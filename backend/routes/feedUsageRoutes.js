const express = require("express");
const router = express.Router();

const feedUsageController = require("../controllers/feedUsageController");

// Get all feed usage
const {
  authenticateToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

router.get("/", feedUsageController.getUsage);
router.get("/:id", feedUsageController.getUsageById);

// Record feed usage
router.post("/", feedUsageController.createUsage);
router.put("/:id", authenticateToken, requireAdminOrManager, feedUsageController.updateUsage);

// Delete feed usage
router.delete(
  "/:id",
  authenticateToken,
  requireAdminOrManager,
  feedUsageController.deleteUsage
);

module.exports = router;