const Professor = require("../models/Professor");
const Student = require("../models/Student");
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

  const User = require("../models/User");
  const studentsWithData = await Promise.all(
    enrollments.map(async (enrollment) => {
      const user = await User.findById(enrollment.studentId.userId);
      const student = await Student.findById(enrollment.studentId._id);
      return {
        _id: enrollment.studentId._id,
        userId: { name: user.name, universityId: user.universityId },
        GPA: student?.GPA || 0,
        level: student?.level || 1,
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

// 10. Get Dashboard Overview
exports.getDashboard = async (professorUserId) => {
  const professor = await Professor.findOne({ userId: professorUserId });
  if (!professor) throw new Error("Professor profile not found");

  const offerings = await CourseOffering.find({ professorId: professor._id });
  const offeringIds = offerings.map((o) => o._id);

  const [
    enrollments,
    attendanceRecords,
    pendingGrades,
    upcomingAssignments,
    recentNotifications,
  ] = await Promise.all([
    Enrollment.find({ offeringId: { $in: offeringIds }, status: "enrolled" }),
    Attendance.find({ offeringId: { $in: offeringIds } }),
    Enrollment.countDocuments({
      offeringId: { $in: offeringIds },
      status: "enrolled",
      grade: null,
    }),
    Assignment.countDocuments({
      offeringId: { $in: offeringIds },
      dueDate: { $gt: new Date() },
    }),
    Notification.find({ userId: professorUserId })
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  const totalStudents = enrollments.length;

  let totalPresent = 0;
  let totalRecords = 0;
  attendanceRecords.forEach((att) => {
    att.records.forEach((r) => {
      totalRecords++;
      if (r.status === "present") totalPresent++;
    });
  });
  const avgAttendance =
    totalRecords > 0
      ? ((totalPresent / totalRecords) * 100).toFixed(1) + "%"
      : "0%";

  const today = new Date();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = dayNames[today.getDay()];

  const todayOfferings = offerings.filter(
    (o) => o.schedule && o.schedule.includes(todayName),
  );
  const agenda = await Promise.all(
    todayOfferings.map(async (offering) => {
      const course = await mongoose.model("Course").findById(offering.courseId);
      const enrolled = await Enrollment.countDocuments({
        offeringId: offering._id,
        status: "enrolled",
      });
      let start = "";
      let end = "";
      if (offering.schedule) {
        const parts = offering.schedule.split(" ");
        if (parts.length >= 2) {
          const timeParts = parts[1].split("-");
          if (timeParts.length >= 2) {
            start = timeParts[0];
            end = timeParts[1];
          }
        }
      }
      return {
        id: offering._id,
        time: `${start} - ${end}`,
        course: `${course?.name || "Unknown"} (${course?.code || ""})`,
        location: offering.classroom || "TBD",
        students: enrolled,
        action: "Start Roll Call",
        type: "primary",
      };
    }),
  );

  const currentCourses = await Promise.all(
    offerings.slice(0, 5).map(async (offering) => {
      const course = await mongoose.model("Course").findById(offering.courseId);
      const enrolled = await Enrollment.countDocuments({
        offeringId: offering._id,
        status: "enrolled",
      });
      const total = await Enrollment.countDocuments({
        offeringId: offering._id,
      });
      return {
        id: course?.code || offering._id,
        type: course?.name || "Unknown",
        details: `${enrolled} STUDENTS`,
        progress: total > 0 ? Math.round((enrolled / total) * 100) : 0,
      };
    }),
  );

  const performanceChart = offerings.slice(0, 5).map((offering, idx) => ({
    name: `O${idx + 1}`,
    value: Math.floor(Math.random() * 40) + 60,
  }));

  return {
    metrics: {
      totalStudents,
      studentsTrend: "+0%",
      avgAttendance,
      attendanceTrend: "-0%",
      pendingGrades,
      academicAlerts: pendingGrades > 0 ? Math.min(pendingGrades, 10) : 0,
    },
    agenda,
    currentCourses,
    recentActivity: recentNotifications.map((n, idx) => ({
      id: idx,
      text: n.title,
      subtext: n.message,
      count: null,
      time: n.createdAt
        ? new Date(n.createdAt).toLocaleTimeString()
        : "",
      type: n.type || "info",
    })),
    performanceChart,
  };
};

// 11. Get Grades Overview (all offerings)
exports.getGradesOverview = async (professorUserId) => {
  const professor = await Professor.findOne({ userId: professorUserId });
  if (!professor) throw new Error("Professor profile not found");

  const offerings = await CourseOffering.find({ professorId: professor._id });
  const offeringIds = offerings.map((o) => o._id);

  const enrollments = await Enrollment.find({
    offeringId: { $in: offeringIds },
  }).populate("studentId", "userId").populate("courseId", "code name");

  const User = require("../models/User");
  const students = await Promise.all(
    enrollments.map(async (enrollment) => {
      const studentUser = enrollment.studentId?.userId
        ? await User.findById(enrollment.studentId.userId)
        : null;
      return {
        _id: enrollment.studentId?._id,
        name: studentUser?.name || "Unknown",
        studentId: studentUser?.universityId || "",
        score: enrollment.grade
          ? String(enrollment.grade)
          : "--",
        grade: enrollment.grade || "--",
        courseCode: enrollment.courseId?.code || "",
      };
    }),
  );

  let sumScores = 0;
  let gradedItems = 0;
  let highestScoreNum = 0;
  let highestGrade = "--";

  students.forEach((student) => {
    if (student.score && student.score !== "--") {
      const scoreNum = parseFloat(student.score);
      if (!isNaN(scoreNum)) {
        sumScores += scoreNum;
        gradedItems++;
        if (scoreNum > highestScoreNum) {
          highestScoreNum = scoreNum;
          highestGrade = student.grade;
        }
      }
    }
  });

  return {
    metrics: {
      averageScore:
        gradedItems > 0
          ? (sumScores / gradedItems).toFixed(1)
          : "0",
      gradedItems: `${gradedItems}/${students.length}`,
      highestScore: highestScoreNum.toFixed(1),
      highestGrade,
      publishStatus: "Draft",
    },
    students,
  };
};

// 12. Get Performance Analytics
exports.getPerformance = async (professorUserId) => {
  const professor = await Professor.findOne({ userId: professorUserId });
  if (!professor) throw new Error("Professor profile not found");

  const offerings = await CourseOffering.find({ professorId: professor._id });
  const offeringIds = offerings.map((o) => o._id);

  const enrollments = await Enrollment.find({
    offeringId: { $in: offeringIds },
    status: "enrolled",
  }).populate("studentId", "userId GPA level");

  const User = require("../models/User");

  const attendanceRecords = await Attendance.find({
    offeringId: { $in: offeringIds },
  });

  const studentMap = new Map();
  for (const enrollment of enrollments) {
    const sid = enrollment.studentId?._id?.toString();
    if (!sid) continue;
    if (!studentMap.has(sid)) {
      const user = enrollment.studentId?.userId
        ? await User.findById(enrollment.studentId.userId)
        : null;
      studentMap.set(sid, {
        _id: sid,
        name: user?.name || "Unknown",
        studentId: user?.universityId || "",
        GPA: enrollment.studentId?.GPA || 0,
        attendanceCount: 0,
        totalClasses: 0,
        assignments: 0,
        gradedAssignments: 0,
      });
    }
    const student = studentMap.get(sid);
    if (enrollment.grade) {
      student.gradedAssignments++;
    }
    student.assignments++;
  }

  for (const att of attendanceRecords) {
    for (const record of att.records) {
      const sid = record.studentId?.toString();
      if (studentMap.has(sid)) {
        const student = studentMap.get(sid);
        student.totalClasses++;
        if (record.status === "present") student.attendanceCount++;
      }
    }
  }

  const students = Array.from(studentMap.values()).map((s) => {
    const attendanceRate =
      s.totalClasses > 0
        ? ((s.attendanceCount / s.totalClasses) * 100).toFixed(1)
        : 0;
    let risk = "HEALTHY";
    if (s.GPA < 2.0 || Number(attendanceRate) < 70) risk = "CRITICAL";
    else if (s.GPA < 2.5 || Number(attendanceRate) < 80) risk = "WARNING";

    return {
      _id: s._id,
      name: s.name,
      studentId: s.studentId,
      engagement: `${attendanceRate}%`,
      midterm: s.GPA >= 3.5 ? "A" : s.GPA >= 3.0 ? "B" : s.GPA >= 2.0 ? "C" : "F",
      score: `(${s.GPA.toFixed(2)}/4.0)`,
      risk,
      iconType: risk === "CRITICAL" ? "mail" : risk === "WARNING" ? "calendar" : "eye",
    };
  });

  const atRisk = students.filter((s) => s.risk === "CRITICAL").length;
  const avgGpa =
    students.length > 0
      ? (
          students.reduce((sum, s) => sum + (s.GPA || 0), 0) / students.length
        ).toFixed(2)
      : "0.00";
  const avgAttendance =
    students.length > 0
      ? (
          students.reduce(
            (sum, s) => sum + parseFloat(s.engagement || "0"),
            0,
          ) / students.length
        ).toFixed(1) + "%"
      : "0%";

  const engagementChart = [
    { name: "Week 1", value: 30 },
    { name: "Week 2", value: 45 },
    { name: "Week 3", value: 35 },
    { name: "Week 4", value: 65 },
    { name: "Week 5", value: 40 },
    { name: "Week 6", value: 75 },
    { name: "Week 7", value: 50 },
    { name: "Week 8", value: 85 },
  ];

  return {
    metrics: { gpa: avgGpa, attendance: avgAttendance, atRisk, totalStudents: students.length },
    students,
    priorityList: students,
    engagementChart,
  };
};
