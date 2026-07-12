import { z } from 'zod';

const PaymentItemSchema = z.object({
  _id: z.string(),
  studentId: z.string(),
  semesterId: z.string(),
  semesterName: z.string().optional(),
  amount: z.number(),
  status: z.enum(['pending', 'paid', 'overdue']),
  createdAt: z.string().optional(),
}).passthrough();

export const PaymentResponseSchema = z.array(PaymentItemSchema);
