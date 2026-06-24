import { z } from 'zod';

export const DepartmentSchema = z.object({
  _id: z.string(),
  name: z.string().optional(),
  code: z.string().optional(),
}).passthrough();

export const DepartmentsResponseSchema = z.array(DepartmentSchema);
