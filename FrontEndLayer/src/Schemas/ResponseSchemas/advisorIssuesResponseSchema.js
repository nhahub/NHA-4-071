import { z } from 'zod';

const IssueItemSchema = z.object({
  _id: z.string(),
  studentId: z.union([z.string(), z.object({}).passthrough()]).optional(),
  subject: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.string().optional(),
}).passthrough();

const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  pages: z.number(),
}).passthrough();

export const AdvisorIssuesResponseSchema = z.object({
  complaints: z.array(IssueItemSchema),
  pagination: PaginationSchema,
}).passthrough();
