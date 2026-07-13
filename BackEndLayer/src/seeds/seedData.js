const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const User = require("../models/User");
const Department = require("../models/Department");
const Semester = require("../models/Semester");
const Course = require("../models/Course");
const CourseOffering = require("../models/CourseOffering");
const Student = require("../models/Student");
const Professor = require("../models/Professor");
const Advisor = require("../models/Advisor");
const Enrollment = require("../models/Enrollment");
const AdvisingSession = require("../models/AdvisingSession");
const Attendance = require("../models/Attendance");
const Assignment = require("../models/Assignment");
const Exam = require("../models/Exam");
const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");
const Payment = require("../models/Payment");
const Setting = require("../models/Setting");
const StudyPlan = require("../models/StudyPlan");
const SemesterRegistration = require("../models/SemesterRegistration");

const SEED_PASSWORD = "Test@123";
const RESET_MODE = process.argv.includes("--reset");

const DEPARTMENTS = [
  { name: "General", code: "GEN" },
  { name: "Medical", code: "MED" },
  { name: "Software Engineering", code: "SE" },
  { name: "Information Systems", code: "IS" },
  { name: "Computer Science", code: "CS" },
  { name: "Artificial Intelligence", code: "AI" },
  { name: "Information Technology", code: "IT" },
];

const SEMESTERS = [
  {
    name: "Fall 2024",
    code: "F24",
    registrationStatus: "ongoing",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2025-01-15"),
  },
  {
    name: "Spring 2025",
    code: "S25",
    registrationStatus: "open",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-06-15"),
  },
  {
    name: "Summer 2025",
    code: "SU25",
    registrationStatus: "upcoming",
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-08-31"),
  },
];

const COURSES_BY_DEPT = {
  GEN: [
    { code: "GEN101", name: "English Composition", credits: 3 },
    { code: "GEN102", name: "Calculus I", credits: 3 },
    { code: "GEN103", name: "Critical Thinking", credits: 3 },
    { code: "GEN201", name: "Technical Writing", credits: 3 },
    { code: "GEN202", name: "Probability & Statistics", credits: 3 },
  ],
  MED: [
    { code: "MED101", name: "Human Anatomy", credits: 4 },
    { code: "MED102", name: "Physiology", credits: 4 },
    { code: "MED103", name: "Biochemistry", credits: 3 },
    { code: "MED201", name: "Pharmacology", credits: 3 },
    { code: "MED202", name: "Pathology", credits: 3 },
    { code: "MED301", name: "Clinical Practice", credits: 6 },
  ],
  SE: [
    { code: "SE101", name: "Intro to Software Engineering", credits: 3 },
    { code: "SE102", name: "Requirements Engineering", credits: 3 },
    { code: "SE103", name: "Software Design Patterns", credits: 3 },
    { code: "SE201", name: "Software Testing & Quality", credits: 3 },
    { code: "SE202", name: "Software Project Management", credits: 3 },
    { code: "SE301", name: "DevOps & CI/CD", credits: 3 },
  ],
  IS: [
    { code: "IS101", name: "Intro to Information Systems", credits: 3 },
    { code: "IS102", name: "Systems Analysis & Design", credits: 3 },
    { code: "IS103", name: "Database Management", credits: 3 },
    { code: "IS201", name: "Enterprise Systems", credits: 3 },
    { code: "IS202", name: "Business Intelligence", credits: 3 },
    { code: "IS301", name: "IT Governance & Risk", credits: 3 },
  ],
  CS: [
    { code: "CS101", name: "Intro to Programming", credits: 3 },
    { code: "CS102", name: "Data Structures", credits: 3 },
    { code: "CS103", name: "Discrete Mathematics", credits: 3 },
    { code: "CS201", name: "Algorithms", credits: 3 },
    { code: "CS202", name: "Operating Systems", credits: 3 },
    { code: "CS203", name: "Computer Networks", credits: 3 },
    { code: "CS301", name: "Database Systems", credits: 3 },
    { code: "CS302", name: "Compiler Design", credits: 3 },
  ],
  AI: [
    { code: "AI101", name: "Intro to Artificial Intelligence", credits: 3 },
    { code: "AI102", name: "Machine Learning", credits: 3 },
    { code: "AI103", name: "Mathematics for AI", credits: 3 },
    { code: "AI201", name: "Deep Learning", credits: 3 },
    { code: "AI202", name: "Natural Language Processing", credits: 3 },
    { code: "AI203", name: "Computer Vision", credits: 3 },
    { code: "AI301", name: "Reinforcement Learning", credits: 3 },
  ],
  IT: [
    { code: "IT101", name: "Intro to Information Technology", credits: 3 },
    { code: "IT102", name: "Web Development", credits: 3 },
    { code: "IT103", name: "Network Administration", credits: 3 },
    { code: "IT201", name: "Cybersecurity Fundamentals", credits: 3 },
    { code: "IT202", name: "Cloud Computing", credits: 3 },
    { code: "IT203", name: "Mobile App Development", credits: 3 },
    { code: "IT301", name: "IT Infrastructure", credits: 3 },
  ],
};

const OFFERING_SCHEDULES = [
  "Sun/Tue 08:00-09:30",
  "Sun/Tue 10:00-11:30",
  "Sun/Tue 12:00-13:30",
  "Mon/Wed 08:00-09:30",
  "Mon/Wed 10:00-11:30",
  "Mon/Wed 12:00-13:30",
  "Tue/Thu 08:00-09:30",
  "Tue/Thu 10:00-11:30",
  "Tue/Thu 12:00-13:30",
  "Sat 09:00-12:00",
];

const CLASSROOMS = [
  "Hall A",
  "Hall B",
  "Lab 101",
  "Lab 102",
  "Room 201",
  "Room 202",
  "Room 203",
  "Lecture Theatre 1",
  "Lecture Theatre 2",
  "Online",
];

const PROFESSOR_USERS = [
  { name: "Dr. Ahmed Hassan", email: "ahmed.hassan@morshed.com", universityId: "PR001", role: "professor" },
  { name: "Dr. Sara Khalil", email: "sara.khalil@morshed.com", universityId: "PR002", role: "professor" },
  { name: "Dr. Omar Farouk", email: "omar.farouk@morshed.com", universityId: "PR003", role: "professor" },
  { name: "Dr. Layla Mahmoud", email: "layla.mahmoud@morshed.com", universityId: "PR004", role: "professor" },
  { name: "Dr. Youssef Ali", email: "youssef.ali@morshed.com", universityId: "PR005", role: "professor" },
  { name: "Dr. Nour Ibrahim", email: "nour.ibrahim@morshed.com", universityId: "PR006", role: "professor" },
  { name: "Dr. Karim Mansour", email: "karim.mansour@morshed.com", universityId: "PR007", role: "professor" },
];

const ADVISOR_USERS = [
  { name: "Prof. Mona Said", email: "mona.said@morshed.com", universityId: "ADVS001", role: "advisor" },
  { name: "Prof. Tamer Nour", email: "tamer.nour@morshed.com", universityId: "ADVS002", role: "advisor" },
  { name: "Prof. Hana Youssef", email: "hana.youssef@morshed.com", universityId: "ADVS003", role: "advisor" },
];

const STUDENT_USERS = [
  { name: "Mohamed Ali", email: "mohamed.ali@student.morshed.com", universityId: "STU001", role: "student" },
  { name: "Fatma Hassan", email: "fatma.hassan@student.morshed.com", universityId: "STU002", role: "student" },
  { name: "Omar Mahmoud", email: "omar.mahmoud@student.morshed.com", universityId: "STU003", role: "student" },
  { name: "Yasmin Khalid", email: "yasmin.khalid@student.morshed.com", universityId: "STU004", role: "student" },
  { name: "Ahmed Nabil", email: "ahmed.nabil@student.morshed.com", universityId: "STU005", role: "student" },
  { name: "Salma Adel", email: "salma.adel@student.morshed.com", universityId: "STU006", role: "student" },
  { name: "Khaled Mostafa", email: "khaled.mostafa@student.morshed.com", universityId: "STU007", role: "student" },
  { name: "Nada Samir", email: "nada.samir@student.morshed.com", universityId: "STU008", role: "student" },
  { name: "Hassan Ibrahim", email: "hassan.ibrahim@student.morshed.com", universityId: "STU009", role: "student" },
  { name: "Mariam Ashraf", email: "mariam.ashraf@student.morshed.com", universityId: "STU010", role: "student" },
  { name: "Tarek Fathy", email: "tarek.fathy@student.morshed.com", universityId: "STU011", role: "student" },
  { name: "Huda Mansi", email: "huda.mansi@student.morshed.com", universityId: "STU012", role: "student" },
];

const STUDENT_PROFILES = [
  { userIdx: 0, deptCode: "CS", gpa: 3.7, level: 3, program: "Computer Science" },
  { userIdx: 1, deptCode: "AI", gpa: 3.9, level: 2, program: "Artificial Intelligence" },
  { userIdx: 2, deptCode: "SE", gpa: 3.2, level: 1, program: "Software Engineering" },
  { userIdx: 3, deptCode: "IS", gpa: 3.5, level: 4, program: "Information Systems" },
  { userIdx: 4, deptCode: "IT", gpa: 2.8, level: 2, program: "Information Technology" },
  { userIdx: 5, deptCode: "MED", gpa: 3.8, level: 3, program: "Medical" },
  { userIdx: 6, deptCode: "CS", gpa: 3.1, level: 1, program: "Computer Science" },
  { userIdx: 7, deptCode: "AI", gpa: 3.6, level: 2, program: "Artificial Intelligence" },
  { userIdx: 8, deptCode: "SE", gpa: 2.5, level: 3, program: "Software Engineering" },
  { userIdx: 9, deptCode: "IS", gpa: 3.4, level: 1, program: "Information Systems" },
  { userIdx: 10, deptCode: "IT", gpa: 3.0, level: 2, program: "Information Technology" },
  { userIdx: 11, deptCode: "CS", gpa: 3.3, level: 4, program: "Computer Science" },
];

const PROFESSOR_PROFILES = [
  { userIdx: 0, deptCode: "CS", title: "Professor" },
  { userIdx: 1, deptCode: "AI", title: "Associate Professor" },
  { userIdx: 2, deptCode: "SE", title: "Assistant Professor" },
  { userIdx: 3, deptCode: "IS", title: "Professor" },
  { userIdx: 4, deptCode: "IT", title: "Associate Professor" },
  { userIdx: 5, deptCode: "MED", title: "Professor" },
  { userIdx: 6, deptCode: "GEN", title: "Lecturer" },
];

const ADVISOR_PROFILES = [
  { userIdx: 0, deptCode: "CS", title: "Senior Advisor" },
  { userIdx: 1, deptCode: "SE", title: "Academic Advisor" },
  { userIdx: 2, deptCode: "IS", title: "Academic Advisor" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB\n");

    if (RESET_MODE) {
      console.log("=== RESETTING DATABASE ===");
      const collections = [
        User, Department, Semester, Course, CourseOffering, Student, Professor, Advisor,
        Enrollment, AdvisingSession, Attendance, Assignment, Exam, Complaint, Notification,
        Payment, Setting, StudyPlan, SemesterRegistration,
      ];
      for (const col of collections) {
        await col.deleteMany({});
      }
      console.log("  All collections cleared\n");
    }

    // ===================== DEPARTMENTS =====================
    console.log("=== SEEDING DEPARTMENTS ===");
    const deptMap = {};
    for (const d of DEPARTMENTS) {
      const dept = await Department.findOneAndUpdate(
        { code: d.code },
        { $setOnInsert: d },
        { upsert: true, returnDocument: "after" },
      );
      deptMap[d.code] = dept._id;
      console.log(`  ${d.code}: ${d.name}`);
    }

    // ===================== SEMESTERS =====================
    console.log("\n=== SEEDING SEMESTERS ===");
    const semMap = {};
    for (const s of SEMESTERS) {
      const sem = await Semester.findOneAndUpdate(
        { code: s.code },
        { $setOnInsert: s },
        { upsert: true, returnDocument: "after" },
      );
      semMap[s.code] = sem._id;
      console.log(`  ${s.code}: ${s.name} [${s.registrationStatus}]`);
    }

    // ===================== COURSES =====================
    console.log("\n=== SEEDING COURSES ===");
    const courseMap = {};
    let courseCount = 0;
    for (const [deptCode, courses] of Object.entries(COURSES_BY_DEPT)) {
      for (const c of courses) {
        const course = await Course.findOneAndUpdate(
          { code: c.code },
          { ...c, departmentId: deptMap[deptCode] },
          { upsert: true, returnDocument: "after" },
        );
        courseMap[c.code] = course._id;
        courseCount++;
      }
    }
    console.log(`  ${courseCount} courses seeded`);

    // ===================== COURSE OFFERINGS =====================
    console.log("\n=== SEEDING COURSE OFFERINGS ===");
    const offeringMap = {};
    let offeringCount = 0;
    const allCourseCodes = Object.values(COURSES_BY_DEPT).flat().map((c) => c.code);

    for (const semCode of ["F24", "S25"]) {
      const semId = semMap[semCode];
      for (let i = 0; i < allCourseCodes.length; i++) {
        const code = allCourseCodes[i];
        const existing = await CourseOffering.findOne({
          courseId: courseMap[code],
          semesterId: semId,
        });
        if (!existing) {
          const offering = await CourseOffering.create({
            courseId: courseMap[code],
            semesterId: semId,
            schedule: OFFERING_SCHEDULES[i % OFFERING_SCHEDULES.length],
            classroom: CLASSROOMS[i % CLASSROOMS.length],
            capacity: 30,
            enrolledCount: 0,
          });
          offeringMap[`${code}_${semCode}`] = offering._id;
          offeringCount++;
          console.log(
          `  ${code} - ${OFFERING_SCHEDULES[i % OFFERING_SCHEDULES.length]} @ ${CLASSROOMS[i % CLASSROOMS.length]}`,
          );
        }
      }
    }
    console.log(`  ${offeringCount} new offerings created`);

    // ===================== USERS (Professors) =====================
    console.log("\n=== SEEDING PROFESSOR USERS ===");
    const profUserMap = [];
    for (const pu of PROFESSOR_USERS) {
      const existing = await User.findOne({ universityId: pu.universityId });
      if (existing) {
        profUserMap.push(existing);
      } else {
        const user = await User.create({ ...pu, password: SEED_PASSWORD });
        profUserMap.push(user);
      }
      console.log(`  ${pu.universityId}: ${pu.name}`);
    }
    // ===================== USERS (Advisors) =====================
    console.log("\n=== SEEDING ADVISOR USERS ===");
    const advUserMap = [];
    for (const au of ADVISOR_USERS) {
      const existing = await User.findOne({ universityId: au.universityId });
      if (existing) {
        advUserMap.push(existing);
      } else {
        const user = await User.create({ ...au, password: SEED_PASSWORD });
        advUserMap.push(user);
      }
      console.log(`  ${au.universityId}: ${au.name}`);
    }

    // ===================== USERS (Students) =====================
    console.log("\n=== SEEDING STUDENT USERS ===");
    const stuUserMap = [];
    for (const su of STUDENT_USERS) {
      const existing = await User.findOne({ universityId: su.universityId });
      if (existing) {
        stuUserMap.push(existing);
      } else {
        const user = await User.create({ ...su, password: SEED_PASSWORD });
        stuUserMap.push(user);
      }
      console.log(`  ${su.universityId}: ${su.name}`);
    }

    // ===================== PROFESSOR PROFILES =====================
    console.log("\n=== SEEDING PROFESSOR PROFILES ===");
    const profMap = [];
    for (const pp of PROFESSOR_PROFILES) {
      const profile = await Professor.findOneAndUpdate(
        { userId: profUserMap[pp.userIdx]._id },
        {
          $setOnInsert: {
            userId: profUserMap[pp.userIdx]._id,
            departmentId: deptMap[pp.deptCode],
            title: pp.title,
          },
        },
        { upsert: true, returnDocument: "after" },
      );
      profMap.push(profile);
      console.log(`  ${PROFESSOR_USERS[pp.userIdx].name} -> ${pp.deptCode}`);
    }

    // Assign professors to some F24 offerings
    console.log("\n=== ASSIGNING PROFESSORS TO OFFERINGS ===");
    let assignedCount = 0;
    for (let i = 0; i < allCourseCodes.length; i++) {
      const key = `${allCourseCodes[i]}_F24`;
      if (offeringMap[key]) {
        await CourseOffering.findByIdAndUpdate(offeringMap[key], {
          professorId: profMap[i % profMap.length]._id,
        });
        assignedCount++;
      }
    }
    console.log(`  Assigned professors to ${assignedCount} F24 offerings`);

    // Assign professors to S25 offerings
    let s25AssignedCount = 0;
    for (let i = 0; i < allCourseCodes.length; i++) {
      const key = `${allCourseCodes[i]}_S25`;
      if (offeringMap[key]) {
        await CourseOffering.findByIdAndUpdate(offeringMap[key], {
          professorId: profMap[(i + 3) % profMap.length]._id,
        });
        s25AssignedCount++;
      }
    }
    console.log(`  Assigned professors to ${s25AssignedCount} S25 offerings`);

    // ===================== ADVISOR PROFILES =====================
    console.log("\n=== SEEDING ADVISOR PROFILES ===");
    const advMap = [];
    for (const ap of ADVISOR_PROFILES) {
      const profile = await Advisor.findOneAndUpdate(
        { userId: advUserMap[ap.userIdx]._id },
        {
          $setOnInsert: {
            userId: advUserMap[ap.userIdx]._id,
            departmentId: deptMap[ap.deptCode],
            title: ap.title,
          },
        },
        { upsert: true, returnDocument: "after" },
      );
      advMap.push(profile);
      console.log(`  ${ADVISOR_USERS[ap.userIdx].name} -> ${ap.deptCode}`);
    }

    // ===================== STUDENT PROFILES =====================
    console.log("\n=== SEEDING STUDENT PROFILES ===");
    const stuMap = [];
    for (const sp of STUDENT_PROFILES) {
      const advisorId = advMap[sp.userIdx % advMap.length]._id;
      const profile = await Student.findOneAndUpdate(
        { userId: stuUserMap[sp.userIdx]._id },
        {
          $setOnInsert: {
            userId: stuUserMap[sp.userIdx]._id,
            departmentId: deptMap[sp.deptCode],
            advisorId: advisorId,
            GPA: sp.gpa,
            level: sp.level,
            program: sp.program,
          },
        },
        { upsert: true, returnDocument: "after" },
      );
      stuMap.push(profile);
      console.log(`  ${STUDENT_USERS[sp.userIdx].name} -> ${sp.deptCode} Lv${sp.level} GPA:${sp.gpa}`);
    }

    // ===================== ENROLLMENTS =====================
    console.log("\n=== SEEDING ENROLLMENTS ===");
    const GRADES = ["A", "A-", "B+", "B", "B-", "C+", "C", null];
    let enrollmentCount = 0;
    const enrollmentIds = [];

    // F24 enrollments: each student enrolled in 3-5 courses with some graded
    const f24Enrollments = [
      { stuIdx: 0, courses: ["CS101", "CS102", "GEN101", "GEN102"], grades: ["A", "A-", "B+", "B"] },
      { stuIdx: 1, courses: ["AI101", "AI102", "GEN101"], grades: ["A", "A-", "B+"] },
      { stuIdx: 2, courses: ["SE101", "GEN101", "GEN102"], grades: ["B", "B+", "C+"] },
      { stuIdx: 3, courses: ["IS101", "IS102", "GEN101"], grades: ["A-", "B+", "B"] },
      { stuIdx: 4, courses: ["IT101", "GEN101"], grades: ["C+", "B"] },
      { stuIdx: 5, courses: ["MED101", "MED102", "GEN101"], grades: ["A", "A", "A-"] },
      { stuIdx: 6, courses: ["CS101", "GEN101"], grades: ["B-", "C+"] },
      { stuIdx: 7, courses: ["AI101", "GEN101"], grades: ["B+", "B"] },
      { stuIdx: 8, courses: ["SE101", "GEN101"], grades: ["C", "B-"] },
      { stuIdx: 9, courses: ["IS101", "GEN101"], grades: ["B+", "A-"] },
      { stuIdx: 10, courses: ["IT101", "GEN101"], grades: ["B", "B+"] },
      { stuIdx: 11, courses: ["CS101", "CS102", "GEN101"], grades: ["A-", "B+", "A"] },
    ];

    for (const en of f24Enrollments) {
      for (let i = 0; i < en.courses.length; i++) {
        const code = en.courses[i];
        const key = `${code}_F24`;
        if (!offeringMap[key]) continue;

        await Enrollment.findOneAndUpdate(
          { studentId: stuMap[en.stuIdx]._id, offeringId: offeringMap[key] },
          { $set: {
            studentId: stuMap[en.stuIdx]._id,
            offeringId: offeringMap[key],
            courseId: courseMap[code],
            status: "completed",
            grade: en.grades[i],
          } },
          { upsert: true }
        );
        enrollmentCount++;
      }
    }

    // S25 enrollments: each student enrolled in 3-4 courses, all currently enrolled
    const s25Enrollments = [
      { stuIdx: 1, courses: ["AI201", "AI202", "GEN201"] },
      { stuIdx: 2, courses: ["SE102", "SE103", "GEN201"] },
      { stuIdx: 3, courses: ["IS201", "IS202", "GEN201"] },
      { stuIdx: 4, courses: ["IT201", "IT202", "GEN201"] },
      { stuIdx: 5, courses: ["MED201", "MED202", "GEN201"] },
      { stuIdx: 6, courses: ["CS102", "CS103", "GEN201"] },
      { stuIdx: 7, courses: ["AI102", "AI103", "GEN201"] },
      { stuIdx: 8, courses: ["SE201", "GEN201"] },
      { stuIdx: 9, courses: ["IS102", "IS103", "GEN201"] },
      { stuIdx: 10, courses: ["IT102", "IT103", "GEN201"] },
      { stuIdx: 11, courses: ["CS201", "CS203", "GEN201"] },
    ];

    for (const en of s25Enrollments) {
      for (const code of en.courses) {
        const key = `${code}_S25`;
        if (!offeringMap[key]) continue;

        await Enrollment.findOneAndUpdate(
          { studentId: stuMap[en.stuIdx]._id, offeringId: offeringMap[key] },
          { $set: {
            studentId: stuMap[en.stuIdx]._id,
            offeringId: offeringMap[key],
            courseId: courseMap[code],
            status: "enrolled",
            grade: null,
          } },
          { upsert: true }
        );
        enrollmentCount++;
      }
    }

    // Add a couple of dropped enrollments
    for (const en of [
      { stuIdx: 8, code: "GEN201", sem: "S25" },
      { stuIdx: 4, code: "GEN201", sem: "S25" },
    ]) {
      const key = `${en.code}_${en.sem}`;
      if (!offeringMap[key]) continue;
      await Enrollment.findOneAndUpdate(
        { studentId: stuMap[en.stuIdx]._id, offeringId: offeringMap[key] },
        { $set: {
          studentId: stuMap[en.stuIdx]._id,
          offeringId: offeringMap[key],
          courseId: courseMap[en.code],
          status: "dropped",
          grade: null,
        } },
        { upsert: true }
      );
      enrollmentCount++;
    }

    console.log(`  ${enrollmentCount} enrollments created`);

    // Recalculate enrolledCount for all offerings
    console.log("\n=== RECALCULATING ENROLLED COUNTS ===");
    const allOfferings = await CourseOffering.find();
    let recalculated = 0;
    for (const offering of allOfferings) {
      const count = await Enrollment.countDocuments({
        offeringId: offering._id,
        status: "enrolled",
      });
      if (offering.enrolledCount !== count) {
        await CourseOffering.findByIdAndUpdate(offering._id, { $set: { enrolledCount: count } });
        recalculated++;
      }
    }
    console.log(`  ${recalculated} offering counts updated`);

    // ===================== SEMESTER REGISTRATIONS =====================
    console.log("\n=== SEEDING SEMESTER REGISTRATIONS ===");
    let registrationCount = 0;
    const s25Students = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    for (const idx of s25Students) {
      const reg = await SemesterRegistration.findOneAndUpdate(
        { studentId: stuMap[idx]._id, semesterId: semMap["S25"] },
        { $set: { studentId: stuMap[idx]._id, semesterId: semMap["S25"] } },
        { upsert: true }
      );
      registrationCount++;
    }
    console.log(`  ${registrationCount} semester registrations seeded`);

    // ===================== ADVISING SESSIONS =====================
    console.log("\n=== SEEDING ADVISING SESSIONS ===");
    let advisingCount = 0;
    const advisingData = [
      { stuIdx: 0, advIdx: 0, semCode: "F24", status: "completed", notes: "Discussed fall course load and research opportunities." },
      { stuIdx: 1, advIdx: 0, semCode: "F24", status: "completed", notes: "Reviewed ML specialization track options." },
      { stuIdx: 2, advIdx: 1, semCode: "F24", status: "completed", notes: "First-year student orientation and course planning." },
      { stuIdx: 3, advIdx: 2, semCode: "F24", status: "completed", notes: "Discussed IS elective choices for final year." },
      { stuIdx: 4, advIdx: 1, semCode: "F24", status: "cancelled", notes: "Student did not attend." },
      { stuIdx: 0, advIdx: 0, semCode: "S25", status: "scheduled", notes: "Spring registration advising - discuss capstone project." },
      { stuIdx: 1, advIdx: 0, semCode: "S25", status: "scheduled", notes: "Discuss summer internship and fall registration." },
      { stuIdx: 5, advIdx: 0, semCode: "S25", status: "pending", notes: "Clinical rotation schedule planning." },
      { stuIdx: 6, advIdx: 0, semCode: "S25", status: "pending", notes: "Academic probation follow-up." },
      { stuIdx: 7, advIdx: 0, semCode: "S25", status: "completed", notes: "Reviewed progress toward AI specialization." },
    ];

    for (const a of advisingData) {
      const existing = await AdvisingSession.findOne({
        studentId: stuMap[a.stuIdx]._id,
        advisorId: advMap[a.advIdx]._id,
        semesterId: semMap[a.semCode],
      });
      if (!existing) {
        await AdvisingSession.create({
          studentId: stuMap[a.stuIdx]._id,
          advisorId: advMap[a.advIdx]._id,
          semesterId: semMap[a.semCode],
          status: a.status,
          notes: a.notes,
        });
        advisingCount++;
      }
    }
    console.log(`  ${advisingCount} advising sessions created`);

    // ===================== ATTENDANCE =====================
    console.log("\n=== SEEDING ATTENDANCE ===");
    let attendanceCount = 0;
    const ATTENDANCE_STATUSES = ["present", "absent", "late"];

    // Create attendance for CS101 F24 offering on 3 dates
    const cs101F24Key = "CS101_F24";
    if (offeringMap[cs101F24Key]) {
      const attDates = [
        new Date("2024-09-05"),
        new Date("2024-09-12"),
        new Date("2024-09-19"),
      ];
      const csStudents = [0, 6, 11]; // students enrolled in CS101 F24

      for (const d of attDates) {
        const existing = await Attendance.findOne({
          offeringId: offeringMap[cs101F24Key],
          date: d,
        });
        if (!existing) {
          const records = csStudents.map((si) => ({
            studentId: stuMap[si]._id,
            status: ATTENDANCE_STATUSES[Math.floor(Math.random() * 3)],
          }));
          await Attendance.create({
            offeringId: offeringMap[cs101F24Key],
            date: d,
            records,
          });
          attendanceCount++;
        }
      }
    }

    // Create attendance for AI101 F24 offering on 2 dates
    const ai101F24Key = "AI101_F24";
    if (offeringMap[ai101F24Key]) {
      const attDates = [new Date("2024-09-06"), new Date("2024-09-13")];
      const aiStudents = [1, 7];

      for (const d of attDates) {
        const existing = await Attendance.findOne({
          offeringId: offeringMap[ai101F24Key],
          date: d,
        });
        if (!existing) {
          const records = aiStudents.map((si) => ({
            studentId: stuMap[si]._id,
            status: ATTENDANCE_STATUSES[Math.floor(Math.random() * 3)],
          }));
          await Attendance.create({
            offeringId: offeringMap[ai101F24Key],
            date: d,
            records,
          });
          attendanceCount++;
        }
      }
    }

    // Create attendance for MED101 F24 offering on 2 dates
    const med101F24Key = "MED101_F24";
    if (offeringMap[med101F24Key]) {
      const attDates = [new Date("2024-09-04"), new Date("2024-09-11")];

      for (const d of attDates) {
        const existing = await Attendance.findOne({
          offeringId: offeringMap[med101F24Key],
          date: d,
        });
        if (!existing) {
          const records = [{ studentId: stuMap[5]._id, status: "present" }];
          await Attendance.create({
            offeringId: offeringMap[med101F24Key],
            date: d,
            records,
          });
          attendanceCount++;
        }
      }
    }

    // Create attendance for S25 offerings (current semester)
    const s25AttendanceData = [
      { offeringKey: "CS201_S25", dates: ["2025-02-10", "2025-02-17", "2025-02-24", "2025-03-03", "2025-03-10", "2025-03-17", "2025-03-24"], students: [0, 11], statuses: ["present","present","late","present","present","absent","present"] },
      { offeringKey: "CS202_S25", dates: ["2025-02-11", "2025-02-18", "2025-02-25", "2025-03-04", "2025-03-11", "2025-03-18", "2025-03-25"], students: [0], statuses: ["present","late","present","present","present","late","present"] },
      { offeringKey: "GEN201_S25", dates: ["2025-02-12", "2025-02-19", "2025-02-26", "2025-03-05", "2025-03-12", "2025-03-19", "2025-03-26"], students: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], statuses: ["present","present","present","absent","present","late","present"] },
      { offeringKey: "AI201_S25", dates: ["2025-02-13", "2025-02-20", "2025-02-27", "2025-03-06", "2025-03-13"], students: [1], statuses: ["present","present","late","present","present"] },
      { offeringKey: "AI202_S25", dates: ["2025-02-14", "2025-02-21", "2025-02-28", "2025-03-07", "2025-03-14"], students: [1], statuses: ["late","present","present","absent","present"] },
      { offeringKey: "SE102_S25", dates: ["2025-02-10", "2025-02-17", "2025-02-24", "2025-03-03"], students: [2], statuses: ["present","present","late","present"] },
      { offeringKey: "SE103_S25", dates: ["2025-02-11", "2025-02-18", "2025-02-25", "2025-03-04"], students: [2], statuses: ["present","absent","present","present"] },
      { offeringKey: "IS201_S25", dates: ["2025-02-12", "2025-02-19", "2025-02-26"], students: [3], statuses: ["present","present","present"] },
      { offeringKey: "IS202_S25", dates: ["2025-02-13", "2025-02-20", "2025-02-27"], students: [3], statuses: ["present","late","present"] },
      { offeringKey: "IT201_S25", dates: ["2025-02-14", "2025-02-21", "2025-02-28"], students: [4], statuses: ["absent","present","present"] },
      { offeringKey: "IT202_S25", dates: ["2025-02-10", "2025-02-17", "2025-02-24"], students: [4], statuses: ["present","present","late"] },
      { offeringKey: "MED201_S25", dates: ["2025-02-11", "2025-02-18", "2025-02-25"], students: [5], statuses: ["present","present","present"] },
      { offeringKey: "MED202_S25", dates: ["2025-02-12", "2025-02-19", "2025-02-26"], students: [5], statuses: ["present","late","present"] },
      { offeringKey: "CS103_S25", dates: ["2025-02-13", "2025-02-20", "2025-02-27"], students: [6], statuses: ["present","absent","late"] },
      { offeringKey: "AI103_S25", dates: ["2025-02-14", "2025-02-21", "2025-02-28"], students: [7], statuses: ["present","present","present"] },
      { offeringKey: "IS103_S25", dates: ["2025-02-10", "2025-02-17", "2025-02-24"], students: [9], statuses: ["late","present","present"] },
      { offeringKey: "IT103_S25", dates: ["2025-02-11", "2025-02-18", "2025-02-25"], students: [10], statuses: ["present","present","late"] },
      { offeringKey: "CS203_S25", dates: ["2025-02-12", "2025-02-19", "2025-02-26"], students: [11], statuses: ["present","present","present"] },
    ];

    for (const s25Att of s25AttendanceData) {
      if (!offeringMap[s25Att.offeringKey]) continue;
      for (let di = 0; di < s25Att.dates.length; di++) {
        const d = new Date(s25Att.dates[di]);
        const existing = await Attendance.findOne({
          offeringId: offeringMap[s25Att.offeringKey],
          date: d,
        });
        if (!existing) {
          const records = s25Att.students.map((si, idx) => ({
            studentId: stuMap[si]._id,
            status: s25Att.statuses[idx] || ATTENDANCE_STATUSES[Math.floor(Math.random() * 3)],
          }));
          await Attendance.create({
            offeringId: offeringMap[s25Att.offeringKey],
            date: d,
            records,
          });
          attendanceCount++;
        }
      }
    }

    console.log(`  ${attendanceCount} attendance records created`);

    // ===================== ASSIGNMENTS =====================
    console.log("\n=== SEEDING ASSIGNMENTS ===");
    let assignmentCount = 0;
    const assignmentData = [
      { offeringKey: "CS101_F24", title: "Assignment 1: Hello World", dueDate: new Date("2024-10-01"), maxScore: 100 },
      { offeringKey: "CS101_F24", title: "Assignment 2: Variables & Types", dueDate: new Date("2024-10-15"), maxScore: 100 },
      { offeringKey: "CS102_F24", title: "Assignment 1: Linked Lists", dueDate: new Date("2024-10-10"), maxScore: 100 },
      { offeringKey: "AI101_F24", title: "Assignment 1: Search Algorithms", dueDate: new Date("2024-10-08"), maxScore: 50 },
      { offeringKey: "SE101_F24", title: "Assignment 1: SDLC Report", dueDate: new Date("2024-10-12"), maxScore: 100 },
      { offeringKey: "IS101_F24", title: "Assignment 1: IS Case Study", dueDate: new Date("2024-10-05"), maxScore: 100 },
      { offeringKey: "MED101_F24", title: "Assignment 1: Anatomy Labeling", dueDate: new Date("2024-10-07"), maxScore: 100 },
      { offeringKey: "IT101_F24", title: "Assignment 1: Network Diagram", dueDate: new Date("2024-10-09"), maxScore: 100 },
      { offeringKey: "CS201_S25", title: "Assignment 1: Sorting Analysis", dueDate: new Date("2025-03-01"), maxScore: 100 },
      { offeringKey: "AI201_S25", title: "Assignment 1: Neural Network From Scratch", dueDate: new Date("2025-03-05"), maxScore: 100 },
      { offeringKey: "SE102_S25", title: "Assignment 1: Requirements Document", dueDate: new Date("2025-03-10"), maxScore: 100 },
    ];

    for (const a of assignmentData) {
      if (!offeringMap[a.offeringKey]) continue;
      const existing = await Assignment.findOne({
        offeringId: offeringMap[a.offeringKey],
        title: a.title,
      });
      if (!existing) {
        await Assignment.create({
          offeringId: offeringMap[a.offeringKey],
          title: a.title,
          dueDate: a.dueDate,
          maxScore: a.maxScore,
        });
        assignmentCount++;
      }
    }
    console.log(`  ${assignmentCount} assignments created`);

    // ===================== EXAMS =====================
    console.log("\n=== SEEDING EXAMS ===");
    let examCount = 0;
    const examData = [
      { offeringKey: "CS101_F24", courseCode: "CS101", semCode: "F24", date: new Date("2024-12-10"), startTime: "09:00", endTime: "11:00", room: "Hall A", type: "midterm" },
      { offeringKey: "CS101_F24", courseCode: "CS101", semCode: "F24", date: new Date("2025-01-10"), startTime: "09:00", endTime: "12:00", room: "Hall A", type: "final" },
      { offeringKey: "AI101_F24", courseCode: "AI101", semCode: "F24", date: new Date("2024-12-12"), startTime: "10:00", endTime: "12:00", room: "Lab 101", type: "midterm" },
      { offeringKey: "AI101_F24", courseCode: "AI101", semCode: "F24", date: new Date("2025-01-12"), startTime: "10:00", endTime: "13:00", room: "Lab 101", type: "final" },
      { offeringKey: "SE101_F24", courseCode: "SE101", semCode: "F24", date: new Date("2024-12-14"), startTime: "14:00", endTime: "16:00", room: "Room 201", type: "midterm" },
      { offeringKey: "SE101_F24", courseCode: "SE101", semCode: "F24", date: new Date("2025-01-14"), startTime: "14:00", endTime: "17:00", room: "Room 201", type: "final" },
      { offeringKey: "IS101_F24", courseCode: "IS101", semCode: "F24", date: new Date("2024-12-11"), startTime: "11:00", endTime: "13:00", room: "Room 202", type: "midterm" },
      { offeringKey: "IS101_F24", courseCode: "IS101", semCode: "F24", date: new Date("2025-01-11"), startTime: "11:00", endTime: "14:00", room: "Room 202", type: "final" },
      { offeringKey: "MED101_F24", courseCode: "MED101", semCode: "F24", date: new Date("2024-12-13"), startTime: "08:00", endTime: "10:00", room: "Lecture Theatre 1", type: "midterm" },
      { offeringKey: "MED101_F24", courseCode: "MED101", semCode: "F24", date: new Date("2025-01-13"), startTime: "08:00", endTime: "11:00", room: "Lecture Theatre 1", type: "final" },
      { offeringKey: "CS201_S25", courseCode: "CS201", semCode: "S25", date: new Date("2025-04-15"), startTime: "09:00", endTime: "11:00", room: "Hall B", type: "midterm" },
      { offeringKey: "CS201_S25", courseCode: "CS201", semCode: "S25", date: new Date("2025-06-10"), startTime: "09:00", endTime: "12:00", room: "Hall B", type: "final" },
      { offeringKey: "AI201_S25", courseCode: "AI201", semCode: "S25", date: new Date("2025-04-16"), startTime: "10:00", endTime: "12:00", room: "Lab 102", type: "midterm" },
      { offeringKey: "AI201_S25", courseCode: "AI201", semCode: "S25", date: new Date("2025-06-11"), startTime: "10:00", endTime: "13:00", room: "Lab 102", type: "final" },
      { offeringKey: "CS202_S25", courseCode: "CS202", semCode: "S25", date: new Date("2025-04-17"), startTime: "09:00", endTime: "11:00", room: "Hall B", type: "midterm" },
      { offeringKey: "CS202_S25", courseCode: "CS202", semCode: "S25", date: new Date("2025-06-12"), startTime: "09:00", endTime: "12:00", room: "Hall B", type: "final" },
      { offeringKey: "GEN201_S25", courseCode: "GEN201", semCode: "S25", date: new Date("2025-04-18"), startTime: "11:00", endTime: "13:00", room: "Room 201", type: "midterm" },
      { offeringKey: "GEN201_S25", courseCode: "GEN201", semCode: "S25", date: new Date("2025-06-13"), startTime: "11:00", endTime: "14:00", room: "Room 201", type: "final" },
      { offeringKey: "AI202_S25", courseCode: "AI202", semCode: "S25", date: new Date("2025-04-19"), startTime: "10:00", endTime: "12:00", room: "Lab 102", type: "midterm" },
      { offeringKey: "AI202_S25", courseCode: "AI202", semCode: "S25", date: new Date("2025-06-14"), startTime: "10:00", endTime: "13:00", room: "Lab 102", type: "final" },
      { offeringKey: "SE102_S25", courseCode: "SE102", semCode: "S25", date: new Date("2025-04-20"), startTime: "14:00", endTime: "16:00", room: "Room 201", type: "midterm" },
      { offeringKey: "SE102_S25", courseCode: "SE102", semCode: "S25", date: new Date("2025-06-15"), startTime: "14:00", endTime: "17:00", room: "Room 201", type: "final" },
      { offeringKey: "SE103_S25", courseCode: "SE103", semCode: "S25", date: new Date("2025-04-21"), startTime: "09:00", endTime: "11:00", room: "Room 202", type: "midterm" },
      { offeringKey: "SE103_S25", courseCode: "SE103", semCode: "S25", date: new Date("2025-06-16"), startTime: "09:00", endTime: "12:00", room: "Room 202", type: "final" },
      { offeringKey: "IS201_S25", courseCode: "IS201", semCode: "S25", date: new Date("2025-04-22"), startTime: "11:00", endTime: "13:00", room: "Room 203", type: "midterm" },
      { offeringKey: "IS201_S25", courseCode: "IS201", semCode: "S25", date: new Date("2025-06-17"), startTime: "11:00", endTime: "14:00", room: "Room 203", type: "final" },
      { offeringKey: "IS202_S25", courseCode: "IS202", semCode: "S25", date: new Date("2025-04-23"), startTime: "13:00", endTime: "15:00", room: "Room 203", type: "midterm" },
      { offeringKey: "IS202_S25", courseCode: "IS202", semCode: "S25", date: new Date("2025-06-18"), startTime: "13:00", endTime: "16:00", room: "Room 203", type: "final" },
      { offeringKey: "IT201_S25", courseCode: "IT201", semCode: "S25", date: new Date("2025-04-24"), startTime: "08:00", endTime: "10:00", room: "Lab 103", type: "midterm" },
      { offeringKey: "IT201_S25", courseCode: "IT201", semCode: "S25", date: new Date("2025-06-19"), startTime: "08:00", endTime: "11:00", room: "Lab 103", type: "final" },
      { offeringKey: "IT202_S25", courseCode: "IT202", semCode: "S25", date: new Date("2025-04-25"), startTime: "10:00", endTime: "12:00", room: "Lab 103", type: "midterm" },
      { offeringKey: "IT202_S25", courseCode: "IT202", semCode: "S25", date: new Date("2025-06-20"), startTime: "10:00", endTime: "13:00", room: "Lab 103", type: "final" },
      { offeringKey: "MED201_S25", courseCode: "MED201", semCode: "S25", date: new Date("2025-04-26"), startTime: "08:00", endTime: "10:00", room: "Lecture Theatre 1", type: "midterm" },
      { offeringKey: "MED201_S25", courseCode: "MED201", semCode: "S25", date: new Date("2025-06-21"), startTime: "08:00", endTime: "11:00", room: "Lecture Theatre 1", type: "final" },
      { offeringKey: "MED202_S25", courseCode: "MED202", semCode: "S25", date: new Date("2025-04-27"), startTime: "09:00", endTime: "11:00", room: "Lecture Theatre 1", type: "midterm" },
      { offeringKey: "MED202_S25", courseCode: "MED202", semCode: "S25", date: new Date("2025-06-22"), startTime: "09:00", endTime: "12:00", room: "Lecture Theatre 1", type: "final" },
      { offeringKey: "CS102_S25", courseCode: "CS102", semCode: "S25", date: new Date("2025-04-28"), startTime: "09:00", endTime: "11:00", room: "Hall A", type: "midterm" },
      { offeringKey: "CS102_S25", courseCode: "CS102", semCode: "S25", date: new Date("2025-06-23"), startTime: "09:00", endTime: "12:00", room: "Hall A", type: "final" },
      { offeringKey: "CS103_S25", courseCode: "CS103", semCode: "S25", date: new Date("2025-04-29"), startTime: "11:00", endTime: "13:00", room: "Hall A", type: "midterm" },
      { offeringKey: "CS103_S25", courseCode: "CS103", semCode: "S25", date: new Date("2025-06-24"), startTime: "11:00", endTime: "14:00", room: "Hall A", type: "final" },
      { offeringKey: "AI102_S25", courseCode: "AI102", semCode: "S25", date: new Date("2025-04-30"), startTime: "10:00", endTime: "12:00", room: "Lab 101", type: "midterm" },
      { offeringKey: "AI102_S25", courseCode: "AI102", semCode: "S25", date: new Date("2025-06-25"), startTime: "10:00", endTime: "13:00", room: "Lab 101", type: "final" },
      { offeringKey: "AI103_S25", courseCode: "AI103", semCode: "S25", date: new Date("2025-05-01"), startTime: "14:00", endTime: "16:00", room: "Lab 101", type: "midterm" },
      { offeringKey: "AI103_S25", courseCode: "AI103", semCode: "S25", date: new Date("2025-06-26"), startTime: "14:00", endTime: "17:00", room: "Lab 101", type: "final" },
      { offeringKey: "SE201_S25", courseCode: "SE201", semCode: "S25", date: new Date("2025-05-02"), startTime: "13:00", endTime: "15:00", room: "Room 201", type: "midterm" },
      { offeringKey: "SE201_S25", courseCode: "SE201", semCode: "S25", date: new Date("2025-06-27"), startTime: "13:00", endTime: "16:00", room: "Room 201", type: "final" },
      { offeringKey: "IS102_S25", courseCode: "IS102", semCode: "S25", date: new Date("2025-05-03"), startTime: "09:00", endTime: "11:00", room: "Room 202", type: "midterm" },
      { offeringKey: "IS102_S25", courseCode: "IS102", semCode: "S25", date: new Date("2025-06-28"), startTime: "09:00", endTime: "12:00", room: "Room 202", type: "final" },
      { offeringKey: "IS103_S25", courseCode: "IS103", semCode: "S25", date: new Date("2025-05-04"), startTime: "11:00", endTime: "13:00", room: "Room 202", type: "midterm" },
      { offeringKey: "IS103_S25", courseCode: "IS103", semCode: "S25", date: new Date("2025-06-29"), startTime: "11:00", endTime: "14:00", room: "Room 202", type: "final" },
      { offeringKey: "IT102_S25", courseCode: "IT102", semCode: "S25", date: new Date("2025-05-05"), startTime: "08:00", endTime: "10:00", room: "Lab 103", type: "midterm" },
      { offeringKey: "IT102_S25", courseCode: "IT102", semCode: "S25", date: new Date("2025-06-30"), startTime: "08:00", endTime: "11:00", room: "Lab 103", type: "final" },
      { offeringKey: "IT103_S25", courseCode: "IT103", semCode: "S25", date: new Date("2025-05-06"), startTime: "10:00", endTime: "12:00", room: "Lab 103", type: "midterm" },
      { offeringKey: "IT103_S25", courseCode: "IT103", semCode: "S25", date: new Date("2025-07-01"), startTime: "10:00", endTime: "13:00", room: "Lab 103", type: "final" },
      { offeringKey: "CS203_S25", courseCode: "CS203", semCode: "S25", date: new Date("2025-05-07"), startTime: "09:00", endTime: "11:00", room: "Hall B", type: "midterm" },
      { offeringKey: "CS203_S25", courseCode: "CS203", semCode: "S25", date: new Date("2025-07-02"), startTime: "09:00", endTime: "12:00", room: "Hall B", type: "final" },
    ];

    for (const e of examData) {
      if (!offeringMap[e.offeringKey]) continue;
      const existing = await Exam.findOne({
        offeringId: offeringMap[e.offeringKey],
        type: e.type,
      });
      if (!existing) {
        await Exam.create({
          offeringId: offeringMap[e.offeringKey],
          courseId: courseMap[e.courseCode],
          semesterId: semMap[e.semCode],
          date: e.date,
          startTime: e.startTime,
          endTime: e.endTime,
          room: e.room,
          type: e.type,
        });
        examCount++;
      }
    }
    console.log(`  ${examCount} exams created`);

    // ===================== COMPLAINTS =====================
    console.log("\n=== SEEDING COMPLAINTS ===");
    let complaintCount = 0;
    const complaintData = [
      { stuIdx: 0, subject: "Grade Dispute - CS102 Midterm", description: "I believe my midterm grade for CS102 does not reflect my actual performance. I answered all questions correctly but received a B+ instead of an A.", status: "pending" },
      { stuIdx: 2, subject: "Course Registration Conflict", description: "SE102 and GEN201 are scheduled at the same time slot. I need to enroll in both courses this semester to stay on track.", status: "in_progress" },
      { stuIdx: 4, subject: "Missing Assignment Score", description: "My IT101 assignment 1 score was not entered into the system. I submitted it on time and received confirmation from the professor.", status: "resolved" },
      { stuIdx: 8, subject: "Academic Probation Appeal", description: "I am currently on academic probation but have improved my grades significantly. I would like to appeal for early removal from probation status.", status: "pending" },
      { stuIdx: 5, subject: "Clinical Rotation Schedule", description: "The clinical practice schedule conflicts with my other mandatory courses. I need assistance in finding alternative rotation slots.", status: "in_progress" },
      { stuIdx: 3, subject: "Transcript Request Delay", description: "I submitted a transcript request three weeks ago and have not received it yet. I need it for a job application deadline next week.", status: "rejected" },
    ];

    for (const c of complaintData) {
      const existing = await Complaint.findOne({
        studentId: stuMap[c.stuIdx]._id,
        subject: c.subject,
      });
      if (!existing) {
        await Complaint.create({
          studentId: stuMap[c.stuIdx]._id,
          subject: c.subject,
          description: c.description,
          status: c.status,
        });
        complaintCount++;
      }
    }
    console.log(`  ${complaintCount} complaints created`);

    // ===================== NOTIFICATIONS =====================
    console.log("\n=== SEEDING NOTIFICATIONS ===");
    let notifCount = 0;
    const notifData = [
      { userIdx: 0, userRole: "student", type: "academic", title: "Enrollment Confirmed", message: "You have been successfully enrolled in CS201 for Spring 2025.", read: false },
      { userIdx: 0, userRole: "student", type: "info", title: "Welcome Back", message: "Welcome to Spring 2025 semester. Check your course schedule.", read: true },
      { userIdx: 1, userRole: "student", type: "academic", title: "Grade Posted", message: "Your grade for AI101 (Fall 2024) has been posted: A.", read: true },
      { userIdx: 2, userRole: "student", type: "urgent", title: "Registration Deadline", message: "Spring 2025 registration closes in 3 days. Complete your enrollment now.", read: false },
      { userIdx: 3, userRole: "student", type: "info", title: "Advising Session Scheduled", message: "Your advising session with Prof. Hana Youssef is scheduled for Feb 5, 2025.", read: false },
      { userIdx: 4, userRole: "student", type: "system", title: "Account Updated", message: "Your profile information has been successfully updated.", read: true },
      { userIdx: 5, userRole: "student", type: "academic", title: "Clinical Rotation Reminder", message: "Your clinical practice rotation starts next Monday.", read: false },
      { userIdx: 8, userRole: "student", type: "urgent", title: "Academic Warning", message: "Your current GPA has dropped below the minimum requirement. Please contact your advisor.", read: false },
      { userIdx: 0, userRole: "professor", type: "info", title: "New Course Assignment", message: "You have been assigned to teach CS101 for Spring 2025.", read: true },
      { userIdx: 0, userRole: "professor", type: "academic", title: "Grade Submission Deadline", message: "Final grades for Fall 2024 are due by January 15, 2025.", read: false },
    ];

    const allUsers = [...stuUserMap, ...profUserMap, ...advUserMap];
    for (const n of notifData) {
      let targetUser;
      if (n.userRole === "student") targetUser = stuUserMap[n.userIdx];
      else if (n.userRole === "professor") targetUser = profUserMap[n.userIdx];
      else targetUser = advUserMap[n.userIdx];

      const existing = await Notification.findOne({
        userId: targetUser._id,
        title: n.title,
      });
      if (!existing) {
        await Notification.create({
          userId: targetUser._id,
          type: n.type,
          title: n.title,
          message: n.message,
          read: n.read,
        });
        notifCount++;
      }
    }
    console.log(`  ${notifCount} notifications created`);

    // ===================== PAYMENTS =====================
    console.log("\n=== SEEDING PAYMENTS ===");
    let paymentCount = 0;
    const paymentData = [
      { stuIdx: 0, semCode: "F24", amount: 5000, status: "paid", method: "bank_transfer", desc: "Fall 2024 Tuition Fee", dueDate: "2024-08-15", paidAt: "2024-08-10" },
      { stuIdx: 0, semCode: "S25", amount: 5000, status: "pending", method: null, desc: "Spring 2025 Tuition Fee", dueDate: "2025-01-20", paidAt: null },
      { stuIdx: 1, semCode: "F24", amount: 5000, status: "paid", method: "credit_card", desc: "Fall 2024 Tuition Fee", dueDate: "2024-08-15", paidAt: "2024-08-12" },
      { stuIdx: 1, semCode: "S25", amount: 5000, status: "pending", method: null, desc: "Spring 2025 Tuition Fee", dueDate: "2025-01-20", paidAt: null },
      { stuIdx: 2, semCode: "F24", amount: 5000, status: "paid", method: "online", desc: "Fall 2024 Tuition Fee", dueDate: "2024-08-15", paidAt: "2024-08-09" },
      { stuIdx: 2, semCode: "S25", amount: 5000, status: "overdue", method: null, desc: "Spring 2025 Tuition Fee", dueDate: "2025-01-20", paidAt: null },
      { stuIdx: 3, semCode: "F24", amount: 5000, status: "paid", method: "bank_transfer", desc: "Fall 2024 Tuition Fee", dueDate: "2024-08-15", paidAt: "2024-08-11" },
      { stuIdx: 3, semCode: "S25", amount: 5000, status: "paid", method: "credit_card", desc: "Spring 2025 Tuition Fee", dueDate: "2025-01-20", paidAt: "2025-01-18" },
      { stuIdx: 4, semCode: "F24", amount: 4500, status: "paid", method: "debit_card", desc: "Fall 2024 Tuition Fee", dueDate: "2024-08-15", paidAt: "2024-08-14" },
      { stuIdx: 4, semCode: "S25", amount: 4500, status: "pending", method: null, desc: "Spring 2025 Tuition Fee", dueDate: "2025-01-20", paidAt: null },
      { stuIdx: 5, semCode: "F24", amount: 8000, status: "paid", method: "bank_transfer", desc: "Fall 2024 Tuition Fee", dueDate: "2024-08-15", paidAt: "2024-08-08" },
      { stuIdx: 5, semCode: "S25", amount: 8000, status: "paid", method: "online", desc: "Spring 2025 Tuition Fee", dueDate: "2025-01-20", paidAt: "2025-01-15" },
      { stuIdx: 6, semCode: "F24", amount: 4500, status: "paid", method: "cash", desc: "Fall 2024 Tuition Fee", dueDate: "2024-08-15", paidAt: "2024-08-15" },
      { stuIdx: 6, semCode: "S25", amount: 4500, status: "overdue", method: null, desc: "Spring 2025 Tuition Fee", dueDate: "2025-01-20", paidAt: null },
      { stuIdx: 7, semCode: "F24", amount: 5000, status: "paid", method: "credit_card", desc: "Fall 2024 Tuition Fee", dueDate: "2024-08-15", paidAt: "2024-08-13" },
      { stuIdx: 7, semCode: "S25", amount: 5000, status: "pending", method: null, desc: "Spring 2025 Tuition Fee", dueDate: "2025-01-20", paidAt: null },
      { stuIdx: 11, semCode: "F24", amount: 5000, status: "paid", method: "bank_transfer", desc: "Fall 2024 Tuition Fee", dueDate: "2024-08-15", paidAt: "2024-08-07" },
      { stuIdx: 11, semCode: "S25", amount: 5000, status: "paid", method: "online", desc: "Spring 2025 Tuition Fee", dueDate: "2025-01-20", paidAt: "2025-01-19" },
    ];

    for (const p of paymentData) {
      await Payment.findOneAndUpdate(
        { studentId: stuMap[p.stuIdx]._id, semesterId: semMap[p.semCode] },
        { $set: {
          studentId: stuMap[p.stuIdx]._id,
          semesterId: semMap[p.semCode],
          amount: p.amount,
          status: p.status,
          paymentMethod: p.method,
          description: p.desc,
          dueDate: new Date(p.dueDate),
          paidAt: p.paidAt ? new Date(p.paidAt) : null,
          transactionId: p.status === "paid" ? `TXN-${p.semCode}-${p.stuIdx}-${Math.random().toString(36).slice(2, 8).toUpperCase()}` : null,
        } },
        { upsert: true }
      );
      paymentCount++;
    }
    console.log(`  ${paymentCount} payments seeded/updated`);

    // ===================== SETTINGS =====================
    console.log("\n=== SEEDING SETTINGS ===");
    let settingCount = 0;
    const settingsData = [
      { key: "academicYear", value: "2024-2025" },
      { key: "maxCreditsPerSemester", value: 18 },
      { key: "minCreditsForProbation", value: 12 },
      { key: "gpaWarningThreshold", value: 2.0 },
      { key: "registrationOpenDate", value: "2025-01-20" },
      { key: "registrationCloseDate", value: "2025-02-05" },
      { key: "allowSelfEnrollment", value: true },
      { key: "enableNotifications", value: true },
      { key: "currency", value: "USD" },
      { key: "semesterFee", value: 5000 },
    ];

    for (const s of settingsData) {
      const existing = await Setting.findOne({ key: s.key });
      if (!existing) {
        await Setting.create({ key: s.key, value: s.value });
        settingCount++;
      }
    }
    console.log(`  ${settingCount} settings created`);

    // ===================== STUDY PLANS =====================
    console.log("\n=== SEEDING STUDY PLANS ===");
    let studyPlanCount = 0;

    const sampleStudyPlan = {
      degreeName: "Bachelor of Science in Computer Science",
      totalRequired: 120,
      years: [
        {
          year: 1,
          semesters: [
            {
              name: "Fall",
              courses: [
                { code: "CS101", name: "Intro to Programming", credits: 3, completed: true },
                { code: "GEN101", name: "English Composition", credits: 3, completed: true },
                { code: "GEN102", name: "Calculus I", credits: 3, completed: true },
                { code: "GEN103", name: "Critical Thinking", credits: 3, completed: true },
              ],
            },
            {
              name: "Spring",
              courses: [
                { code: "CS102", name: "Data Structures", credits: 3, completed: true },
                { code: "CS103", name: "Discrete Mathematics", credits: 3, completed: true },
                { code: "GEN201", name: "Technical Writing", credits: 3, completed: true },
              ],
            },
          ],
        },
        {
          year: 2,
          semesters: [
            {
              name: "Fall",
              courses: [
                { code: "CS201", name: "Algorithms", credits: 3, completed: true },
                { code: "CS202", name: "Operating Systems", credits: 3, completed: false },
                { code: "GEN202", name: "Probability & Statistics", credits: 3, completed: false },
              ],
            },
            {
              name: "Spring",
              courses: [
                { code: "CS203", name: "Computer Networks", credits: 3, completed: false },
                { code: "CS301", name: "Database Systems", credits: 3, completed: false },
              ],
            },
          ],
        },
        {
          year: 3,
          semesters: [
            {
              name: "Fall",
              courses: [
                { code: "CS302", name: "Compiler Design", credits: 3, completed: false },
              ],
            },
            {
              name: "Spring",
              courses: [],
            },
          ],
        },
        {
          year: 4,
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
    };

    const existingPlan0 = await StudyPlan.findOne({ studentId: stuMap[0]._id });
    if (!existingPlan0) {
      await StudyPlan.create({
        studentId: stuMap[0]._id,
        ...sampleStudyPlan,
      });
    } else {
      await StudyPlan.findOneAndUpdate(
        { studentId: stuMap[0]._id },
        { $set: sampleStudyPlan },
      );
    }
    studyPlanCount++;

    const aiStudyPlan = {
      degreeName: "Bachelor of Science in Artificial Intelligence",
      totalRequired: 120,
      years: [
        {
          year: 1,
          semesters: [
            {
              name: "Fall",
              courses: [
                { code: "AI101", name: "Intro to Artificial Intelligence", credits: 3, completed: true },
                { code: "GEN101", name: "English Composition", credits: 3, completed: true },
                { code: "GEN102", name: "Calculus I", credits: 3, completed: true },
              ],
            },
            {
              name: "Spring",
              courses: [
                { code: "AI102", name: "Machine Learning", credits: 3, completed: true },
                { code: "AI103", name: "Mathematics for AI", credits: 3, completed: false },
                { code: "GEN201", name: "Technical Writing", credits: 3, completed: false },
              ],
            },
          ],
        },
        {
          year: 2,
          semesters: [
            {
              name: "Fall",
              courses: [
                { code: "AI201", name: "Deep Learning", credits: 3, completed: false },
                { code: "AI202", name: "Natural Language Processing", credits: 3, completed: false },
              ],
            },
            {
              name: "Spring",
              courses: [
                { code: "AI203", name: "Computer Vision", credits: 3, completed: false },
                { code: "AI301", name: "Reinforcement Learning", credits: 3, completed: false },
              ],
            },
          ],
        },
      ],
    };

    const existingPlan1 = await StudyPlan.findOne({ studentId: stuMap[1]._id });
    if (!existingPlan1) {
      await StudyPlan.create({
        studentId: stuMap[1]._id,
        ...aiStudyPlan,
      });
    } else {
      await StudyPlan.findOneAndUpdate(
        { studentId: stuMap[1]._id },
        { $set: aiStudyPlan },
      );
    }
    studyPlanCount++;

    // Study plan for student 3 (IS - level 4, nearly done)
    const isStudyPlan = {
      degreeName: "Bachelor of Science in Information Systems",
      totalRequired: 120,
      years: [
        {
          year: 1,
          semesters: [
            { name: "Fall", courses: [
              { code: "IS101", name: "Intro to Information Systems", credits: 3, completed: true },
              { code: "GEN101", name: "English Composition", credits: 3, completed: true },
              { code: "GEN102", name: "Calculus I", credits: 3, completed: true },
            ]},
            { name: "Spring", courses: [
              { code: "IS102", name: "Systems Analysis & Design", credits: 3, completed: true },
              { code: "IS103", name: "Database Management", credits: 3, completed: true },
              { code: "GEN201", name: "Technical Writing", credits: 3, completed: true },
            ]},
          ],
        },
        {
          year: 2,
          semesters: [
            { name: "Fall", courses: [
              { code: "IS201", name: "Enterprise Systems", credits: 3, completed: true },
              { code: "IS202", name: "Business Intelligence", credits: 3, completed: true },
            ]},
            { name: "Spring", courses: [
              { code: "GEN202", name: "Probability & Statistics", credits: 3, completed: true },
            ]},
          ],
        },
        {
          year: 3,
          semesters: [
            { name: "Fall", courses: [
              { code: "IS301", name: "IT Governance & Risk", credits: 3, completed: false },
            ]},
            { name: "Spring", courses: [] },
          ],
        },
        {
          year: 4,
          semesters: [
            { name: "Fall", courses: [] },
            { name: "Spring", courses: [] },
          ],
        },
      ],
    };

    const existingPlan3 = await StudyPlan.findOne({ studentId: stuMap[3]._id });
    if (!existingPlan3) {
      await StudyPlan.create({
        studentId: stuMap[3]._id,
        ...isStudyPlan,
      });
    } else {
      await StudyPlan.findOneAndUpdate(
        { studentId: stuMap[3]._id },
        { $set: isStudyPlan },
      );
    }
    studyPlanCount++;

    console.log(`  ${studyPlanCount} study plans created`);

    // ===================== SUMMARY =====================
    console.log("\n========================================");
    console.log("         SEEDING COMPLETE");
    console.log("========================================");
    console.log(`  Departments:        ${DEPARTMENTS.length}`);
    console.log(`  Semesters:          ${SEMESTERS.length}`);
    console.log(`  Courses:            ${courseCount}`);
    console.log(`  Course Offerings:   ${offeringCount} new`);
    console.log(`  Professor Users:    ${PROFESSOR_USERS.length}`);
    console.log(`  Advisor Users:      ${ADVISOR_USERS.length}`);
    console.log(`  Student Users:      ${STUDENT_USERS.length}`);
    console.log(`  Enrollments:        ${enrollmentCount}`);
    console.log(`  Advising Sessions:  ${advisingCount}`);
    console.log(`  Attendance Records: ${attendanceCount}`);
    console.log(`  Assignments:        ${assignmentCount}`);
    console.log(`  Exams:              ${examCount}`);
    console.log(`  Complaints:         ${complaintCount}`);
    console.log(`  Notifications:      ${notifCount}`);
    console.log(`  Payments:           ${paymentCount}`);
    console.log(`  Settings:           ${settingCount}`);
    console.log(`  Study Plans:        ${studyPlanCount}`);
    console.log(`  Registrations:      ${registrationCount}`);
    console.log("========================================");
    console.log("\nLOGIN CREDENTIALS (all accounts):");
    console.log("  Password: Test@123");
    console.log("  ---");
    console.log("  Admin:      AD001  | admin@morshed.com");
    console.log("  Professors: PR001-PR007 | <name>@morshed.com");
    console.log("  Advisors:   ADVS001-ADVS003 | <name>@morshed.com");
    console.log("  Students:   STU001-STU012 | <name>@student.morshed.com");
    console.log("========================================\n");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
