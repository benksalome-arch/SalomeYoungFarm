const express = require("express");
const router = express.Router();

const rabbitVaccinationController = require("../controllers/rabbitVaccinationController");

// Get all rabbit vaccinations
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", rabbitVaccinationController.getVaccinations);

// Record rabbit vaccination
router.post("/", rabbitVaccinationController.createVaccination);

// Delete rabbit vaccination
router.delete("/:id",
  authenticateToken,
  requireAdmin, rabbitVaccinationController.deleteVaccination);

module.exports = router;