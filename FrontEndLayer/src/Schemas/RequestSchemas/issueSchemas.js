import { z } from 'zod';

export const UpdateIssueStatusRequestSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'rejected']),
});
