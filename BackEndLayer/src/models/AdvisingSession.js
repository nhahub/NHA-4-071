const mongoose = require("mongoose");

const advisingSessionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    advisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advisor",
      required: true,
    },
    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "pending"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AdvisingSession", advisingSessionSchema);
