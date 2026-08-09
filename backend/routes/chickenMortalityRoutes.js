const express = require("express");
const router = express.Router();

const chickenMortalityController = require("../controllers/chickenMortalityController");

// Get all mortality records
router.get("/", chickenMortalityController.getMortality);

// Record mortality
router.post("/", chickenMortalityController.createMortality);

// Delete mortality record
router.delete("/:id", chickenMortalityController.deleteMortality);

module.exports = router;