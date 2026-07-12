const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { complaintSchema } = require("../validations/complaintValidation");
const complaintController = require("../controllers/complaintController");

router.post(
  "/",
  protect,
  authorize("student"),
  validate(complaintSchema),
  complaintController.createComplaint,
);
router.get(
  "/",
  protect,
  authorize("student"),
  complaintController.getMyComplaints,
);

module.exports = router;
