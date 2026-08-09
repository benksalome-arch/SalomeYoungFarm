const express = require("express");
const router = express.Router();

const chickenVaccinationController = require("../controllers/chickenVaccinationController");

// Get all vaccinations
router.get("/", chickenVaccinationController.getVaccinations);

// Record vaccination
router.post("/", chickenVaccinationController.createVaccination);

// Delete vaccination
router.delete("/:id", chickenVaccinationController.deleteVaccination);

module.exports = router;