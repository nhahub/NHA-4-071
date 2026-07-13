const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const studentController = require("../controllers/studentController");

router.patch("/:notificationId/read", protect, studentController.markNotificationRead);

module.exports = router;
