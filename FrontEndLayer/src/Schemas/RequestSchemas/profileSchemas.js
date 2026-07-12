import { z } from 'zod';

export const UpdateProfileRequestSchema = z.object({
  program: z.string().optional(),
});
