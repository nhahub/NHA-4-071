import { z } from 'zod';

export const AdminUsersResponseSchema = z.object({
  users: z.array(z.object({
    _id: z.string(),
    universityId: z.string(),
    email: z.string(),
    role: z.string(),
    isActive: z.boolean().optional(),
    name: z.string().optional(),
  }).passthrough()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }).passthrough(),
}).passthrough();
