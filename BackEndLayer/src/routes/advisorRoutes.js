const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const advisorController = require("../controllers/advisorController");

router.use(protect, authorize("advisor"));

router.get("/profile", advisorController.getProfile);
router.get("/dashboard", advisorController.getDashboard);

module.exports = router;
