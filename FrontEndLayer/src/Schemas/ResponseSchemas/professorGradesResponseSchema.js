import { z } from 'zod';

const GradeStudentSchema = z.object({
  _id: z.string().optional(),
  name: z.string().optional(),
  initials: z.string().optional(),
  studentId: z.string().optional(),
  section: z.string().optional(),
  score: z.string().optional(),
  grade: z.string().optional(),
  feedback: z.string().optional(),
}).passthrough();

export const ProfessorGradesResponseSchema = z.object({
  metrics: z.object({
    averageScore: z.union([z.string(), z.number()]),
    gradedItems: z.union([z.string(), z.number()]),
    highestScore: z.union([z.string(), z.number()]),
    highestGrade: z.string().optional(),
    publishStatus: z.string().optional(),
  }).passthrough(),
  students: z.array(GradeStudentSchema),
}).passthrough();
