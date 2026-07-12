const { z } = require("zod");

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  code: z.string().min(1, "Department code is required").max(10),
});

const semesterSchema = z.object({
  name: z.string().min(1, "Semester name is required"),
  code: z.string().min(1, "Semester code is required").max(10),
  registrationStatus: z
    .enum(["upcoming", "open", "closed", "ongoing", "ended"])
    .optional(),
  startDate: z.string().optional(), // Will be parsed as Date by Mongoose
  endDate: z.string().optional(),
});

const courseSchema = z.object({
  code: z.string().min(1, "Course code is required"),
  name: z.string().min(1, "Course name is required"),
  credits: z.number().int().min(1).max(6, "Max 6 credits per course"),
  departmentId: z.string().min(1, "Department ID is required"),
});

const courseOfferingSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  semesterId: z.string().min(1, "Semester ID is required"),
  professorId: z.string().optional(),
  schedule: z.string().optional(),
  classroom: z.string().optional(),
  capacity: z.number().int().positive().optional(),
});

module.exports = {
  departmentSchema,
  semesterSchema,
  courseSchema,
  courseOfferingSchema,
};
