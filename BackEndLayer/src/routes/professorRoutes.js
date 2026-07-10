const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { gradeSchema } = require("../validations/professorValidation");
const professorController = require("../controllers/professorController");

// All routes protected for Professors only
router.use(protect, authorize("professor"));

router.get("/profile", professorController.getProfile);
router.get("/offerings", professorController.getMyOfferings); // My Courses
router.get(
  "/offerings/:offeringId/students",
  professorController.getOfferingStudents,
); // View Students
router.post("/grades", validate(gradeSchema), professorController.submitGrade); // Submit Grade

module.exports = router;
