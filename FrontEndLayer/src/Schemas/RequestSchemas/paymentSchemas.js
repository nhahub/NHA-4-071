import { z } from 'zod';

export const MakePaymentRequestSchema = z.object({
  semesterId: z.string().min(1, 'Semester ID is required'),
  amount: z.number().positive('Amount must be positive'),
});
