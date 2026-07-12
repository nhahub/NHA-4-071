import { z } from 'zod';

export const UpdateSettingsRequestSchema = z.object({
  showGpa: z.boolean().optional(),
  preferredLanguage: z.string().optional(),
});
