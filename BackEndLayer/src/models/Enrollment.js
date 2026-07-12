const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    offeringId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseOffering",
      required: true,
    },
    // Denormalized for faster querying on student's schedule
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    status: {
      type: String,
      enum: ["enrolled", "dropped", "completed"],
      default: "enrolled",
    },
    grade: {
      type: String,
      default: null,
      // e.g., 'A', 'B+', 'C'
    },
  },
  { timestamps: true },
);

// 🛡️ A student cannot enroll in the same offering twice!
enrollmentSchema.index({ studentId: 1, offeringId: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
