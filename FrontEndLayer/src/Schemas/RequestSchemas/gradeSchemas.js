import { z } from 'zod';

export const GradeRequestSchema = z.object({
  enrollmentId: z.string().min(1, 'Enrollment ID is required'),
  grade: z.string().min(1, 'Grade is required'),
});
