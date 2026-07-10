const { z } = require("zod");

const gradeSchema = z.object({
  enrollmentId: z.string(),
  grade: z.string().min(1), // e.g. 'A', 'B+', 'C'
});

module.exports = { gradeSchema };
