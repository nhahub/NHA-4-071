import { z } from 'zod';

const AttendanceRecordSchema = z.object({
  studentId: z.union([z.string(), z.object({}).passthrough()]),
  status: z.string(),
  _id: z.string().optional(),
}).passthrough();

const AttendanceEntrySchema = z.object({
  _id: z.string(),
  offeringId: z.string(),
  date: z.string(),
  records: z.array(AttendanceRecordSchema),
}).passthrough();

export const ProfessorAttendanceResponseSchema = z.array(AttendanceEntrySchema);
