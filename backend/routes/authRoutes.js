const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Login
router.post("/login", authController.login);

// Create new account
router.post("/register", authController.register);

module.exports = router;