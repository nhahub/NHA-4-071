import { z } from 'zod';

const NumOrStr = z.union([z.string(), z.number()]);

const AgendaItemSchema = z.object({
  id: NumOrStr,
  time: z.string(),
  course: z.string(),
  location: z.string(),
  students: NumOrStr.nullable().optional(),
  action: z.string(),
  type: z.string(),
}).passthrough();

const CourseOverviewSchema = z.object({
  id: z.string(),
  type: z.string(),
  details: z.string(),
  progress: NumOrStr,
}).passthrough();

const ActivityItemSchema = z.object({
  id: NumOrStr,
  text: z.string(),
  subtext: z.string().optional(),
  count: NumOrStr.nullable().optional(),
  time: z.string().optional(),
  type: z.string().optional(),
}).passthrough();

const PerformancePointSchema = z.object({
  name: z.string(),
  value: NumOrStr,
}).passthrough();

export const ProfessorDashboardResponseSchema = z.object({
  metrics: z.object({
    totalStudents: NumOrStr,
    studentsTrend: z.string().optional(),
    avgAttendance: NumOrStr,
    attendanceTrend: z.string().optional(),
    pendingGrades: NumOrStr,
    academicAlerts: NumOrStr,
  }).passthrough(),
  agenda: z.array(AgendaItemSchema),
  currentCourses: z.array(CourseOverviewSchema),
  recentActivity: z.array(ActivityItemSchema),
  performanceChart: z.array(PerformancePointSchema),
}).passthrough();
