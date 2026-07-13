import { z } from 'zod';

const PerformanceStudentSchema = z.object({
  _id: z.union([z.string(), z.number()]).optional(),
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().optional(),
  studentId: z.string().optional(),
  engagement: z.string().optional(),
  midterm: z.string().optional(),
  score: z.string().optional(),
  risk: z.string().optional(),
  iconType: z.string().optional(),
}).passthrough();

const EngagementPointSchema = z.object({
  name: z.string(),
  value: z.number(),
}).passthrough();

export const ProfessorPerformanceResponseSchema = z.object({
  metrics: z.object({
    gpa: z.union([z.string(), z.number()]),
    attendance: z.union([z.string(), z.number()]),
    atRisk: z.number().optional(),
    totalStudents: z.number().optional(),
  }).passthrough(),
  students: z.array(PerformanceStudentSchema).optional(),
  priorityList: z.array(PerformanceStudentSchema).optional(),
  engagementData: z.array(EngagementPointSchema).optional(),
  engagementChart: z.array(EngagementPointSchema).optional(),
}).passthrough();
