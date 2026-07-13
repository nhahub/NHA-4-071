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
  role: z.enum(["student", "professor", "advisor"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role provided",
  }),
});

// Forgot Password Validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// Reset Password Validation
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// Change Password Validation
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

module.exports = {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
