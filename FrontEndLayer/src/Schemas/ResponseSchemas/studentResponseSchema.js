import { z } from 'zod';

export const StudentResponseSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  departmentId: z.string().nullable(),
  advisorId: z.string().nullable(),
  GPA: z.number().min(0).max(4),
  level: z.number().int().min(1),
  name: z.string().optional(),
  email: z.string().optional(),
  universityId: z.string().nullable().optional(),
  departmentName: z.string().nullable().optional(),
  program: z.string().optional(),
}).passthrough();
