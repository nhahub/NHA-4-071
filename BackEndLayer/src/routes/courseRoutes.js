const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const courseController = require("../controllers/courseController");

router.get("/", protect, courseController.getCourses);
router.get("/:id", protect, courseController.getCourseById);
router.get("/:id/offerings", protect, courseController.getCourseOfferings);

module.exports = router;
