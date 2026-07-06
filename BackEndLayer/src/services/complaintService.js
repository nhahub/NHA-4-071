const Complaint = require("../models/Complaint");
const Student = require("../models/Student");

exports.createComplaint = async (studentUserId, complaintData) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  const complaint = await Complaint.create({
    ...complaintData,
    studentId: student._id,
    status: "pending",
  });

  return complaint;
};

exports.getMyComplaints = async (studentUserId) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  const complaints = await Complaint.find({ studentId: student._id }).sort({
    createdAt: -1,
  }); // Show newest first

  return complaints;
};
