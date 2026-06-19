import { z } from 'zod';

export const StudentResponseSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  departmentId: z.string(),
  advisorId: z.string().nullable(),
  GPA: z.number().min(0).max(4),
  level: z.number().int().min(1),
});
