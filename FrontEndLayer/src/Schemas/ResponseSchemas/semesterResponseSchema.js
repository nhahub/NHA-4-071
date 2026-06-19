import { z } from 'zod';

export const SemesterResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  registrationStatus: z.enum(['open', 'closed', 'upcoming']),
});
