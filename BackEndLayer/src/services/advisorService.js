const Advisor = require("../models/Advisor");
const Student = require("../models/Student");
const AdvisingSession = require("../models/AdvisingSession");
const Enrollment = require("../models/Enrollment");
const Attendance = require("../models/Attendance");
const Course = require("../models/Course");
const Complaint = require("../models/Complaint");

exports.updateProfile = async (advisorUserId, updateData) => {
  const advisor = await Advisor.findOneAndUpdate(
    { userId: advisorUserId },
    updateData,
    { returnDocument: "after", runValidators: true },
  );
  if (!advisor) throw new Error("Advisor profile not found");
  return await exports.getProfile(advisorUserId);
};

exports.getProfile = async (advisorUserId) => {
  const advisor = await Advisor.findOne({ userId: advisorUserId })
    .populate("userId", "name email universityId")
    .populate("departmentId", "name code");

  if (!advisor) throw new Error("Advisor profile not found");

  return {
    _id: advisor._id,
    userId: advisor.userId._id,
    name: advisor.userId.name,
    email: advisor.userId.email,
    universityId: advisor.userId.universityId,
    departmentId: advisor.departmentId?._id,
    departmentName: advisor.departmentId?.name,
    title: advisor.title,
  };
};

exports.getDashboard = async (advisorUserId) => {
  const advisor = await Advisor.findOne({ userId: advisorUserId });
  if (!advisor) throw new Error("Advisor profile not found");

  const totalAdvisees = await Student.countDocuments({
    advisorId: advisor._id,
  });

  const atRiskAdvisees = await Student.countDocuments({
    advisorId: advisor._id,
    GPA: { $lt: 2.0 },
  });

  return {
    totalAdvisees,
    atRiskAdvisees,
  };
};

exports.getStudents = async (advisorUserId, page = 1, limit = 20) => {
  const advisor = await Advisor.findOne({ userId: advisorUserId });
  if (!advisor) throw new Error("Advisor profile not found");

  const skip = (page - 1) * limit;

  const [students, total] = await Promise.all([
    Student.find({ advisorId: advisor._id })
      .populate("userId", "name universityId email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Student.countDocuments({ advisorId: advisor._id }),
  ]);

  return {
    students,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

exports.createSession = async (advisorUserId, sessionData) => {
  const { studentId, semesterId, notes } = sessionData;

  const advisor = await Advisor.findOne({ userId: advisorUserId });
  if (!advisor) throw new Error("Advisor profile not found");

  const session = await AdvisingSession.create({
    studentId,
    advisorId: advisor._id,
    semesterId,
    notes: notes || "",
    status: "scheduled",
  });

  return session;
};

exports.getSessions = async (advisorUserId, query = {}) => {
  const advisor = await Advisor.findOne({ userId: advisorUserId });
  if (!advisor) throw new Error("Advisor profile not found");

  const filter = { advisorId: advisor._id };

  if (query.studentId) {
    filter.studentId = query.studentId;
  }

  const sessions = await AdvisingSession.find(filter)
    .populate("studentId", "userId")
    .populate("semesterId", "name code")
    .sort({ createdAt: -1 });

  return sessions;
};

exports.updateSession = async (advisorUserId, sessionId, updateData) => {
  const advisor = await Advisor.findOne({ userId: advisorUserId });
  if (!advisor) throw new Error("Advisor profile not found");

  const session = await AdvisingSession.findOne({
    _id: sessionId,
    advisorId: advisor._id,
  });

  if (!session) throw new Error("Session not found or not authorized");

  if (updateData.notes !== undefined) session.notes = updateData.notes;
  if (updateData.status !== undefined) session.status = updateData.status;

  await session.save();
  return session;
};

exports.getStudentProgress = async (advisorUserId, studentId) => {
  const advisor = await Advisor.findOne({ userId: advisorUserId });
  if (!advisor) throw new Error("Advisor profile not found");

  const student = await Student.findById(studentId)
    .populate("userId", "name email universityId")
    .populate("departmentId", "name code");

  if (!student) throw new Error("Student not found");
  if (student.advisorId?.toString() !== advisor._id.toString()) {
    throw new Error("This student is not assigned to you");
  }

  const enrollments = await Enrollment.find({ studentId: student._id })
    .populate("courseId", "code name credits")
    .sort({ createdAt: -1 });

  const attendanceRecords = await Attendance.find({
    "records.studentId": student._id,
  }).select("offeringId date records.$");

  const attendanceSummary = attendanceRecords.map((record) => ({
    date: record.date,
    status: record.records[0]?.status || "unknown",
  }));

  const completedCourses = enrollments.filter(
    (e) => e.status === "completed" && e.grade,
  );
  const totalCredits = completedCourses.reduce(
    (sum, e) => sum + (e.courseId?.credits || 0),
    0,
  );

  return {
    student: {
      _id: student._id,
      name: student.userId?.name,
      email: student.userId?.email,
      universityId: student.userId?.universityId,
      GPA: student.GPA,
      level: student.level,
      departmentName: student.departmentId?.name,
    },
    enrollments: enrollments.map((e) => ({
      _id: e._id,
      courseCode: e.courseId?.code,
      courseName: e.courseId?.name,
      credits: e.courseId?.credits,
      status: e.status,
      grade: e.grade,
    })),
    attendanceSummary,
    totalCreditsEarned: totalCredits,
    completedCoursesCount: completedCourses.length,
  };
};

exports.getGraduationAudit = async (advisorUserId, studentId) => {
  const advisor = await Advisor.findOne({ userId: advisorUserId });
  if (!advisor) throw new Error("Advisor profile not found");

  const student = await Student.findById(studentId)
    .populate("userId", "name universityId")
    .populate("departmentId", "name");

  if (!student) throw new Error("Student not found");
  if (student.advisorId?.toString() !== advisor._id.toString()) {
    throw new Error("This student is not assigned to you");
  }

  const totalRequired = await Course.countDocuments({
    departmentId: student.departmentId?._id,
  });

  const completedEnrollments = await Enrollment.find({
    studentId: student._id,
    status: "completed",
    grade: { $ne: null },
  }).populate("courseId", "code name credits");

  const completedCourses = completedEnrollments.map((e) => ({
    code: e.courseId?.code,
    name: e.courseId?.name,
    credits: e.courseId?.credits,
    grade: e.grade,
  }));

  const totalCompletedCredits = completedCourses.reduce(
    (sum, c) => sum + (c.credits || 0),
    0,
  );

  return {
    studentName: student.userId?.name,
    universityId: student.userId?.universityId,
    departmentName: student.departmentId?.name,
    totalRequiredCourses: totalRequired,
    completedCourses,
    completedCount: completedCourses.length,
    totalRequiredCredits: totalRequired * 3,
    completedCredits: totalCompletedCredits,
      progress:
      totalRequired > 0
        ? Math.round((completedCourses.length / totalRequired) * 100)
        : 0,
  };
};

exports.getIssues = async (advisorUserId, page = 1, limit = 20) => {
  const advisor = await Advisor.findOne({ userId: advisorUserId });
  if (!advisor) throw new Error("Advisor profile not found");

  const skip = (page - 1) * limit;

  const [complaints, total] = await Promise.all([
    Complaint.find({ adminId: advisorUserId })
      .populate("studentId", "userId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Complaint.countDocuments({ adminId: advisorUserId }),
  ]);

  return {
    complaints,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

exports.updateIssue = async (advisorUserId, issueId, updateData) => {
  const advisor = await Advisor.findOne({ userId: advisorUserId });
  if (!advisor) throw new Error("Advisor profile not found");

  const complaint = await Complaint.findOne({
    _id: issueId,
    adminId: advisorUserId,
  });

  if (!complaint) throw new Error("Issue not found or not assigned to you");

  if (updateData.status) {
    if (!["pending", "in_progress", "resolved", "rejected"].includes(updateData.status)) {
      throw new Error("Invalid status value");
    }
    complaint.status = updateData.status;
  }

  await complaint.save();
  return complaint;
};
