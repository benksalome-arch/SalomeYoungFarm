const express = require("express");
const router = express.Router();

const chickensController = require("../controllers/chickensController");

// Get all chickens
router.get("/", chickensController.getChickens);

// Get one chicken
router.get("/:id", chickensController.getChicken);

// Add chicken
router.post("/", chickensController.createChicken);

// Update chicken
router.put("/:id", chickensController.updateChicken);

// Delete chicken
router.delete("/:id", chickensController.deleteChicken);

module.exports = router;