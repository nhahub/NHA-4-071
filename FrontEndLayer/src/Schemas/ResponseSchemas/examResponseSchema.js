import { z } from 'zod';

export const ExamItemSchema = z.object({
  _id: z.string(),
  courseCode: z.string().optional(),
  courseName: z.string().optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string().optional(),
  status: z.string(),
}).passthrough();

export const ExamResponseSchema = z.array(ExamItemSchema);
