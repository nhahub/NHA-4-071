import { z } from "zod";
const PlanCourseSchema = z.object({ code: z.string(), name: z.string(), credits: z.number(), completed: z.boolean() });
const PlanSemesterSchema = z.object({ name: z.string(), courses: z.array(PlanCourseSchema) });
const PlanYearSchema = z.object({ year: z.string(), semesters: z.array(PlanSemesterSchema) });
export const StudyPlanResponseSchema = z.object({
  _id: z.string(), studentId: z.string(),
  degreeName: z.string().optional(),
  departmentName: z.string().optional(),
  totalRequired: z.number().optional(),
  years: z.array(PlanYearSchema),
});