/**
 * Reset STU001's S25 semester registration and enrollments
 * so the user can test the full registration + enrollment flow.
 */
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Semester = require("../models/Semester");
const Enrollment = require("../models/Enrollment");
const CourseOffering = require("../models/CourseOffering");
const SemesterRegistration = require("../models/SemesterRegistration");

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const user = await User.findOne({ universityId: "STU001" });
  if (!user) { console.error("STU001 not found"); process.exit(1); }

  const student = await Student.findOne({ userId: user._id });
  if (!student) { console.error("Student profile not found"); process.exit(1); }

  const s25 = await Semester.findOne({ code: "S25" });
  if (!s25) { console.error("S25 semester not found"); process.exit(1); }

  console.log(`\nStudent: ${user.universityId} (${user.name})`);
  console.log(`Semester: ${s25.name} (${s25.code})`);

  // 1. Remove SemesterRegistration for S25
  const regResult = await SemesterRegistration.deleteOne({
    studentId: student._id,
    semesterId: s25._id,
  });
  console.log(`\nRemoved semester registration: ${regResult.deletedCount > 0 ? "yes" : "was not registered"}`);

  // 2. Remove S25 enrollments and decrement offering counts
  const enrollments = await Enrollment.find({
    studentId: student._id,
  }).populate({
    path: "offeringId",
    select: "semesterId enrolledCount",
    populate: { path: "semesterId", select: "code" },
  });

  let removedCount = 0;
  for (const en of enrollments) {
    if (en.offeringId?.semesterId?.code === "S25" && en.status === "enrolled") {
      // Decrement enrolledCount on the offering
      await CourseOffering.findByIdAndUpdate(en.offeringId._id, {
        $inc: { enrolledCount: -1 },
      });
      await Enrollment.findByIdAndDelete(en._id);
      removedCount++;
      console.log(`  Removed enrollment: offering ${en.offeringId._id}`);
    }
  }
  console.log(`\nRemoved ${removedCount} S25 enrollments`);

  // 3. Show what S25 offerings are available now
  const offerings = await CourseOffering.find({ semesterId: s25._id })
    .populate("courseId", "code name credits")
    .sort({ "courseId.code": 1 });

  console.log(`\nAvailable S25 offerings (${offerings.length}):`);
  for (const o of offerings) {
    console.log(`  ${o.courseId?.code} - ${o.courseId?.name} (${o.courseId?.credits}cr) | seats: ${o.capacity - o.enrolledCount}/${o.capacity}`);
  }

  await mongoose.disconnect();
  console.log("\nDone! STU001 is ready for fresh registration + enrollment.");
}

run().catch((err) => { console.error(err); process.exit(1); });
