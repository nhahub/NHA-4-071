const Enrollment = require("../models/Enrollment");
const CourseOffering = require("../models/CourseOffering");
const Student = require("../models/Student");
const Setting = require("../models/Setting");
const mongoose = require("mongoose");
const { getCurrentSemester } = require("./universityService");

exports.enrollCourse = async (studentUserId, offeringId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find the student profile
    const student = await Student.findOne({ userId: studentUserId });
    if (!student) throw new Error("Student profile not found");

    // 2. Find the offering by _id and populate semester + course
    const offering = await CourseOffering.findById(offeringId)
      .populate("semesterId", "registrationStatus name")
      .populate("courseId", "code name credits");

    if (!offering) throw new Error("Course offering not found");

    // 3. Verify the offering belongs to an active semester
    const status = offering.semesterId?.registrationStatus;
    if (status !== "open" && status !== "ongoing") {
      throw new Error("This course is not offered in an active semester");
    }

    // 4. Credit limit check
    const maxSetting = await Setting.findOne({ key: "maxCreditsPerSemester" });
    const maxCredits = maxSetting?.value || 18;

    const currentSemesterId = offering.semesterId._id;
    const currentCredits = await Enrollment.aggregate([
      {
        $match: {
          studentId: student._id,
          status: "enrolled",
        },
      },
      {
        $lookup: {
          from: "courseofferings",
          localField: "offeringId",
          foreignField: "_id",
          as: "offering",
        },
      },
      { $unwind: "$offering" },
      { $match: { "offering.semesterId": currentSemesterId } },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      { $group: { _id: null, total: { $sum: "$course.credits" } } },
    ]);

    const enrolledCredits = currentCredits.length > 0 ? currentCredits[0].total : 0;
    const courseCredits = offering.courseId?.credits || 3;

    if (enrolledCredits + courseCredits > maxCredits) {
      throw new Error(
        `Credit limit exceeded. You have ${enrolledCredits} credits and this course is ${courseCredits} credits. Maximum is ${maxCredits} credits per semester.`
      );
    }

    // 5. Check for ANY existing enrollment
    const existingEnrollment = await Enrollment.findOne({
      studentId: student._id,
      offeringId: offering._id,
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === "enrolled") {
        throw new Error("Already enrolled in this course");
      }
      if (existingEnrollment.status === "completed") {
        throw new Error("You have already completed this course");
      }
      // status === "dropped": reactivate
      existingEnrollment.status = "enrolled";
      existingEnrollment.grade = null;
      await existingEnrollment.save({ session });

      await session.commitTransaction();
      session.endSession();
      return existingEnrollment;
    }

    // 6. Atomic capacity check & increment
    const updatedOffering = await CourseOffering.findOneAndUpdate(
      {
        _id: offering._id,
        $expr: { $lt: ["$enrolledCount", "$capacity"] },
      },
      { $inc: { enrolledCount: 1 } },
      { returnDocument: "after", session },
    );

    if (!updatedOffering) {
      throw new Error("Course section is full");
    }

    // 7. Create the Enrollment record
    const [enrollment] = await Enrollment.create(
      [
        {
          studentId: student._id,
          offeringId: offering._id,
          courseId: offering.courseId._id,
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

// Recalculate enrolledCount on all offerings to fix data drift
exports.recalibrateCounts = async () => {
  const offerings = await CourseOffering.find();
  let fixed = 0;

  for (const offering of offerings) {
    const actualCount = await Enrollment.countDocuments({
      offeringId: offering._id,
      status: "enrolled",
    });

    if (offering.enrolledCount !== actualCount) {
      offering.enrolledCount = actualCount;
      await offering.save();
      fixed++;
    }
  }

  return { total: offerings.length, fixed };
};
