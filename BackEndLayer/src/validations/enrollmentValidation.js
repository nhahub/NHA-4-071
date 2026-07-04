const { z } = require("zod");

const enrollmentSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});

module.exports = { enrollmentSchema };
