const express = require("express");

const router = express.Router();

const rabbitBreedingController = require("../controllers/rabbitBreedingController");

// ======================================
// Rabbit Breeding Routes
// ======================================

// Get all rabbit breeding records
router.get(
  "/",
  rabbitBreedingController.getBreedingRecords
);

// Get breeding history for one rabbit
router.get(
  "/rabbit/:rabbitId",
  rabbitBreedingController.getRabbitBreeding
);

// Add breeding record
router.post(
  "/",
  rabbitBreedingController.createBreedingRecord
);

// Delete breeding record
router.delete(
  "/:id",
  rabbitBreedingController.deleteBreedingRecord
);

module.exports = router;