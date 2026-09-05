const express = require("express");
const router = express.Router();

const feedController = require("../controllers/feedController");

// Get all feed
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", feedController.getFeeds);

// Get one feed
router.get("/:id", feedController.getFeed);

// Create feed
router.post("/", feedController.createFeed);

// Update feed
router.put("/:id",
  authenticateToken,
  requireAdmin, feedController.updateFeed);

// Delete feed
router.delete("/:id",
  authenticateToken,
  requireAdmin, feedController.deleteFeed);

module.exports = router;