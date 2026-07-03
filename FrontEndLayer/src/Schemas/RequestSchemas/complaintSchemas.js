import { z } from 'zod';

export const ComplaintRequestSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
});
