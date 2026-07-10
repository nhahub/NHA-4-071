const mongoose = require("mongoose");

const studyPlanSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    degreeName: {
      type: String,
      trim: true,
    },
    totalRequired: {
      type: Number,
      default: 0,
    },
    years: [
      {
        year: { type: Number, required: true },
        semesters: [
          {
            name: { type: String, required: true },
            courses: [
              {
                code: { type: String },
                name: { type: String },
                credits: { type: Number },
                completed: { type: Boolean, default: false },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("StudyPlan", studyPlanSchema);
