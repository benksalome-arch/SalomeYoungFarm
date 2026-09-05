const express = require("express");
const router = express.Router();

const chickenVaccinationController = require("../controllers/chickenVaccinationController");

// Get all vaccinations
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", chickenVaccinationController.getVaccinations);

// Record vaccination
router.post("/", chickenVaccinationController.createVaccination);

// Delete vaccination
router.delete("/:id",
  authenticateToken,
  requireAdmin, chickenVaccinationController.deleteVaccination);

module.exports = router;