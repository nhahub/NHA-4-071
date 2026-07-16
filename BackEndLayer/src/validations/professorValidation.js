const { z } = require("zod");

const gradeSchema = z.object({
  enrollmentId: z.string(),
  grade: z.string().min(1), // e.g. 'A', 'B+', 'C'
});

const assignmentSchema = z.object({
  offeringId: z.string({ required_error: "Offering ID is required" }),
  title: z
    .string({ required_error: "Title is required" })
    .max(200, "Title must be at most 200 characters"),
  dueDate: z.string({ required_error: "Due date is required" }),
  maxScore: z
    .number({ required_error: "Max score is required" })
    .int("Max score must be an integer")
    .min(1, "Max score must be at least 1"),
});

const attendanceRecordSchema = z.object({
  studentId: z.string({ required_error: "Student ID is required" }),
  status: z.enum(["present", "absent", "late"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be present, absent, or late",
  }),
});

const attendanceSchema = z.object({
  date: z.string({ required_error: "Date is required" }),
  records: z
    .array(attendanceRecordSchema)
    .nonempty("At least one attendance record is required"),
});

const announcementSchema = z.object({
  offeringId: z.string({ required_error: "Offering ID is required" }),
  title: z
    .string({ required_error: "Title is required" })
    .max(200, "Title must be at most 200 characters"),
  content: z
    .string({ required_error: "Content is required" })
    .max(5000, "Content must be at most 5000 characters"),
});

const updateProfileSchema = z.object({
  title: z.string().optional(),
});

module.exports = { gradeSchema, assignmentSchema, attendanceSchema, announcementSchema, updateProfileSchema };
