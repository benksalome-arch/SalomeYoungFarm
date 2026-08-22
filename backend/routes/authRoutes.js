const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const {
  authenticateToken,
} = require("../middleware/authMiddleware");

// Login
router.post("/login", authController.login);

// Create new account
router.post("/register", authController.register);

// Change password
router.post(
  "/change-password",
  authenticateToken,
  authController.changePassword
);

module.exports = router;
