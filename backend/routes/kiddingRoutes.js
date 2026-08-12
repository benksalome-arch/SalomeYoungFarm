const express = require("express");
const router = express.Router();

const {
  getKidding,
  addKidding,
} = require("../controllers/kiddingController");

// Get all kidding records
router.get("/", getKidding);

// Add kidding record
router.post("/", addKidding);

module.exports = router;
