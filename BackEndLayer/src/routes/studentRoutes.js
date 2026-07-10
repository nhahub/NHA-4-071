const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const studentController = require("../controllers/studentController");

router.use(protect, authorize("student"));

router.get("/dashboard", studentController.getDashboard);
router.get("/profile", studentController.getProfile);
router.patch("/profile", studentController.updateProfile);
router.get("/settings", studentController.getSettings);
router.put("/settings", studentController.updateSettings);

router.get("/courses", studentController.getCourseCatalog);
router.get("/schedule", studentController.getSchedule);
router.get("/grades", studentController.getGrades);
router.get("/payments", studentController.getPayments);

router.get("/enrollments", studentController.getMyEnrollments);
router.get("/complaints", studentController.getMyComplaints);
router.get("/advising-sessions", studentController.getMyAdvisingSessions);
router.post("/advising-sessions", studentController.createMyAdvisingSession);
router.get("/notifications", studentController.getNotifications);
router.get("/attendance", studentController.getStudentAttendance);
router.get("/exams", studentController.getExams);
router.get("/transcript", studentController.getTranscript);
router.get("/study-plan", studentController.getStudyPlan);
router.post("/semester-registration", studentController.submitSemesterRegistration);
router.post("/gpa-calculations", studentController.saveGpaCalculation);

module.exports = router;
