import { z } from 'zod';

export const AdminDashboardResponseSchema = z.object({
  totalUsers: z.number(),
  usersByRole: z.object({
    students: z.number(),
    professors: z.number(),
    advisors: z.number(),
    admins: z.number(),
  }).passthrough(),
  openComplaints: z.number(),
}).passthrough();
