import { z } from 'zod';

export const CourseOfferingSchema = z.object({
  _id: z.string(),
  courseId: z.string().optional(),
  professorId: z.string().optional(),
  semesterId: z.string().optional(),
  schedule: z.string().optional(),
  classroom: z.string().optional(),
  capacity: z.number().optional(),
  enrolledCount: z.number().optional(),
}).passthrough();

export const CourseOfferingsResponseSchema = z.array(CourseOfferingSchema);
