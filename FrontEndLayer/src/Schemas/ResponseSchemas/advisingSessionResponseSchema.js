import { z } from 'zod';

export const AdvisingSessionResponseSchema = z.object({
  _id: z.string(),
  studentId: z.string(),
  advisorId: z.string(),
  semesterId: z.string(),
  notes: z.string(),
  status: z.enum(['scheduled', 'completed', 'cancelled']),
});
