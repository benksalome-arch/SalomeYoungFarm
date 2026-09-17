const express = require("express");
const router = express.Router();

const eggSalesController = require("../controllers/eggSalesController");

// Get all egg sales
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", eggSalesController.getSales);

// Get one egg sale
router.get("/:id", eggSalesController.getSale);

// Create egg sale
router.post("/", eggSalesController.createSale);

// Update egg sale
router.put("/:id",
  authenticateToken,
  requireAdmin,
  eggSalesController.updateSale
);

// Delete egg sale
router.delete("/:id",
  authenticateToken,
  requireAdmin, eggSalesController.deleteSale);

module.exports = router;