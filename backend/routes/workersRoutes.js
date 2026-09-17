const express = require("express");

const router = express.Router();

const workersController = require("../controllers/workersController");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

// Get all workers
// Admin, Manager and Worker can view workers
router.get(
  "/",
  authenticateToken,
  workersController.getAllWorkers
);

// Get one worker
// Admin, Manager and Worker can view a worker
router.get(
  "/:id",
  authenticateToken,
  workersController.getWorkerById
);

// Create worker
// Only Admin can create user accounts
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  workersController.createWorker
);

// Update worker
// Only Admin can edit saved worker details
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  workersController.updateWorker
);

// Delete worker
// Only Admin can delete workers
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  workersController.deleteWorker
);

module.exports = router;
