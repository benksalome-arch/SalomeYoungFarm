const express = require("express");
const router = express.Router();

const feedUsageController = require("../controllers/feedUsageController");

// Get all feed usage
router.get("/", feedUsageController.getUsage);

// Record feed usage
router.post("/", feedUsageController.createUsage);

// Delete feed usage
router.delete("/:id", feedUsageController.deleteUsage);

module.exports = router;