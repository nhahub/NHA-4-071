import { z } from 'zod';

export const UpdateSemesterStatusRequestSchema = z.object({
  registrationStatus: z.enum(['upcoming', 'open', 'closed', 'ongoing', 'ended']),
});
