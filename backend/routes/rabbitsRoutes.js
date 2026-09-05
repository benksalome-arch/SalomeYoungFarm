const express = require("express");
const router = express.Router();

const rabbitsController = require("../controllers/rabbitsController");

// ======================================
// Rabbit Routes
// ======================================

// Get all rabbits
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", rabbitsController.getRabbits);

// Get one rabbit
router.get("/:id", rabbitsController.getRabbit);

// Create rabbit
router.post("/", rabbitsController.createRabbit);

// Update rabbit
router.put("/:id",
  authenticateToken,
  requireAdmin, rabbitsController.updateRabbit);

// Delete rabbit
router.delete("/:id",
  authenticateToken,
  requireAdmin, rabbitsController.deleteRabbit);

module.exports = router;