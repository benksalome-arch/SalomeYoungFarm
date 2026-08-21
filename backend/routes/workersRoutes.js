const express = require("express");

const router = express.Router();

const workersController = require("../controllers/workersController");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

// Get all workers
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  workersController.getAllWorkers
);

// Get one worker
router.get(
  "/:id",
  authenticateToken,
  requireAdmin,
  workersController.getWorkerById
);

// Create worker
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  workersController.createWorker
);

// Update worker
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  workersController.updateWorker
);

// Delete worker
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  workersController.deleteWorker
);

module.exports = router;
