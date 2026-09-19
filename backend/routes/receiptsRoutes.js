const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const receiptsController = require("../controllers/receiptsController");
const { authenticateToken, requireAdmin } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, receiptsController.getReceipts);

router.post(
  "/",
  authenticateToken,
  upload.single("receipt"),
  receiptsController.uploadReceipt
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  receiptsController.deleteReceipt
);

module.exports = router;
