import { z } from 'zod';

export const PaymentResponseSchema = z.object({
  _id: z.string(),
  studentId: z.string(),
  semesterId: z.string(),
  amount: z.number(),
  status: z.enum(['pending', 'paid', 'overdue']),
});
