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
const SemesterRegistration = require("../models/SemesterRegistration");
const Setting = require("../models/Setting");
const universityService = require("./universityService");

const GRADE_POINTS = { "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0 };

const computeGPA = async (studentId) => {
  const enrollments = await Enrollment.find({
    studentId,
    status: { $in: ["completed", "enrolled"] },
    grade: { $ne: null },
  }).populate("courseId", "credits");
  let totalPoints = 0;
  let totalCredits = 0;
  for (const e of enrollments) {
    const gp = GRADE_POINTS[e.grade];
    const cr = e.courseId?.credits || 0;
    if (gp !== undefined && cr > 0) {
      totalPoints += gp * cr;
      totalCredits += cr;
    }
  }
  return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
};

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
  const gpa = await computeGPA(student._id);
  return {
    _id: student._id,
    userId: user._id,
    departmentId: student.departmentId?._id || null,
    advisorId: student.advisorId,
    GPA: gpa,
    level: student.level,
    name: user.name,
    email: user.email,
    universityId: user.universityId,
    departmentName: student.departmentId?.name || null,
    program: student.program,
  };
};

exports.updateProfile = async (studentUserId, updateData) => {
  const { name, ...studentData } = updateData;

  if (name !== undefined) {
    await User.findByIdAndUpdate(studentUserId, { name }, { runValidators: true });
  }

  if (Object.keys(studentData).length > 0) {
    await Student.findOneAndUpdate(
      { userId: studentUserId },
      studentData,
      { returnDocument: "after", runValidators: true },
    );
  }

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
    { returnDocument: "after", runValidators: true },
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
  const [enrolledCoursesCount, pendingPaymentsCount, openComplaintsCount, enrollments, allEnrollments] =
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
      Enrollment.find({
        studentId: student._id,
        status: { $in: ["completed", "enrolled"] },
      })
        .populate("courseId", "code name credits")
        .populate("offeringId", "semesterId"),
    ]);

  const semIds = [...new Set(allEnrollments.map((e) => e.offeringId?.semesterId?.toString()).filter(Boolean))];
  const semDocs = await Semester.find({ _id: { $in: semIds } });
  const semMap = {};
  for (const s of semDocs) semMap[s._id.toString()] = s;

  const semesterMap = {};
  for (const e of allEnrollments) {
    const semId = e.offeringId?.semesterId?.toString();
    if (!semId) continue;
    const sem = semMap[semId];
    const semName = sem?.name || "Unknown";
    if (!semesterMap[semName]) {
      semesterMap[semName] = { name: semName, startDate: sem?.startDate || null, totalPoints: 0, totalCredits: 0 };
    }
    const gp = GRADE_POINTS[e.grade];
    const cr = e.courseId?.credits || 0;
    if (gp !== undefined && cr > 0 && e.status === "completed") {
      semesterMap[semName].totalPoints += gp * cr;
      semesterMap[semName].totalCredits += cr;
    }
  }
  const gpaTrend = Object.values(semesterMap)
    .filter((s) => s.totalCredits > 0)
    .map((s) => ({
      semester: s.name,
      gpa: Math.round((s.totalPoints / s.totalCredits) * 100) / 100,
    }))
    .sort((a, b) => {
      if (semesterMap[a.semester]?.startDate && semesterMap[b.semester]?.startDate) {
        return new Date(semesterMap[a.semester].startDate) - new Date(semesterMap[b.semester].startDate);
      }
      return 0;
    });

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
  const gpa = await computeGPA(student._id);
  return {
    student: {
      GPA: gpa,
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
    gpaTrend,
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
    _id: o.courseId?._id || o._id,
    offeringId: o._id,
    code: o.courseId?.code,
    name: o.courseId?.name,
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
  const currentSemester = await universityService.getCurrentSemester();
  if (!currentSemester) return [];

  const enrollments = await Enrollment.find({ studentId: student._id, status: "enrolled" })
    .populate("courseId", "code name")
    .populate({
      path: "offeringId",
      select: "schedule classroom professorId semesterId",
      populate: [
        { path: "professorId", select: "name" },
        { path: "semesterId", select: "_id" },
      ],
    });

  const result = [];
  for (const e of enrollments) {
    if (e.offeringId?.semesterId?._id?.toString() !== currentSemester._id.toString()) continue;
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
  const gpa = await computeGPA(student._id);
  return {
    GPA: gpa,
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
    .populate("semesterId", "name code")
    .sort({ createdAt: -1 });
  return payments.map((p) => ({
    _id: p._id,
    studentId: p.studentId,
    semesterId: p.semesterId?._id || p.semesterId,
    semesterName: p.semesterId?.name || null,
    description: p.description,
    amount: p.amount,
    paymentMethod: p.paymentMethod,
    transactionId: p.transactionId,
    status: p.status,
    dueDate: p.dueDate,
    paidAt: p.paidAt,
    createdAt: p.createdAt,
  }));
};

exports.getMyEnrollments = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  return await Enrollment.find({ studentId: student._id })
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
  if (!student.advisorId) throw new Error("No advisor assigned. Please contact administration.");
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
    { returnDocument: "after" },
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
  const enrollments = await Enrollment.find({
    studentId: student._id,
    status: { $in: ["completed", "enrolled"] },
  })
    .populate("courseId", "code name credits")
    .populate("offeringId", "semesterId schedule classroom");

  const gradePoints = GRADE_POINTS;

  const semIds = [...new Set(enrollments.map((e) => e.offeringId?.semesterId?.toString()).filter(Boolean))];
  const semDocs = await Semester.find({ _id: { $in: semIds } });
  const semMapDocs = {};
  for (const s of semDocs) {
    semMapDocs[s._id.toString()] = s;
  }

  const semesterMap = {};
  for (const e of enrollments) {
    let semName = "Unknown";
    let semStartDate = null;
    if (e.offeringId && e.offeringId.semesterId) {
      const sem = semMapDocs[e.offeringId.semesterId.toString()];
      semName = sem?.name || "Unknown";
      semStartDate = sem?.startDate || null;
    }
    if (!semesterMap[semName]) {
      semesterMap[semName] = { name: semName, startDate: semStartDate, gpa: 0, totalCredits: 0, courses: [] };
    }

    const isCompleted = e.status === "completed" && e.grade;
    semesterMap[semName].courses.push({
      code: e.courseId?.code,
      name: e.courseId?.name,
      credits: e.courseId?.credits || 0,
      grade: isCompleted ? e.grade : "In Progress",
      status: e.status,
    });
  }

  for (const sem of Object.values(semesterMap)) {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const c of sem.courses) {
      if (c.status === "completed" && c.grade && gradePoints[c.grade] !== undefined && c.credits > 0) {
        totalPoints += gradePoints[c.grade] * c.credits;
        totalCredits += c.credits;
      }
    }
    sem.totalCredits = totalCredits;
    sem.gpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
  }

  const sortedSemesters = Object.values(semesterMap).sort((a, b) => {
    if (a.startDate && b.startDate) return new Date(b.startDate) - new Date(a.startDate);
    if (a.startDate) return -1;
    if (b.startDate) return 1;
    return b.name.localeCompare(a.name);
  });

  return {
    _id: student._id,
    studentId: student._id,
    semesters: sortedSemesters.map(({ startDate, ...rest }) => rest),
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

  const existing = await SemesterRegistration.findOne({
    studentId: student._id,
    semesterId: currentSemester._id,
  });

  if (existing) {
    return { message: "Semester registration already submitted", semesterId: currentSemester._id, alreadyRegistered: true };
  }

  await SemesterRegistration.create({
    studentId: student._id,
    semesterId: currentSemester._id,
  });

  return { message: "Semester registration submitted successfully", semesterId: currentSemester._id, alreadyRegistered: false };
};

exports.getSemesterRegistrationInfo = async (studentUserId) => {
  const student = await getStudentDoc(studentUserId);
  const currentSemester = await universityService.getCurrentSemester();
  if (!currentSemester) return null;

  const registration = await SemesterRegistration.findOne({
    studentId: student._id,
    semesterId: currentSemester._id,
  });

  const offerings = await CourseOffering.find({ semesterId: currentSemester._id })
    .populate("courseId", "code name credits")
    .populate("professorId", "name");

  const enrollments = await Enrollment.find({ studentId: student._id })
    .populate("courseId", "code name credits")
    .populate({
      path: "offeringId",
      select: "semesterId schedule classroom",
      populate: { path: "semesterId", select: "_id" },
    });

  const completedCourseIds = new Set(
    enrollments
      .filter((e) => e.status === "completed" && e.courseId?._id)
      .map((e) => e.courseId._id.toString())
  );

  const currentEnrolledCourseIds = new Set(
    enrollments
      .filter((e) => e.status === "enrolled" && e.offeringId?.semesterId?._id?.toString() === currentSemester._id.toString() && e.courseId?._id)
      .map((e) => e.courseId._id.toString())
  );

  const availableCourses = offerings
    .filter((o) => {
      const cid = o.courseId?._id?.toString();
      return (
        cid &&
        !completedCourseIds.has(cid) &&
        !currentEnrolledCourseIds.has(cid) &&
        o.enrolledCount < o.capacity
      );
    })
    .map((o) => ({
      _id: o.courseId?._id,
      offeringId: o._id,
      code: o.courseId?.code,
      name: o.courseId?.name,
      credits: o.courseId?.credits,
      professor: o.professorId?.name || "TBA",
      schedule: o.schedule,
      classroom: o.classroom,
      capacity: o.capacity,
      enrolledCount: o.enrolledCount,
      seatsAvailable: o.capacity - o.enrolledCount,
    }));

  const currentEnrollments = enrollments
    .filter((e) => e.offeringId?.semesterId?._id?.toString() === currentSemester._id.toString() && e.status === "enrolled")
    .map((e) => ({
      _id: e._id,
      courseId: e.courseId?._id,
      code: e.courseId?.code,
      name: e.courseId?.name,
      credits: e.courseId?.credits,
      schedule: e.offeringId?.schedule,
      classroom: e.offeringId?.classroom,
      status: e.status,
    }));

  const enrolledCredits = currentEnrollments.reduce((sum, e) => sum + (e.credits || 0), 0);

  const completedCredits = await Enrollment.aggregate([
    { $match: { studentId: student._id, status: "completed" } },
    { $lookup: { from: "courses", localField: "courseId", foreignField: "_id", as: "course" } },
    { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
    { $group: { _id: null, total: { $sum: "$course.credits" } } },
  ]);

  const earnedCredits = completedCredits.length > 0 ? completedCredits[0].total : 0;
  const plan = await StudyPlan.findOne({ studentId: student._id });
  const requiredCredits = plan?.totalRequired || 120;
  const maxSetting = await Setting.findOne({ key: "maxCreditsPerSemester" });
  const maxCredits = maxSetting?.value || 18;

  return {
    semester: { name: currentSemester.name, registrationStatus: currentSemester.registrationStatus },
    isRegistered: !!registration,
    registeredAt: registration?.registeredAt || null,
    availableCourses,
    enrolledCourses: currentEnrollments,
    enrolledCredits,
    maxCredits,
    earnedCredits,
    requiredCredits,
    remainingCredits: requiredCredits - earnedCredits,
  };
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
