import { z } from 'zod';

const CourseSchema = z.object({
  _id: z.string().optional(),
  offeringId: z.string().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
  credits: z.number().optional(),
  professor: z.string().optional(),
  schedule: z.string().optional(),
  classroom: z.string().optional(),
  capacity: z.number().optional(),
  enrolledCount: z.number().optional(),
  seatsAvailable: z.number().optional(),
}).passthrough();

export const CourseResponseSchema = z.array(CourseSchema);
