import { z } from 'zod';

export const AssignmentRequestSchema = z.object({
  offeringId: z.string().min(1, 'Offering ID is required'),
  title: z.string().min(1, 'Title is required').max(200),
  dueDate: z.string().min(1, 'Due date is required'),
  maxScore: z.number().int().min(1, 'Max score must be at least 1'),
});
