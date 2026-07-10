const Professor = require("../models/Professor");
const CourseOffering = require("../models/CourseOffering");
const Enrollment = require("../models/Enrollment");
const Assignment = require("../models/Assignment");
const Attendance = require("../models/Attendance");
const Semester = require("../models/Semester");
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

// 5. Create Assignment
exports.createAssignment = async (professorUserId, assignmentData) => {
  const { offeringId, title, dueDate, maxScore } = assignmentData;

  const professor = await Professor.findOne({ userId: professorUserId });
  if (!professor) throw new Error("Professor profile not found");

  // Security Check: Ensure this professor owns the offering
  const offering = await CourseOffering.findOne({
    _id: offeringId,
    professorId: professor._id,
  });
  if (!offering)
    throw new Error("You are not authorized to create assignments for this offering");

  const assignment = await Assignment.create({
    offeringId,
    title,
    dueDate: new Date(dueDate),
    maxScore,
  });

  return assignment;
};

// 6. Get Assignments for an Offering
exports.getAssignments = async (professorUserId, offeringId) => {
  const professor = await Professor.findOne({ userId: professorUserId });
  if (!professor) throw new Error("Professor profile not found");

  // Security Check: Ensure this professor owns the offering
  const offering = await CourseOffering.findOne({
    _id: offeringId,
    professorId: professor._id,
  });
  if (!offering)
    throw new Error("You are not authorized to view assignments for this offering");

  const assignments = await Assignment.find({ offeringId }).sort({ dueDate: 1 });

  return assignments;
};

// 7. Mark Attendance (Create or Update for a specific date)
exports.markAttendance = async (professorUserId, offeringId, attendanceData) => {
  const { date, records } = attendanceData;

  const professor = await Professor.findOne({ userId: professorUserId });
  if (!professor) throw new Error("Professor profile not found");

  // Security Check: Ensure this professor owns the offering
  const offering = await CourseOffering.findOne({
    _id: offeringId,
    professorId: professor._id,
  });
  if (!offering)
    throw new Error("You are not authorized to mark attendance for this offering");

  const attendanceDate = new Date(date);

  // Upsert: Find existing attendance record for this offering+date, or create new one
  let attendance = await Attendance.findOne({
    offeringId,
    date: attendanceDate,
  });

  if (attendance) {
    // Update existing records
    attendance.records = records;
  } else {
    // Create new attendance record
    attendance = new Attendance({
      offeringId,
      date: attendanceDate,
      records,
    });
  }

  await attendance.save();
  return attendance;
};

// 8. Get Attendance History for an Offering
exports.getAttendance = async (professorUserId, offeringId) => {
  const professor = await Professor.findOne({ userId: professorUserId });
  if (!professor) throw new Error("Professor profile not found");

  // Security Check: Ensure this professor owns the offering
  const offering = await CourseOffering.findOne({
    _id: offeringId,
    professorId: professor._id,
  });
  if (!offering)
    throw new Error("You are not authorized to view attendance for this offering");

  const attendanceRecords = await Attendance.find({ offeringId })
    .sort({ date: -1 })
    .populate("records.studentId", "userId");

  return attendanceRecords;
};

// 9. Get Professor Schedule (for the current semester)
exports.getSchedule = async (professorUserId) => {
  const professor = await Professor.findOne({ userId: professorUserId });
  if (!professor) throw new Error("Professor profile not found");

  // Find current semester (prefer "ongoing" or "open")
  const currentSemester = await Semester.findOne({
    registrationStatus: { $in: ["ongoing", "open"] },
  }).sort({ startDate: -1 });

  if (!currentSemester) {
    return [];
  }

  // Find offerings for this professor in the current semester
  const offerings = await CourseOffering.find({
    professorId: professor._id,
    semesterId: currentSemester._id,
  })
    .populate("courseId", "code name credits")
    .populate("semesterId", "name code");

  // Format into schedule items
  const scheduleItems = offerings.map((offering) => {
    // Parse the schedule string (e.g., "Mon/Wed 10:00-11:30")
    let day = "";
    let start = "";
    let end = "";
    if (offering.schedule) {
      const parts = offering.schedule.split(" ");
      if (parts.length >= 2) {
        day = parts[0];
        const timeParts = parts[1].split("-");
        if (timeParts.length >= 2) {
          start = timeParts[0];
          end = timeParts[1];
        }
      } else {
        day = offering.schedule;
      }
    }

    return {
      day,
      start,
      end,
      code: offering.courseId?.code || "",
      name: offering.courseId?.name || "",
      room: offering.classroom || "",
      semester: offering.semesterId?.name || "",
    };
  });

  return scheduleItems;
};
