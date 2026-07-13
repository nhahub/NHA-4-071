import { z } from 'zod';

const AdvisingSessionItemSchema = z.object({
  _id: z.string(),
  studentId: z.union([z.string(), z.object({}).passthrough()]),
  advisorId: z.union([z.string(), z.object({}).passthrough()]).optional(),
  semesterId: z.union([z.string(), z.object({}).passthrough()]).optional(),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'pending']),
  createdAt: z.string().optional(),
}).passthrough();

export const AdvisingSessionResponseSchema = z.array(AdvisingSessionItemSchema);
