import { z } from 'zod';

const OfferingRefSchema = z.union([
  z.string(),
  z.object({}).passthrough(),
]);

const CourseRefSchema = z.union([
  z.string(),
  z.object({}).passthrough(),
]);

const EnrollmentItemSchema = z.object({
  _id: z.string(),
  studentId: z.string(),
  offeringId: OfferingRefSchema,
  courseId: CourseRefSchema.optional(),
  status: z.enum(['enrolled', 'dropped', 'completed']),
  grade: z.string().nullable(),
}).passthrough();

export const EnrollmentResponseSchema = z.array(EnrollmentItemSchema);
