import { z } from 'zod';

const CourseSchema = z.object({
  _id: z.string(),
  code: z.string(),
  name: z.string(),
  credits: z.number().int(),
  departmentId: z.string(),
});

export const CourseResponseSchema = z.array(CourseSchema);
