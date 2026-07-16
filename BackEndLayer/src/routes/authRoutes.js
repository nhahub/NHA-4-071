const express = require("express");
const router = express.Router();
const {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("../validations/authValidation");
const validate = require("../middlewares/validateMiddleware");
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware"); // Import our bouncer!

// Public Routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

// 🛡️ Protected Routes (Must have valid Access Token)
router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);
router.post(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  authController.changePassword,
);

module.exports = router;
