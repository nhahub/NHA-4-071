import { z } from 'zod';

export const EnrollmentResponseSchema = z.object({
  _id: z.string(),
  studentId: z.string(),
  offeringId: z.string(),
  status: z.enum(['enrolled', 'dropped', 'completed']),
  grade: z.string().nullable(),
});
