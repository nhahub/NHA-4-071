import { z } from 'zod';

export const AssignmentResponseSchema = z.object({
  _id: z.string(),
  offeringId: z.string(),
  title: z.string(),
  dueDate: z.string(),
  maxScore: z.number().int(),
});
