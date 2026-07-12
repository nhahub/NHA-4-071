import { z } from 'zod';

const AgendaItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  time: z.string(),
  course: z.string(),
  location: z.string(),
  students: z.number().nullable().optional(),
  action: z.string(),
  type: z.string(),
}).passthrough();

const CourseOverviewSchema = z.object({
  id: z.string(),
  type: z.string(),
  details: z.string(),
  progress: z.number(),
}).passthrough();

const ActivityItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  text: z.string(),
  subtext: z.string().optional(),
  count: z.number().nullable().optional(),
  time: z.string().optional(),
  type: z.string().optional(),
}).passthrough();

const PerformancePointSchema = z.object({
  name: z.string(),
  value: z.number(),
}).passthrough();

export const ProfessorDashboardResponseSchema = z.object({
  metrics: z.object({
    totalStudents: z.union([z.string(), z.number()]),
    studentsTrend: z.string().optional(),
    avgAttendance: z.union([z.string(), z.number()]),
    attendanceTrend: z.string().optional(),
    pendingGrades: z.number(),
    academicAlerts: z.number(),
  }).passthrough(),
  agenda: z.array(AgendaItemSchema),
  currentCourses: z.array(CourseOverviewSchema),
  recentActivity: z.array(ActivityItemSchema),
  performanceChart: z.array(PerformancePointSchema),
}).passthrough();
