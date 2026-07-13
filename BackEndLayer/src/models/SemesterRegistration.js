const mongoose = require("mongoose");

const semesterRegistrationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

semesterRegistrationSchema.index({ studentId: 1, semesterId: 1 }, { unique: true });

module.exports = mongoose.model("SemesterRegistration", semesterRegistrationSchema);
