const { z } = require("zod");

const courseSchema = z.object({
  code: z.string().min(1, "Course code is required"),
  name: z.string().min(1, "Course name is required"),
  credits: z.number().int().min(1).max(6),
  departmentId: z.string().min(1, "Department ID is required"),
});

module.exports = { courseSchema };
