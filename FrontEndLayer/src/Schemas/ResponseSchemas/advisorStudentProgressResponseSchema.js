import { z } from 'zod';

export const AdvisorStudentProgressResponseSchema = z.object({
  student: z.object({
    _id: z.string(),
    name: z.string().optional(),
    email: z.string().optional(),
    universityId: z.string().optional(),
    GPA: z.number().optional(),
    level: z.number().optional(),
  }).passthrough(),
  enrollments: z.array(z.object({}).passthrough()),
  attendanceSummary: z.array(z.object({}).passthrough()),
  totalCreditsEarned: z.number().optional(),
  completedCoursesCount: z.number().optional(),
}).passthrough();
