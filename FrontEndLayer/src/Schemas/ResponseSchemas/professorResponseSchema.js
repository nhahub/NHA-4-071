import { z } from 'zod';

export const ProfessorProfileSchema = z.object({
  _id: z.string(),
  userId: z.string().optional(),
  departmentId: z.string().optional(),
  title: z.string().optional(),
}).passthrough();

export const AdvisorProfileSchema = z.object({
  _id: z.string(),
  userId: z.string().optional(),
  departmentId: z.string().optional(),
}).passthrough();
