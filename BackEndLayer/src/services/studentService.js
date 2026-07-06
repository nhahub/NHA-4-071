const Student = require("../models/Student");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Complaint = require("../models/Complaint");
const Payment = require("../models/Payment");
const universityService = require("./universityService");

/**
 * GET STUDENT PROFILE
 * Aggregates Data for multible collections for the landing page of the student dashboard.
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

////////////////////////////////////////////////////////

/**
 * GET STUDENT DASHBOARD
 * Aggregates data from multiple collections for the landing page.
 */
exports.getDashboard = async (studentUserId) => {
  // 1. Get Student Profile Data (with populated department)
  const student = await Student.findOne({ userId: studentUserId }).populate(
    "departmentId",
    "name",
  );

  if (!student) throw new Error("Student profile not found");

  // 2. Get Current Semester (Re-using our university service!)
  const currentSemester = await universityService.getCurrentSemester();

  // 3. Run Counts in Parallel (⚡ PERFORMANCE BOOST!)
  // We use Promise.all so these 3 queries happen at the exact same time.
  const [
    enrolledCoursesCount,
    pendingPaymentsCount,
    openComplaintsCount,
    enrollments,
  ] = await Promise.all([
    // Count active enrollments
    Enrollment.countDocuments({ studentId: student._id, status: "enrolled" }),

    // Count pending payments
    Payment.countDocuments({ studentId: student._id, status: "pending" }),

    // Count open complaints
    Complaint.countDocuments({
      studentId: student._id,
      status: { $in: ["pending", "in_progress"] },
    }),

    // Get actual course details for the "Current Courses" list
    Enrollment.find({ studentId: student._id, status: "enrolled" }).populate(
      "courseId",
      "code name credits",
    ),
  ]);

  // 4. Format Current Courses (Frontend expects specific fields)
  const currentCourses = enrollments.map((e) => ({
    code: e.courseId?.code,
    name: e.courseId?.name,
    credits: e.courseId?.credits,
    grade: e.grade || "N/A", // Default if no grade yet
  }));

  // 5. Construct the Final Response Object
  return {
    student: {
      GPA: student.GPA,
      level: student.level,
      departmentName: student.departmentId?.name || "Unassigned",
    },
    currentSemester: currentSemester
      ? {
          name: currentSemester.name,
          registrationStatus: currentSemester.registrationStatus,
        }
      : null,
    enrolledCourses: enrolledCoursesCount,
    pendingPayments: pendingPaymentsCount,
    openComplaints: openComplaintsCount,
    currentCourses: currentCourses,
    // Mocking the trend for now (Frontend schema allows optional)
    gpaTrend: [],
  };
};
