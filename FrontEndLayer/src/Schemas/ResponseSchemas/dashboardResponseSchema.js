import { z } from 'zod';

export const DashboardResponseSchema = z.object({
  student: z.object({
    GPA: z.number(),
    level: z.number(),
    departmentName: z.string(),
  }),
  currentSemester: z.object({
    name: z.string(),
    registrationStatus: z.string(),
  }).nullable(),
  enrolledCourses: z.number().int(),
  pendingPayments: z.number().int(),
  openComplaints: z.number().int(),
});
