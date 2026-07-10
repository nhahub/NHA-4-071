const Professor = require("../models/Professor");
const CourseOffering = require("../models/CourseOffering");
const Enrollment = require("../models/Enrollment");
const mongoose = require("mongoose");

// 1. Get Professor Profile (Aggregating User + Professor data)
exports.getProfile = async (professorUserId) => {
  const professor = await Professor.findOne({ userId: professorUserId })
    .populate("userId", "name email universityId") // Get basic user info
    .populate("departmentId", "name code"); // Get department info

  if (!professor) throw new Error("Professor profile not found");

  return {
    _id: professor._id,
    userId: professor.userId._id,
    name: professor.userId.name,
    email: professor.userId.email,
    universityId: professor.userId.universityId,
    departmentId: professor.departmentId?._id,
    departmentName: professor.departmentId?.name,
    title: professor.title,
  };
};

// 2. Get My Courses (Offerings assigned to me)
exports.getMyOfferings = async (professorUserId) => {
  const professor = await Professor.findOne({ userId: professorUserId });
  if (!professor) throw new Error("Professor profile not found");

  const offerings = await CourseOffering.find({ professorId: professor._id })
    .populate("courseId", "code name credits")
    .populate("semesterId", "name code");

  return offerings;
};

// 3. Get Students Enrolled in a Specific Offering
exports.getOfferingStudents = async (professorUserId, offeringId) => {
  const professor = await Professor.findOne({ userId: professorUserId });

  // Security Check: Ensure this professor actually owns this offering!
  const offering = await CourseOffering.findOne({
    _id: offeringId,
    professorId: professor._id,
  });
  if (!offering)
    throw new Error("You are not authorized to view this offering");

  // Find all enrollments for this offering
  const enrollments = await Enrollment.find({
    offeringId: offeringId,
    status: "enrolled",
  })
    .populate("studentId", "userId") // We need the student's user ID to get their name
    .populate("courseId", "code name");

  // We need to manually populate the student's name from the User model
  // (In a perfect world we'd use deep populate, but let's keep it simple for now)
  const User = require("../models/User");
  const studentsWithData = await Promise.all(
    enrollments.map(async (enrollment) => {
      const user = await User.findById(enrollment.studentId.userId);
      return {
        enrollmentId: enrollment._id,
        studentId: enrollment.studentId._id,
        studentName: user.name,
        studentUniversityId: user.universityId,
        grade: enrollment.grade,
        courseCode: enrollment.courseId?.code,
      };
    }),
  );

  return studentsWithData;
};

// 4. Submit Grade (Update Enrollment)
exports.submitGrade = async (professorUserId, enrollmentId, grade) => {
  const professor = await Professor.findOne({ userId: professorUserId });

  // Find the enrollment
  const enrollment =
    await Enrollment.findById(enrollmentId).populate("offeringId");

  if (!enrollment) throw new Error("Enrollment not found");

  // Security Check: Ensure the offering for this enrollment belongs to this professor
  if (
    enrollment.offeringId.professorId.toString() !== professor._id.toString()
  ) {
    throw new Error("You are not authorized to grade this student");
  }

  // Update the grade
  enrollment.grade = grade;
  await enrollment.save();

  return enrollment;
};
