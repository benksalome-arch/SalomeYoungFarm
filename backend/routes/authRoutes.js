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

// Forgot password
router.post(
  "/forgot-password",
  authController.forgotPassword
);

// Reset password using email token
router.post(
  "/reset-password",
  authController.resetPassword
);

// Change password while logged in
router.post(
  "/change-password",
  authenticateToken,
  authController.changePassword
);

module.exports = router;
