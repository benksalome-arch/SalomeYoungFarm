const express = require("express");
const router = express.Router();

const {
  getBreedingRecords,
  addBreedingRecord,
  markKidding,
  deleteBreedingRecord,
} = require("../controllers/breedingController");

// Get all breeding records
router.get("/", getBreedingRecords);

// Add breeding record
router.post("/", addBreedingRecord);

// Mark breeding as kidded
router.put("/:id/kidding", markKidding);

// Delete breeding record
router.delete("/:id", deleteBreedingRecord);

module.exports = router;