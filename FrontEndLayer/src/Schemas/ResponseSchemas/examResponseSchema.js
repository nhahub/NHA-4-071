import { z } from "zod";
export const ExamItemSchema = z.object({
  _id: z.string(), studentId: z.string(), courseCode: z.string(), courseName: z.string(),
  date: z.string(), startTime: z.string(), endTime: z.string(),
  room: z.string(), seat: z.string(), status: z.string(),
});
export const ExamResponseSchema = z.array(ExamItemSchema);