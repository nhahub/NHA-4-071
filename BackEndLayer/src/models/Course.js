const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Semester name is required"],
      trim: true,
      // e.g., "Fall 2024"
    },
    code: {
      type: String,
      required: [true, "Semester code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      // e.g., "F24"
    },
    registrationStatus: {
      type: String,
      enum: ["upcoming", "open", "closed", "ongoing", "ended"],
      default: "upcoming",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Semester", semesterSchema);
