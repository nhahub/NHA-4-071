import { z } from 'zod';

export const EnrollmentRequestSchema = z.object({
  offeringId: z.string().min(1, 'Offering ID is required'),
});
