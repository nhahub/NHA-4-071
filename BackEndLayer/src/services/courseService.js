const Course = require("../models/Course");
const CourseOffering = require("../models/CourseOffering");

exports.getCourses = async () => {
  return await Course.find()
    .populate("departmentId", "name code")
    .sort({ code: 1 });
};

exports.getCourseById = async (courseId) => {
  const course = await Course.findById(courseId).populate(
    "departmentId",
    "name code",
  );
  if (!course) throw new Error("Course not found");
  return course;
};

exports.getCourseOfferings = async (courseId) => {
  const offerings = await CourseOffering.find({ courseId })
    .populate("professorId", "name")
    .populate("semesterId", "name code registrationStatus")
    .sort({ createdAt: -1 });

  return offerings.map((o) => ({
    _id: o._id,
    professor: o.professorId?.name || "TBA",
    semester: o.semesterId?.name,
    semesterCode: o.semesterId?.code,
    registrationStatus: o.semesterId?.registrationStatus,
    schedule: o.schedule,
    classroom: o.classroom,
    capacity: o.capacity,
    enrolledCount: o.enrolledCount,
    seatsAvailable: o.capacity - o.enrolledCount,
  }));
};
