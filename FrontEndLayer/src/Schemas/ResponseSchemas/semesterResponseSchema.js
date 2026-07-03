import { z } from 'zod';

export const SemesterSchema = z.object({
  _id: z.string(),
  name: z.string().optional(),
  code: z.string().optional(),
  registrationStatus: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).passthrough();

export const SemesterListResponseSchema = z.array(SemesterSchema);

export const CurrentSemesterResponseSchema = SemesterSchema;
