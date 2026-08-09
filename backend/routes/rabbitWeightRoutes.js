const express = require("express");
const router = express.Router();

const rabbitWeightController = require("../controllers/rabbitWeightController");

// ======================================
// Rabbit Weight Routes
// ======================================

// Get all rabbit weight records
router.get(
  "/",
  rabbitWeightController.getWeightRecords
);

// Get one rabbit's weight history
router.get(
  "/rabbit/:rabbitId",
  rabbitWeightController.getRabbitWeight
);

// Add weight record
router.post(
  "/",
  rabbitWeightController.createWeightRecord
);

// Delete weight record
router.delete(
  "/:id",
  rabbitWeightController.deleteWeightRecord
);

module.exports = router;