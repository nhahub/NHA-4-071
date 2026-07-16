import { z } from 'zod';

const PopulatedRef = z.union([z.string(), z.object({}).passthrough()]).optional();

export const CourseOfferingSchema = z.object({
  _id: z.string(),
  courseId: PopulatedRef,
  professorId: z.string().optional(),
  semesterId: PopulatedRef,
  schedule: z.string().optional(),
  classroom: z.string().optional(),
  capacity: z.number().optional(),
  enrolledCount: z.number().optional(),
}).passthrough();

export const CourseOfferingsResponseSchema = z.array(CourseOfferingSchema);
