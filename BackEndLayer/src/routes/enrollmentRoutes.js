const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { enrollmentSchema } = require("../validations/enrollmentValidation");
const enrollmentController = require("../controllers/enrollmentController");

// Only students can enroll/drop
router.post(
  "/",
  protect,
  authorize("student"),
  validate(enrollmentSchema),
  enrollmentController.enroll,
);
router.get(
  "/my",
  protect,
  authorize("student"),
  enrollmentController.getMyEnrollments,
); // Note: Frontend doc says /students/enrollments, we will mount this accordingly
router.delete(
  "/:id",
  protect,
  authorize("student"),
  enrollmentController.dropCourse,
);

module.exports = router;
