import { z } from 'zod';

export const LoginRequestSchema = z.object({
  universityId: z.string().min(1, 'University ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  universityId: z.string().min(1, 'University ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['student', 'professor', 'advisor', 'admin'], {
    required_error: 'Please select a role',
  }),

}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
