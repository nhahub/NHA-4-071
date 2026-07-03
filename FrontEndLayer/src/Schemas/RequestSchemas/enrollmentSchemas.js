import { z } from 'zod';

export const EnrollmentRequestSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});
