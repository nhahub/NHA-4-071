import { z } from 'zod';

export const AdvisingSessionRequestSchema = z.object({
  semesterId: z.string().min(1, 'Semester ID is required'),
  notes: z.string().optional().default(''),
});
