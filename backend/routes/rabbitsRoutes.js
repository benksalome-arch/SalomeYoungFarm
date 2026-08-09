const express = require("express");
const router = express.Router();

const rabbitsController = require("../controllers/rabbitsController");

// ======================================
// Rabbit Routes
// ======================================

// Get all rabbits
router.get("/", rabbitsController.getRabbits);

// Get one rabbit
router.get("/:id", rabbitsController.getRabbit);

// Create rabbit
router.post("/", rabbitsController.createRabbit);

// Update rabbit
router.put("/:id", rabbitsController.updateRabbit);

// Delete rabbit
router.delete("/:id", rabbitsController.deleteRabbit);

module.exports = router;