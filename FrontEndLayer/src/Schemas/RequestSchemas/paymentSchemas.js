import { z } from 'zod';

export const MakePaymentRequestSchema = z.object({
  semesterId: z.string().min(1, 'Semester ID is required'),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'bank_transfer', 'cash', 'online']).optional(),
});
