import { z } from 'zod';

const AdvisingSessionItemSchema = z.object({
  _id: z.string(),
  studentId: z.string(),
  advisorId: z.string().optional(),
  semesterId: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'pending']),
  createdAt: z.string().optional(),
});

export const AdvisingSessionResponseSchema = z.array(AdvisingSessionItemSchema);
