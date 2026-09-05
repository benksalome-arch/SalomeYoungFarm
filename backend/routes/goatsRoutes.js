const express = require("express");
const router = express.Router();

const goatController = require("../controllers/goatController");

// Get all goats
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", goatController.getAllGoats);

// Get one goat
router.get("/:id", goatController.getGoatById);

// Add a new goat
router.post("/", goatController.createGoat);

// Update a goat
router.put("/:id",
  authenticateToken,
  requireAdmin, goatController.updateGoat);

// Delete a goat
router.delete("/:id",
  authenticateToken,
  requireAdmin, goatController.deleteGoat);

module.exports = router;