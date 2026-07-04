const Enrollment = require("../models/Enrollment");
const CourseOffering = require("../models/CourseOffering");
const Student = require("../models/Student");
const Semester = require("../models/Semester"); // Added for current semester lookup
const mongoose = require("mongoose");

exports.enrollCourse = async (studentUserId, courseId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find the student profile
    const student = await Student.findOne({ userId: studentUserId });
    if (!student) throw new Error("Student profile not found");

    // 2. Find the Current Active Semester
    const currentSemester = await Semester.findOne({
      registrationStatus: { $in: ["open", "ongoing"] },
    });
    if (!currentSemester)
      throw new Error("No active semester for registration right now");

    // 3. Find the Course Offering for this Course in the Current Semester
    const offering = await CourseOffering.findOne({
      courseId: courseId,
      semesterId: currentSemester._id,
    });

    if (!offering)
      throw new Error("This course is not offered in the current semester");

    // 4. Check if already enrolled in this offering
    const existingEnrollment = await Enrollment.findOne({
      studentId: student._id,
      offeringId: offering._id,
      status: "enrolled",
    });
    if (existingEnrollment) throw new Error("Already enrolled in this course");

    // 5. 🛡️ ATOMIC CAPACITY CHECK & INCREMENT
    // We must use $expr to compare two fields in the same document!
    const updatedOffering = await CourseOffering.findOneAndUpdate(
      {
        _id: offering._id,
        $expr: { $lt: ["$enrolledCount", "$capacity"] }, // Check: count < capacity
      },
      { $inc: { enrolledCount: 1 } }, // Increment count by 1
      { new: true, session }, // Return the updated document within the transaction
    );

    if (!updatedOffering) {
      throw new Error("Course section is full");
    }

    // 6. Create the Enrollment record
    const [enrollment] = await Enrollment.create(
      [
        {
          studentId: student._id,
          offeringId: offering._id,
          courseId: courseId,
          status: "enrolled",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return enrollment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Get a student's current enrollments
exports.getMyEnrollments = async (studentUserId) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  const enrollments = await Enrollment.find({
    studentId: student._id,
    status: "enrolled",
  })
    .populate("courseId", "code name credits")
    .populate("offeringId", "schedule classroom");

  return enrollments;
};

// Drop a course
exports.dropCourse = async (studentUserId, enrollmentId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await Student.findOne({ userId: studentUserId });
    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      studentId: student._id,
      status: "enrolled",
    });

    if (!enrollment) throw new Error("Enrollment not found or already dropped");

    enrollment.status = "dropped";
    await enrollment.save({ session });

    await CourseOffering.findByIdAndUpdate(
      enrollment.offeringId,
      { $inc: { enrolledCount: -1 } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    return enrollment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
