const Advisor = require("../models/Advisor");
const Student = require("../models/Student");
const AdvisingSession = require("../models/AdvisingSession");

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
