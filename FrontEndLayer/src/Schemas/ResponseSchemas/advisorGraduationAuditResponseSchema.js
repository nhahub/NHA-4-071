import { z } from 'zod';

export const AdvisorGraduationAuditResponseSchema = z.object({
  studentName: z.string().optional(),
  universityId: z.string().optional(),
  departmentName: z.string().optional(),
  totalRequiredCourses: z.number().optional(),
  completedCourses: z.array(z.object({
    code: z.string().optional(),
    name: z.string().optional(),
    credits: z.number().optional(),
    grade: z.string().optional(),
  }).passthrough()).optional(),
  completedCount: z.number().optional(),
  totalRequiredCredits: z.number().optional(),
  completedCredits: z.number().optional(),
  progress: z.number().optional(),
}).passthrough();
