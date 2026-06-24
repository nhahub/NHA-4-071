import { z } from 'zod';

export const UserListSchema = z.object({
  _id: z.string(),
  universityId: z.string(),
  email: z.string().email(),
  role: z.string(),
  isActive: z.boolean().optional(),
  name: z.string().optional(),
}).passthrough();

export const UsersResponseSchema = z.array(UserListSchema);

export const ComplaintAdminSchema = z.object({
  _id: z.string(),
  studentId: z.string().optional(),
  subject: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
}).passthrough();

export const ComplaintsResponseSchema = z.array(ComplaintAdminSchema);
