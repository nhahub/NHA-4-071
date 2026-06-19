import { z } from 'zod';

export const ComplaintResponseSchema = z.object({
  _id: z.string(),
  studentId: z.string(),
  adminId: z.string().nullable(),
  subject: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'in_progress', 'resolved', 'rejected']),
});
