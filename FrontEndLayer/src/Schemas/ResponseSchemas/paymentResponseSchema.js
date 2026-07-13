import { z } from 'zod';

const PaymentItemSchema = z.object({
  _id: z.string(),
  studentId: z.string().optional(),
  semesterId: z.string(),
  semesterName: z.string().nullable().optional(),
  description: z.string().optional(),
  amount: z.number(),
  paymentMethod: z.string().nullable().optional(),
  transactionId: z.string().nullable().optional(),
  status: z.string(),
  dueDate: z.string().nullable().optional(),
  paidAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
}).passthrough();

export const PaymentResponseSchema = z.array(PaymentItemSchema);

export const PaymentSummarySchema = z.object({
  totalPaid: z.number(),
  totalPending: z.number(),
  totalOverdue: z.number(),
  totalDue: z.number(),
  nextDueDate: z.string().nullable().optional(),
  currentSemesterDue: z.object({
    semesterName: z.string().nullable().optional(),
    amount: z.number(),
    status: z.string(),
    dueDate: z.string().nullable().optional(),
  }).nullable().optional(),
  semesterFee: z.number(),
  paymentCount: z.number(),
}).passthrough();
