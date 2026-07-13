const { z } = require("zod");

const enrollmentSchema = z.object({
  offeringId: z.string().min(1, "Offering ID is required"),
});

module.exports = { enrollmentSchema };
