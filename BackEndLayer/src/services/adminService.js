const User = require("../models/User");
const Student = require("../models/Student");
const CourseOffering = require("../models/CourseOffering");
const Complaint = require("../models/Complaint");
const Semester = require("../models/Semester");
const Enrollment = require("../models/Enrollment");
const Setting = require("../models/Setting");

exports.getDashboard = async () => {
  const [students, professors, advisors, admins, openComplaints] =
    await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "professor" }),
      User.countDocuments({ role: "advisor" }),
      User.countDocuments({ role: "admin" }),
      Complaint.countDocuments({ status: { $in: ["pending", "in_progress"] } }),
    ]);

  return {
    totalUsers: students + professors + advisors + admins,
    usersByRole: { students, professors, advisors, admins },
    openComplaints,
  };
};

exports.getUsers = async (page = 1, limit = 20, role) => {
  const filter = {};
  if (role) filter.role = role;

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

exports.updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (updateData.role) {
    user.role = updateData.role;
  }
  if (updateData.isActive !== undefined) {
    user.isActive = updateData.isActive;
  }

  await user.save();
  return user;
};

exports.getComplaints = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [complaints, total] = await Promise.all([
    Complaint.find()
      .populate("studentId", "userId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Complaint.countDocuments(),
  ]);

  return {
    complaints,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

exports.updateComplaint = async (complaintId, updateData) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) throw new Error("Complaint not found");

  if (updateData.status) {
    complaint.status = updateData.status;
  }
  if (updateData.adminId) {
    complaint.adminId = updateData.adminId;
  }

  await complaint.save();
  return complaint;
};

exports.updateSemester = async (semesterId, updateData) => {
  const semester = await Semester.findById(semesterId);
  if (!semester) throw new Error("Semester not found");

  if (updateData.registrationStatus) {
    semester.registrationStatus = updateData.registrationStatus;
  }

  await semester.save();
  return semester;
};

exports.manualEnroll = async (studentUserId, offeringId) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  const offering = await CourseOffering.findById(offeringId);
  if (!offering) throw new Error("Offering not found");

  const existing = await Enrollment.findOne({
    studentId: student._id,
    offeringId,
  });
  if (existing) throw new Error("Student already enrolled in this offering");

  const enrollment = await Enrollment.create({
    studentId: student._id,
    offeringId,
    courseId: offering.courseId,
    status: "enrolled",
  });

  await CourseOffering.findByIdAndUpdate(offeringId, {
    $inc: { enrolledCount: 1 },
  });

  return enrollment;
};

exports.getSettings = async () => {
  const settings = await Setting.find();
  const result = {};
  settings.forEach((s) => {
    result[s.key] = s.value;
  });
  return result;
};

exports.updateSettings = async (settingsData) => {
  for (const [key, value] of Object.entries(settingsData)) {
    await Setting.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true },
    );
  }
  return settingsData;
};
