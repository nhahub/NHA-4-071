import { z } from "zod";
const TranscriptCourseSchema = z.object({ code: z.string(), name: z.string(), credits: z.number(), grade: z.string() });
const SemesterSchema = z.object({ name: z.string(), gpa: z.number(), totalCredits: z.number(), courses: z.array(TranscriptCourseSchema) });
export const TranscriptResponseSchema = z.object({
  _id: z.string(),
  studentId: z.string(),
  semesters: z.array(SemesterSchema),
  program: z.string().optional(),
  degree: z.string().optional(),
  department: z.string().optional(),
}).passthrough();