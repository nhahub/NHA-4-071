const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validateMiddleware");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  departmentSchema,
  semesterSchema,
  courseSchema,
  courseOfferingSchema,
} = require("../validations/universityValidation");
const universityController = require("../controllers/universityController");

// ===== DEPARTMENTS =====
router.post(
  "/departments",
  protect,
  authorize("admin"),
  validate(departmentSchema),
  universityController.createDepartment,
);
router.get("/departments", protect, universityController.getDepartments); // Any logged in user can see departments

// ===== SEMESTERS =====
router.post(
  "/semesters",
  protect,
  authorize("admin"),
  validate(semesterSchema),
  universityController.createSemester,
);
router.get("/semesters", protect, universityController.getSemesters);
router.get(
  "/semesters/current",
  protect,
  universityController.getCurrentSemester,
);

// ===== COURSES =====
router.post(
  "/courses",
  protect,
  authorize("admin"),
  validate(courseSchema),
  universityController.createCourse,
);
router.get(
  "/courses/available",
  protect,
  universityController.getAvailableCourses,
);

// ===== COURSE OFFERINGS =====
router.post(
  "/offerings",
  protect,
  authorize("admin"),
  validate(courseOfferingSchema),
  universityController.createOffering,
);

module.exports = router;
