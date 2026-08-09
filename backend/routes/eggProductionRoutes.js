const express = require("express");
const router = express.Router();

const eggProductionController = require("../controllers/eggProductionController");

// Get all egg production records
router.get("/", eggProductionController.getEggProduction);

// Get one record
router.get("/:id", eggProductionController.getEggRecord);

// Create record
router.post("/", eggProductionController.createEggRecord);

// Update record
router.put("/:id", eggProductionController.updateEggRecord);

// Delete record
router.delete("/:id", eggProductionController.deleteEggRecord);

module.exports = router;