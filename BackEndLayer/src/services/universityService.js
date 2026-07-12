const Department = require("../models/Department");
const Semester = require("../models/Semester");
const Course = require("../models/Course");
const CourseOffering = require("../models/CourseOffering");

// ===== DEPARTMENTS =====
exports.createDepartment = async (data) => await Department.create(data);
exports.getDepartments = async () => await Department.find().sort({ name: 1 });

// ===== SEMESTERS =====
exports.createSemester = async (data) => await Semester.create(data);
exports.getSemesters = async () =>
  await Semester.find().sort({ startDate: -1 });

// 🧠 MENTOR MOMENT: Business Logic in the Service Layer
// The frontend expects a "Current Semester". How do we define that?
// It's the semester that is currently 'open' or 'ongoing'.
exports.getCurrentSemester = async () => {
  const currentSemester = await Semester.findOne({
    registrationStatus: { $in: ["open", "ongoing"] },
  }).sort({ startDate: -1 });

  return currentSemester; // Might be null if no semester is active!
};

// ===== COURSES =====
exports.createCourse = async (data) => await Course.create(data);
exports.getAvailableCourses = async () =>
  await Course.find().populate("departmentId", "name code").sort({ code: 1 });

// ===== COURSE OFFERINGS =====
exports.createOffering = async (data) => {
  // When creating an offering, we might want to auto-assign the professor's name later
  return await CourseOffering.create(data);
};

exports.getOfferingsByCourse = async (courseId) => {
  return await CourseOffering.find({ courseId })
    .populate("professorId", "name") // Get professor's name instead of just ID
    .populate("semesterId", "name code"); // Get semester details
};
