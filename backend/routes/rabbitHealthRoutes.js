const express = require("express");

const router = express.Router();

const rabbitHealthController = require("../controllers/rabbitHealthController");

// ======================================
// Rabbit Health Routes
// ======================================

// Get all health records
router.get(
  "/",
  rabbitHealthController.getHealthRecords
);

// Get one rabbit's health history
router.get(
  "/rabbit/:rabbitId",
  rabbitHealthController.getRabbitHealth
);

// Add health record
router.post(
  "/",
  rabbitHealthController.createHealthRecord
);

// Delete health record
router.delete(
  "/:id",
  rabbitHealthController.deleteHealthRecord
);

module.exports = router;