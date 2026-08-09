const express = require("express");
const router = express.Router();

const rabbitLitterController = require("../controllers/rabbitLitterController");

// ======================================
// Rabbit Litter Routes
// ======================================

// Get all litter records
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
  rabbitLitterController.deleteLitter
);

module.exports = router;