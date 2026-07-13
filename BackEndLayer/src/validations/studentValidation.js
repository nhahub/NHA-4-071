const { z } = require("zod");

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
});

const updateSettingsSchema = z.object({
  showGpa: z.boolean().optional(),
  preferredLanguage: z.string().optional(),
});

const createAdvisingSessionStudentSchema = z.object({
  semesterId: z.string().min(1, "Semester ID is required"),
  notes: z.string().optional(),
});

module.exports = {
  updateProfileSchema,
  updateSettingsSchema,
  createAdvisingSessionStudentSchema,
};
