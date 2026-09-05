const express = require("express");
const router = express.Router();

const rabbitMortalityController = require("../controllers/rabbitMortalityController");

// ======================================
// Rabbit Mortality Routes
// ======================================

// Get all mortality records
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

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
  authenticateToken,
  requireAdmin,
  rabbitMortalityController.deleteMortality
);

module.exports = router;