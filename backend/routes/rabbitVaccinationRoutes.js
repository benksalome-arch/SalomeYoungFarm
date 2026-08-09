const express = require("express");
const router = express.Router();

const rabbitVaccinationController = require("../controllers/rabbitVaccinationController");

// Get all rabbit vaccinations
router.get("/", rabbitVaccinationController.getVaccinations);

// Record rabbit vaccination
router.post("/", rabbitVaccinationController.createVaccination);

// Delete rabbit vaccination
router.delete("/:id", rabbitVaccinationController.deleteVaccination);

module.exports = router;