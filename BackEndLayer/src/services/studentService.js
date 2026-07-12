const Student = require("../models/Student");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Complaint = require("../models/Complaint");
const Payment = require("../models/Payment");
const CourseOffering = require("../models/CourseOffering");
const Semester = require("../models/Semester");
const Notification = require("../models/Notification");
const Attendance = require("../models/Attendance");
const Exam = require("../models/Exam");
const StudyPlan = require("../models/StudyPlan");
const AdvisingSession = require("../models/AdvisingSession");
const universityService = require("./universityService");

const getStudentDoc = async (studentUserId) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");
  return student;
};

exports.getProfile = async (studentUserId) => {
  const student = await Student.findOne({ userId: studentUserId }).populate(
    "departmentId",
    "name code",
  );
  if (!student) throw new Error("Student profile not found");
  const user = await User.findById(studentUserId);
  return {
    _id: student._id,
    userId: user._id,
    departmentId: student.departmentId?._id || null,
    advisorId: student.advisorId,
    GPA: student.GPA,
    level: student.level,
    name: user.name,
    email: user.email,
    universityId: user.universityId,
    departmentName: student.departmentId?.name || null,
    program: student.program,
  };
};

exports.updateProfile = async (studentUserId, updateData) => {
  const student = await Student.findOneAndUpdate(
    { userId: studentUserId },
    updateData,
    { new: true, runValidators: true },
  );
  if (!student) throw new Error("Student profile not found");
  return await exports.getProfile(studentUserId);
};

exports.getSettings = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  return student.settings;
};

exports.updateSettings = async (studentUserId, settingsData) => {
  const student = await Student.findOneAndUpdate(
    { userId: studentUserId },
    { settings: settingsData },
    { new: true, runValidators: true },
  );
  if (!student) throw new Error("Student profile not found");
  return student.settings;
};

exports.getDashboard = async (studentUserId) => {
  const student = await Student.findOne({ userId: studentUserId }).populate(
    "departmentId",
    "name",
  );
  if (!student) throw new Error("Student profile not found");
  const currentSemester = await universityService.getCurrentSemester();
  const [enrolledCoursesCount, pendingPaymentsCount, openComplaintsCount, enrollments] =
    await Promise.all([
      Enrollment.countDocuments({ studentId: student._id, status: "enrolled" }),
      Payment.countDocuments({ studentId: student._id, status: "pending" }),
      Complaint.countDocuments({
        studentId: student._id,
        status: { $in: ["pending", "in_progress"] },
      }),
      Enrollment.find({ studentId: student._id, status: "enrolled" }).populate(
        "courseId",
        "code name credits",
      ),
    ]);
  const currentCourses = enrollments.map((e) => ({
    code: e.courseId?.code,
    name: e.courseId?.name,
    credits: e.courseId?.credits,
    grade: e.grade || "N/A",
  }));
  const courseProgress = enrollments.map((e) => ({
    code: e.courseId?.code,
    name: e.courseId?.name,
    percent: e.grade ? 100 : 0,
    grade: e.grade || "N/A",
  }));
  return {
    student: {
      GPA: student.GPA,
      level: student.level,
      departmentName: student.departmentId?.name || "Unassigned",
    },
    currentSemester: currentSemester
      ? { name: currentSemester.name, registrationStatus: currentSemester.registrationStatus }
      : null,
    enrolledCourses: enrolledCoursesCount,
    pendingPayments: pendingPaymentsCount,
    openComplaints: openComplaintsCount,
    currentCourses,
    gpaTrend: [],
    courseProgress,
  };
};

exports.getCourseCatalog = async () => {
  const currentSemester = await universityService.getCurrentSemester();
  if (!currentSemester) throw new Error("No active semester");
  const offerings = await CourseOffering.find({ semesterId: currentSemester._id })
    .populate("courseId", "code name credits")
    .populate("professorId", "name");
  return offerings.map((o) => ({
    _id: o._id,
    courseCode: o.courseId?.code,
    courseName: o.courseId?.name,
    credits: o.courseId?.credits,
    professor: o.professorId?.name || "TBA",
    schedule: o.schedule,
    classroom: o.classroom,
    capacity: o.capacity,
    enrolledCount: o.enrolledCount,
    seatsAvailable: o.capacity - o.enrolledCount,
  }));
};

const parseSchedule = (scheduleStr) => {
  if (!scheduleStr) return [];
  const parts = scheduleStr.split(" ");
  if (parts.length < 2) return [];
  const daysPart = parts[0];
  const timePart = parts[1];
  const dayMap = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
  const days = daysPart.split("/");
  const [start, end] = timePart.includes("-") ? timePart.split("-") : [timePart, ""];
  return days.map((d) => ({
    day: dayMap[d] || d,
    start,
    end,
  }));
};

exports.getSchedule = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  const enrollments = await Enrollment.find({ studentId: student._id, status: "enrolled" })
    .populate("courseId", "code name")
    .populate({
      path: "offeringId",
      select: "schedule classroom professorId",
      populate: { path: "professorId", select: "name" },
    });
  const result = [];
  for (const e of enrollments) {
    const slots = parseSchedule(e.offeringId?.schedule);
    for (const slot of slots) {
      result.push({
        day: slot.day,
        start: slot.start,
        end: slot.end,
        code: e.courseId?.code,
        name: e.courseId?.name,
        room: e.offeringId?.classroom,
        professor: e.offeringId?.professorId?.name || "TBA",
      });
    }
  }
  return result;
};

exports.getGrades = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  const enrollments = await Enrollment.find({
    studentId: student._id,
    status: { $in: ["enrolled", "completed"] },
  }).populate("courseId", "code name credits");
  return {
    GPA: student.GPA,
    grades: enrollments.filter((e) => e.grade).map((e) => ({
      courseCode: e.courseId?.code,
      courseName: e.courseId?.name,
      credits: e.courseId?.credits,
      grade: e.grade,
    })),
  };
};

exports.getPayments = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  const payments = await Payment.find({ studentId: student._id })
    .populate("semesterId", "name")
    .sort({ createdAt: -1 });
  return payments.map((p) => ({
    _id: p._id,
    amount: p.amount,
    status: p.status,
    semesterId: p.semesterId?._id,
    semesterName: p.semesterId?.name,
    createdAt: p.createdAt,
  }));
};

exports.getMyEnrollments = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  return await Enrollment.find({ studentId: student._id, status: "enrolled" })
    .populate("courseId", "code name credits")
    .populate("offeringId", "schedule classroom");
};

exports.getMyComplaints = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  return await Complaint.find({ studentId: student._id }).sort({ createdAt: -1 });
};

exports.getMyAdvisingSessions = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  return await AdvisingSession.find({ studentId: student._id })
    .populate("advisorId", "name")
    .populate("semesterId", "name")
    .sort({ createdAt: -1 });
};

exports.createMyAdvisingSession = async (studentUserId, sessionData) => {
  const student = await getStudentDoc(studentUserId);
  const session = await AdvisingSession.create({
    studentId: student._id,
    advisorId: student.advisorId,
    semesterId: sessionData.semesterId,
    notes: sessionData.notes || "",
    status: "pending",
  });
  return session;
};

exports.getNotifications = async (studentUserId) => {
  const notifications = await Notification.find({ userId: studentUserId })
    .sort({ createdAt: -1 });
  return notifications.map((n) => ({
    _id: n._id,
    userId: n.userId,
    type: n.type,
    title: n.title,
    message: n.message,
    read: n.read,
    date: n.createdAt,
  }));
};

exports.markNotificationRead = async (studentUserId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId: studentUserId },
    { read: true },
    { new: true },
  );
  if (!notification) throw new Error("Notification not found");
  return notification;
};

exports.getStudentAttendance = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  const enrollments = await Enrollment.find({ studentId: student._id, status: "enrolled" })
    .populate("courseId", "code name");
  const courses = [];
  for (const e of enrollments) {
    const attendanceRecords = await Attendance.find({
      offeringId: e.offeringId,
      "records.studentId": student._id,
    });
    let attended = 0;
    let total = 0;
    for (const a of attendanceRecords) {
      const record = a.records.find((r) => r.studentId.toString() === student._id.toString());
      if (record) {
        total++;
        if (record.status === "present") attended++;
      }
    }
    courses.push({
      code: e.courseId?.code,
      name: e.courseId?.name,
      attended,
      total,
      percent: total > 0 ? Math.round((attended / total) * 100) : 0,
    });
  }
  return { _id: student._id, studentId: student._id, courses };
};

exports.getExams = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  const enrollments = await Enrollment.find({ studentId: student._id, status: "enrolled" });
  const offeringIds = enrollments.map((e) => e.offeringId);
  const exams = await Exam.find({ offeringId: { $in: offeringIds } })
    .populate("courseId", "code name")
    .sort({ date: 1 });
  return exams.map((ex) => ({
    _id: ex._id,
    courseCode: ex.courseId?.code,
    courseName: ex.courseId?.name,
    date: ex.date,
    startTime: ex.startTime,
    endTime: ex.endTime,
    room: ex.room,
    status: new Date(ex.date) > new Date() ? "scheduled" : "completed",
  }));
};

exports.getTranscript = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  const enrollments = await Enrollment.find({ studentId: student._id })
    .populate("courseId", "code name credits")
    .populate("offeringId", "semesterId schedule classroom");
  const semesterMap = {};
  for (const e of enrollments) {
    let semName = "Unknown";
    if (e.offeringId && e.offeringId.semesterId) {
      const sem = await Semester.findById(e.offeringId.semesterId);
      semName = sem?.name || "Unknown";
    }
    if (!semesterMap[semName]) {
      semesterMap[semName] = { name: semName, gpa: 0, totalCredits: 0, courses: [] };
    }
    semesterMap[semName].courses.push({
      code: e.courseId?.code,
      name: e.courseId?.name,
      credits: e.courseId?.credits,
      grade: e.grade || "N/A",
    });
  }
  return {
    _id: student._id,
    studentId: student._id,
    semesters: Object.values(semesterMap),
  };
};

exports.getStudyPlan = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  let plan = await StudyPlan.findOne({ studentId: student._id });
  if (!plan) {
    plan = await StudyPlan.create({
      studentId: student._id,
      degreeName: "Bachelor of Science",
      totalRequired: 120,
      years: [
        {
          year: 1,
          semesters: [
            {
              name: "Fall",
              courses: [],
            },
            {
              name: "Spring",
              courses: [],
            },
          ],
        },
      ],
    });
  }
  return plan;
};

exports.submitSemesterRegistration = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  const currentSemester = await universityService.getCurrentSemester();
  if (!currentSemester) throw new Error("No active semester for registration");
  if (currentSemester.registrationStatus !== "open") {
    throw new Error("Semester registration is not currently open");
  }
  return { message: "Semester registration submitted successfully", semesterId: currentSemester._id };
};

exports.saveGpaCalculation = async (studentUserId, calculationData) => {
  return { message: "GPA calculation saved", data: calculationData };
};

exports.getOfferingStudents = async (offeringId) => {
  const enrollments = await Enrollment.find({ offeringId, status: "enrolled" })
    .populate({
      path: "studentId",
      select: "GPA level",
      populate: { path: "userId", select: "name universityId" },
    });
  return enrollments.map((e) => ({
    _id: e.studentId?._id,
    userId: {
      name: e.studentId?.userId?.name,
      universityId: e.studentId?.userId?.universityId,
    },
    GPA: e.studentId?.GPA,
    level: e.studentId?.level,
    grade: e.grade,
  }));
};
