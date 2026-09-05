const express = require("express");
const router = express.Router();

const chickensController = require("../controllers/chickensController");

// Get all chickens
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", chickensController.getChickens);

// Get one chicken
router.get("/:id", chickensController.getChicken);

// Add chicken
router.post("/", chickensController.createChicken);

// Update chicken
router.put("/:id",
  authenticateToken,
  requireAdmin, chickensController.updateChicken);

// Delete chicken
router.delete("/:id",
  authenticateToken,
  requireAdmin, chickensController.deleteChicken);

module.exports = router;