const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    offeringId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseOffering",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["midterm", "final", "quiz", "project"],
      default: "final",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Exam", examSchema);
