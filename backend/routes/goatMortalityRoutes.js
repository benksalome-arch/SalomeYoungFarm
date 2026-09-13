const express = require("express");
const router = express.Router();

const goatMortalityController = require("../controllers/goatMortalityController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

// Get all goat mortality records
router.get(
  "/",
  goatMortalityController.getAllGoatMortality
);

// Register goat mortality
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  goatMortalityController.createGoatMortality
);

// Delete mortality record
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  goatMortalityController.deleteGoatMortality
);

module.exports = router;
