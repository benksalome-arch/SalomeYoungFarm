const express = require("express");
const router = express.Router();

const {
  getWeightHistory,
  addWeightRecord,
} = require("../controllers/weightController");

// Get all weight records for one goat
router.get("/:id", getWeightHistory);

// Add a new weight record
router.post("/", addWeightRecord);

module.exports = router;