const express = require("express");

const router = express.Router();

const workersController = require("../controllers/workersController");

router.get("/", workersController.getAllWorkers);

router.get("/:id", workersController.getWorkerById);

router.post("/", workersController.createWorker);

router.put("/:id", workersController.updateWorker);

router.delete("/:id", workersController.deleteWorker);

module.exports = router;