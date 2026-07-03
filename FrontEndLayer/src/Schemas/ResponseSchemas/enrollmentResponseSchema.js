import { z } from 'zod';

const EnrollmentItemSchema = z.object({
  _id: z.string(),
  studentId: z.string(),
  offeringId: z.string(),
  courseId: z.string().optional(),
  status: z.enum(['enrolled', 'dropped', 'completed']),
  grade: z.string().nullable(),
});

export const EnrollmentResponseSchema = z.array(EnrollmentItemSchema);
