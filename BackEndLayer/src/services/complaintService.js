const Complaint = require("../models/Complaint");
const Student = require("../models/Student");
const User = require("../models/User");
const notificationService = require("./notificationService");

exports.createComplaint = async (studentUserId, complaintData) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  const complaint = await Complaint.create({
    ...complaintData,
    studentId: student._id,
    status: "pending",
  });

  const user = await User.findById(studentUserId);
  const studentName = user?.name || "A student";

  const admins = await User.find({ role: "admin" }).select("_id");
  for (const admin of admins) {
    await notificationService.createNotification(
      admin._id,
      "urgent",
      "New Complaint Submitted",
      `${studentName} submitted a new complaint: "${complaint.subject}"`,
    );
  }

  return complaint;
};

exports.getMyComplaints = async (studentUserId) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  const complaints = await Complaint.find({ studentId: student._id }).sort({
    createdAt: -1,
  });

  return complaints;
};
