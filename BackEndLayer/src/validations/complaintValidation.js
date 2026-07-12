const { z } = require("zod");

const complaintSchema = z.object({
  subject: z.string().max(200, "Subject too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
});

module.exports = { complaintSchema };
