import { z } from 'zod';

const PlanCourseSchema = z.object({
  code: z.string(),
  name: z.string(),
  credits: z.number(),
  completed: z.boolean(),
}).passthrough();

const PlanSemesterSchema = z.object({
  name: z.string(),
  courses: z.array(PlanCourseSchema),
}).passthrough();

const PlanYearSchema = z.object({
  year: z.number(),
  semesters: z.array(PlanSemesterSchema),
}).passthrough();

export const StudyPlanResponseSchema = z.object({
  _id: z.string(),
  studentId: z.string(),
  degreeName: z.string().optional(),
  departmentName: z.string().optional(),
  totalRequired: z.number().optional(),
  years: z.array(PlanYearSchema),
}).passthrough();
