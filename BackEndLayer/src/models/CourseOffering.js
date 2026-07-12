const mongoose = require("mongoose");

const courseOfferingSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      default: null, // Sometimes a professor isn't assigned yet
    },
    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    schedule: {
      type: String,
      trim: true,
      // e.g., "Mon/Wed 10:00-11:30"
    },
    classroom: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      default: 30,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CourseOffering", courseOfferingSchema);
