const express = require("express");
const router = express.Router();

const feedController = require("../controllers/feedController");

// Get all feed
router.get("/", feedController.getFeeds);

// Get one feed
router.get("/:id", feedController.getFeed);

// Create feed
router.post("/", feedController.createFeed);

// Update feed
router.put("/:id", feedController.updateFeed);

// Delete feed
router.delete("/:id", feedController.deleteFeed);

module.exports = router;