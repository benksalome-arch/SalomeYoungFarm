const express = require("express");

const router = express.Router();

const financeController = require("../controllers/financeController");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/", financeController.getTransactions);

router.get("/:id", financeController.getTransaction);

router.post("/", financeController.createTransaction);

router.put("/:id",
  authenticateToken,
  requireAdmin, financeController.updateTransaction);

router.delete("/:id",
  authenticateToken,
  requireAdmin, financeController.deleteTransaction);

module.exports = router;