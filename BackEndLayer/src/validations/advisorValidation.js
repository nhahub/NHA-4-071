const { z } = require("zod");

const createAdvisingSessionSchema = z.object({
  studentId: z.string({ required_error: "Student ID is required" }),
  semesterId: z.string({ required_error: "Semester ID is required" }),
  notes: z.string().optional(),
});

const updateAdvisingSessionSchema = z.object({
  notes: z.string().optional(),
  status: z
    .enum(["scheduled", "completed", "cancelled", "pending"])
    .optional(),
});

module.exports = {
  createAdvisingSessionSchema,
  updateAdvisingSessionSchema,
};
