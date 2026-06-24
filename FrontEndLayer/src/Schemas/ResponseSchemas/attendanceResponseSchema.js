import { z } from "zod";
const AttendanceCourseSchema = z.object({ code: z.string(), name: z.string(), attended: z.number(), total: z.number(), percent: z.number() });
export const AttendanceResponseSchema = z.object({ _id: z.string(), studentId: z.string(), courses: z.array(AttendanceCourseSchema) });