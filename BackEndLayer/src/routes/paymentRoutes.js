const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { paymentSchema } = require("../validations/paymentValidation");
const paymentController = require("../controllers/paymentController");

router.post("/", protect, authorize("student"), validate(paymentSchema), paymentController.makePayment);
router.get("/", protect, authorize("student"), paymentController.getMyPayments);

module.exports = router;
