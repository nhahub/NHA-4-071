import { z } from 'zod';

const DepartmentRefSchema = z.union([
  z.string(),
  z.object({ _id: z.string(), name: z.string(), code: z.string() }).passthrough(),
]);

const CourseSchema = z.object({
  _id: z.string(),
  code: z.string(),
  name: z.string(),
  credits: z.number().int(),
  departmentId: DepartmentRefSchema,
}).passthrough();

export const CourseResponseSchema = z.array(CourseSchema);
