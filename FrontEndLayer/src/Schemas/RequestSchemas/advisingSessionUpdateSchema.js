import { z } from 'zod';

export const UpdateAdvisingSessionRequestSchema = z.object({
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'pending']).optional(),
});
