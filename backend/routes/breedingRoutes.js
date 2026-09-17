const express = require("express");
const router = express.Router();

const {
  getBreedingRecords,
  addBreedingRecord,
  markKidding,
  deleteBreedingRecord,
  updateBreedingRecord,
} = require("../controllers/breedingController");

// Get all breeding records
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", getBreedingRecords);

// Add breeding record
router.post("/", addBreedingRecord);

// Mark breeding as kidded
router.put("/:id/kidding",
  authenticateToken,
  requireAdmin, markKidding);

// Delete breeding record
router.put("/:id", updateBreedingRecord);

router.delete("/:id",
  authenticateToken,
  requireAdmin, deleteBreedingRecord);

module.exports = router;