import { z } from 'zod';

export const UserListSchema = z.object({
  _id: z.string(),
  universityId: z.string(),
  email: z.string().email(),
  role: z.string(),
  isActive: z.boolean().optional(),
  name: z.string().optional(),
}).passthrough();

export const UsersResponseSchema = z.object({
  users: z.array(UserListSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }).passthrough(),
}).passthrough();

export const ComplaintAdminSchema = z.object({
  _id: z.string(),
  studentId: z.union([z.string(), z.object({}).passthrough()]).optional(),
  adminId: z.string().nullable().optional(),
  subject: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.string().optional(),
}).passthrough();

export const ComplaintsResponseSchema = z.object({
  complaints: z.array(ComplaintAdminSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }).passthrough(),
}).passthrough();
