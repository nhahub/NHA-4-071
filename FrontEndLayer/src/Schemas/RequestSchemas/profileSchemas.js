import { z } from 'zod';

export const UpdateProfileRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
});
