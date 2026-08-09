const express = require("express");
const router = express.Router();

const eggSalesController = require("../controllers/eggSalesController");

// Get all egg sales
router.get("/", eggSalesController.getSales);

// Create egg sale
router.post("/", eggSalesController.createSale);

// Delete egg sale
router.delete("/:id", eggSalesController.deleteSale);

module.exports = router;