const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const Department = require("../models/Department");
const Semester = require("../models/Semester");
const Course = require("../models/Course");
const CourseOffering = require("../models/CourseOffering");

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

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB\n");

    console.log("=== SEEDING DEPARTMENTS ===");
    const deptMap = {};
    for (const d of DEPARTMENTS) {
      const dept = await Department.findOneAndUpdate(
        { code: d.code },
        { $setOnInsert: d },
        { upsert: true, returnDocument: "after" },
      );
      deptMap[d.code] = dept._id;
      console.log(`  ${d.code}: ${d.name} (${dept._id})`);
    }

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
        console.log(`  ${c.code}: ${c.name} (${c.credits}cr, ${deptCode})`);
      }
    }
    console.log(`  Total: ${courseCount} courses`);

    console.log("\n=== SEEDING COURSE OFFERINGS ===");
    const currentSemester = await Semester.findOne({ code: "F24" });
    let offeringCount = 0;
    for (const [deptCode, courses] of Object.entries(COURSES_BY_DEPT)) {
      for (let i = 0; i < courses.length; i++) {
        const c = courses[i];
        const scheduleIdx = (offeringCount + i) % OFFERING_SCHEDULES.length;
        const classroomIdx = (offeringCount + i) % CLASSROOMS.length;

        const existing = await CourseOffering.findOne({
          courseId: courseMap[c.code],
          semesterId: currentSemester._id,
        });
        if (!existing) {
          await CourseOffering.create({
            courseId: courseMap[c.code],
            semesterId: currentSemester._id,
            schedule: OFFERING_SCHEDULES[scheduleIdx],
            classroom: CLASSROOMS[classroomIdx],
            capacity: 30,
            enrolledCount: 0,
          });
          offeringCount++;
          console.log(`  ${c.code} - ${OFFERING_SCHEDULES[scheduleIdx]} @ ${CLASSROOMS[classroomIdx]}`);
        }
      }
    }
    if (offeringCount === 0) {
      console.log("  Offerings already exist, none created.");
    } else {
      console.log(`  Created ${offeringCount} offerings`);
    }

    console.log("\n=== SEEDING COMPLETE ===");
    console.log(`  Departments: ${DEPARTMENTS.length}`);
    console.log(`  Semesters: ${SEMESTERS.length}`);
    console.log(`  Courses: ${courseCount}`);
    console.log(`  Offerings: ${offeringCount}`);

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
