import { z } from 'zod';

export const LoginRequestSchema = z.object({
  universityId: z.string().min(1, 'University ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
