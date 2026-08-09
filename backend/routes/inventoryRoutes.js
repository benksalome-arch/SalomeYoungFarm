const express = require("express");

const router = express.Router();

const inventoryController = require("../controllers/inventoryController");

// Get all inventory items
router.get("/", inventoryController.getItems);

// Get one inventory item
router.get("/:id", inventoryController.getItem);

// Create inventory item
router.post("/", inventoryController.createItem);

// Update inventory item
router.put("/:id", inventoryController.updateItem);

// Delete inventory item
router.delete("/:id", inventoryController.deleteItem);

module.exports = router;