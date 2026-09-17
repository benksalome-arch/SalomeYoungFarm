const express = require("express");
const router = express.Router();

const {
  getKidding,
  addKidding,
  updateKidding,
  deleteKidding,
} = require("../controllers/kiddingController");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

// Get all kidding records
router.get("/", getKidding);

// Add kidding record
router.post("/", addKidding);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  updateKidding
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteKidding
);

module.exports = router;
