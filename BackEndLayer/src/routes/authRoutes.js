const express = require("express");
const router = express.Router();
const {
  loginSchema,
  registerSchema,
} = require("../validations/authValidation");
const validate = require("../middlewares/validateMiddleware");
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware"); // Import our bouncer!

// Public Routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

// 🛡️ Protected Routes (Must have valid Access Token)
router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);

module.exports = router;
