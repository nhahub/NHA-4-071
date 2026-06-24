import { z } from 'zod';

const GPATrendSchema = z.object({ semester: z.string(), gpa: z.number() });
const CourseDataSchema = z.object({ code: z.string(), name: z.string(), credits: z.number(), grade: z.string() });
const CourseProgressSchema = z.object({ code: z.string(), name: z.string(), percent: z.number(), grade: z.string() });

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
  gpaTrend: z.array(GPATrendSchema).optional().default([]),
  currentCourses: z.array(CourseDataSchema).optional().default([]),
  courseProgress: z.array(CourseProgressSchema).optional().default([]),
});
