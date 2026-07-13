const { z } = require("zod");

const updateUserSchema = z.object({
  role: z.enum(["student", "professor", "advisor", "admin"]).optional(),
  isActive: z.boolean().optional(),
});

const updateComplaintSchema = z.object({
  status: z
    .enum(["pending", "in_progress", "resolved", "rejected"])
    .optional(),
  adminId: z.string().optional(),
});

const updateSemesterSchema = z.object({
  registrationStatus: z
    .enum(["upcoming", "open", "closed", "ongoing", "ended"])
    .optional(),
});

const manualEnrollSchema = z.object({
  studentUserId: z.string({ required_error: "Student User ID is required" }),
  offeringId: z.string({ required_error: "Offering ID is required" }),
});

const updateSettingsSchema = z.object({}).passthrough();

module.exports = {
  updateUserSchema,
  updateComplaintSchema,
  updateSemesterSchema,
  manualEnrollSchema,
  updateSettingsSchema,
};
