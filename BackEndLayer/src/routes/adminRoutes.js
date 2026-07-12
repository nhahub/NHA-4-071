const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const {
  updateUserSchema,
  updateComplaintSchema,
  updateSemesterSchema,
  manualEnrollSchema,
  updateSettingsSchema,
} = require("../validations/adminValidation");
const {
  semesterSchema,
  courseSchema,
} = require("../validations/universityValidation");
const adminController = require("../controllers/adminController");

router.use(protect, authorize("admin"));

router.get("/dashboard", adminController.getDashboard);

router.post("/semesters", validate(semesterSchema), adminController.createSemester);
router.post("/courses", validate(courseSchema), adminController.createCourse);

router.get("/users", adminController.getUsers);
router.patch(
  "/users/:id",
  validate(updateUserSchema),
  adminController.updateUser,
);

router.get("/complaints", adminController.getComplaints);
router.patch(
  "/complaints/:complaintId",
  validate(updateComplaintSchema),
  adminController.updateComplaint,
);

router.patch(
  "/semesters/:id",
  validate(updateSemesterSchema),
  adminController.updateSemester,
);

router.post(
  "/semester-registration",
  validate(manualEnrollSchema),
  adminController.manualEnroll,
);

router.get("/settings", adminController.getSettings);
router.put(
  "/settings",
  validate(updateSettingsSchema),
  adminController.updateSettings,
);

router.get("/reports", adminController.getReports);
router.get("/registration-stats", adminController.getRegistrationStats);

module.exports = router;
