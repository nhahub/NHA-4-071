import { z } from 'zod';

export const AdminRegistrationStatsResponseSchema = z.object({
  totalRegistered: z.number(),
  autoEnrolled: z.number().optional(),
  pendingOverrides: z.number().optional(),
  isWindowOpen: z.boolean().optional(),
}).passthrough();
