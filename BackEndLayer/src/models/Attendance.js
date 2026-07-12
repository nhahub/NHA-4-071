const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent", "late"],
    required: true,
  },
});

const attendanceSchema = new mongoose.Schema(
  {
    offeringId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseOffering",
      required: [true, "Offering ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    records: [attendanceRecordSchema],
  },
  { timestamps: true },
);

attendanceSchema.index({ offeringId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
