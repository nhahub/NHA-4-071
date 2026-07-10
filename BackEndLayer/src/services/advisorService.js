const Advisor = require("../models/Advisor");
const Student = require("../models/Student");

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
