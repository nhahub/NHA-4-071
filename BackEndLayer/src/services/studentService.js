const Student = require("../models/Student");
const User = require("../models/User");

/**
 * GET STUDENT PROFILE
 * Aggregates User, Student, and Department data to match Frontend Schema
 */
exports.getProfile = async (studentUserId) => {
  const student = await Student.findOne({ userId: studentUserId }).populate(
    "departmentId",
    "name code",
  ); // Get department name & code

  if (!student) throw new Error("Student profile not found");

  const user = await User.findById(studentUserId);

  // Format to match Frontend `StudentResponseSchema`
  return {
    _id: student._id,
    userId: user._id,
    departmentId: student.departmentId?._id || null,
    advisorId: student.advisorId,
    GPA: student.GPA,
    level: student.level,
    name: user.name, // From User
    email: user.email, // From User
    universityId: user.universityId, // From User
    departmentName: student.departmentId?.name || null, // From Populated Dept
    program: student.program,
  };
};

/**
 * UPDATE STUDENT PROFILE
 * Currently, students can only update basic info like program.
 * (Name/Email updates usually require a separate verification flow)
 */
exports.updateProfile = async (studentUserId, updateData) => {
  const student = await Student.findOneAndUpdate(
    { userId: studentUserId },
    updateData,
    { new: true, runValidators: true },
  );
  if (!student) throw new Error("Student profile not found");

  // Re-fetch to populate and format consistently
  return await exports.getProfile(studentUserId);
};

/**
 * GET SETTINGS
 */
exports.getSettings = async (studentUserId) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  return student.settings; // Returns { showGpa, preferredLanguage }
};

/**
 * UPDATE SETTINGS
 */
exports.updateSettings = async (studentUserId, settingsData) => {
  const student = await Student.findOneAndUpdate(
    { userId: studentUserId },
    { settings: settingsData }, // Overwrite the embedded settings object
    { new: true, runValidators: true },
  );
  if (!student) throw new Error("Student profile not found");

  return student.settings;
};
