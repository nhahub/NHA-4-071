const { z } = require("zod");

// Login Validation
const loginSchema = z.object({
  universityId: z.string({ required_error: "University ID is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

// Register Validation
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  universityId: z.string().min(1, "University ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "professor", "advisor", "admin"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role provided",
  }),
});

// Change Password Validation
const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

module.exports = {
  loginSchema,
  registerSchema,
  changePasswordSchema,
};
