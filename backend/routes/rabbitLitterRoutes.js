const express = require("express");
const router = express.Router();

const rabbitLitterController = require("../controllers/rabbitLitterController");

// ======================================
// Rabbit Litter Routes
// ======================================

// Get all litter records
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get(
  "/",
  rabbitLitterController.getLitters
);

// Get litters for one breeding record
router.get(
  "/breeding/:breedingId",
  rabbitLitterController.getBreedingLitters
);

// Add litter record
router.post(
  "/",
  rabbitLitterController.createLitter
);

// Delete litter record
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  rabbitLitterController.deleteLitter
);

module.exports = router;