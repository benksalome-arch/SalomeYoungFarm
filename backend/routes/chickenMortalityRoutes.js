const express = require("express");
const router = express.Router();

const chickenMortalityController = require("../controllers/chickenMortalityController");

// Get all mortality records
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", chickenMortalityController.getMortality);

// Record mortality
router.post("/", chickenMortalityController.createMortality);

// Update mortality record
router.put("/:id",
  authenticateToken,
  requireAdmin,
  chickenMortalityController.updateMortality);

// Delete mortality record
router.delete("/:id",
  authenticateToken,
  requireAdmin, chickenMortalityController.deleteMortality);

module.exports = router;