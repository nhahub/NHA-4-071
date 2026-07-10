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

module.exports = { gradeSchema, assignmentSchema };
