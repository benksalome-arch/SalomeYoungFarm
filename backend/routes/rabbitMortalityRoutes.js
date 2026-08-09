const express = require("express");
const router = express.Router();

const rabbitMortalityController = require("../controllers/rabbitMortalityController");

// ======================================
// Rabbit Mortality Routes
// ======================================

// Get all mortality records
router.get(
  "/",
  rabbitMortalityController.getMortality
);

// Record mortality
router.post(
  "/",
  rabbitMortalityController.createMortality
);

// Delete mortality record
router.delete(
  "/:id",
  rabbitMortalityController.deleteMortality
);

module.exports = router;