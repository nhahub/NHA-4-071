import { z } from 'zod';

export const UpdateIssueStatusRequestSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'rejected']),
  resolutionNote: z.string().max(2000).optional(),
});
