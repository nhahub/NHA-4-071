const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      // e.g., "CS101"
    },
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    credits: {
      type: Number,
      required: [true, "Credits are required"],
      min: 1,
      max: 6,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", courseSchema);
