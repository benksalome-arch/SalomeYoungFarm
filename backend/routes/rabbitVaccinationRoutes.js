const express = require("express");
const router = express.Router();

const rabbitVaccinationController = require("../controllers/rabbitVaccinationController");

// Get all rabbit vaccinations
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", rabbitVaccinationController.getVaccinations);

router.get("/:id", rabbitVaccinationController.getVaccinationById);

// Record rabbit vaccination
router.post("/", rabbitVaccinationController.createVaccination);

router.put("/:id", authenticateToken, requireAdmin, rabbitVaccinationController.updateVaccination);

// Delete rabbit vaccination
router.delete("/:id",
  authenticateToken,
  requireAdmin, rabbitVaccinationController.deleteVaccination);

module.exports = router;