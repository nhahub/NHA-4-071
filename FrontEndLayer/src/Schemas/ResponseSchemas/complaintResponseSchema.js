import { z } from 'zod';

const ComplaintItemSchema = z.object({
  _id: z.string(),
  studentId: z.string(),
  adminId: z.string().nullable(),
  subject: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'in_progress', 'resolved', 'rejected']),
  createdAt: z.string().optional(),
}).passthrough();

export const ComplaintResponseSchema = z.array(ComplaintItemSchema);
