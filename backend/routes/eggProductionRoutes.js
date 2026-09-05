const express = require("express");
const router = express.Router();

const eggProductionController = require("../controllers/eggProductionController");

// Get all egg production records
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", eggProductionController.getEggProduction);

// Get one record
router.get("/:id", eggProductionController.getEggRecord);

// Create record
router.post("/", eggProductionController.createEggRecord);

// Update record
router.put("/:id",
  authenticateToken,
  requireAdmin, eggProductionController.updateEggRecord);

// Delete record
router.delete("/:id",
  authenticateToken,
  requireAdmin, eggProductionController.deleteEggRecord);

module.exports = router;