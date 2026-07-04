const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const studentController = require("../controllers/studentController");

// All routes are protected and only for students
router.use(protect, authorize("student"));

router.get("/profile", studentController.getProfile);
router.patch("/profile", studentController.updateProfile);

router.get("/settings", studentController.getSettings);
router.put("/settings", studentController.updateSettings);

module.exports = router;
