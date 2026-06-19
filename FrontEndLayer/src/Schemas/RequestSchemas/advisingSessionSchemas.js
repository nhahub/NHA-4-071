import { z } from 'zod';

export const AdvisingSessionRequestSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  semesterId: z.string().min(1, 'Semester ID is required'),
  notes: z.string().optional().default(''),
});
