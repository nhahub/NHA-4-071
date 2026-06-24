import { z } from 'zod';

export const SettingsResponseSchema = z.object({
  showGpa: z.boolean().optional(),
  preferredLanguage: z.string().optional(),
}).passthrough();
