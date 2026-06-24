import { z } from "zod";
export const ScheduleItemSchema = z.object({
  day: z.string(), start: z.string(), end: z.string(),
  code: z.string(), name: z.string(), room: z.string(), professor: z.string(),
});
export const ScheduleResponseSchema = z.array(ScheduleItemSchema);