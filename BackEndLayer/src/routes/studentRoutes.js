const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const studentController = require("../controllers/studentController");

// All routes are protected and only for students
// 🛡️ 1. MIDDLEWARE FIRST!
router.use(protect, authorize("student"));

// 🚀 2. ROUTES SECOND!
router.get("/dashboard", studentController.getDashboard);

router.get("/profile", studentController.getProfile);
router.patch("/profile", studentController.updateProfile);

router.get("/settings", studentController.getSettings);
router.put("/settings", studentController.updateSettings);

module.exports = router;
