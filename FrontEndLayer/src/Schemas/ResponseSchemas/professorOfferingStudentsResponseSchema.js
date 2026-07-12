import { z } from 'zod';

const OfferingStudentSchema = z.object({
  _id: z.string(),
  userId: z.union([
    z.string(),
    z.object({ name: z.string().optional(), universityId: z.string().optional() }).passthrough(),
  ]),
  GPA: z.number().optional(),
  level: z.number().optional(),
  grade: z.string().nullable().optional(),
  courseCode: z.string().optional(),
}).passthrough();

export const ProfessorOfferingStudentsResponseSchema = z.array(OfferingStudentSchema);
