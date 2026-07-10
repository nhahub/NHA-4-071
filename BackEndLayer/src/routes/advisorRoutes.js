const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const {
  createAdvisingSessionSchema,
  updateAdvisingSessionSchema,
} = require("../validations/advisorValidation");
const advisorController = require("../controllers/advisorController");

router.use(protect, authorize("advisor"));

router.get("/profile", advisorController.getProfile);
router.get("/dashboard", advisorController.getDashboard);
router.get("/students", advisorController.getStudents);

router.post(
  "/sessions",
  validate(createAdvisingSessionSchema),
  advisorController.createSession,
);
router.get("/sessions", advisorController.getSessions);
router.patch(
  "/sessions/:sessionId",
  validate(updateAdvisingSessionSchema),
  advisorController.updateSession,
);

module.exports = router;
