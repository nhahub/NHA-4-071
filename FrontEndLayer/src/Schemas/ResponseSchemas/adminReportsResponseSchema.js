import { z } from 'zod';

const KpiSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  trend: z.string().optional(),
}).passthrough();

const EnrollmentTrendSchema = z.object({
  month: z.string().optional(),
  name: z.string().optional(),
  count: z.number().optional(),
  value: z.number().optional(),
}).passthrough();

const GpaByDepartmentSchema = z.object({
  department: z.string().optional(),
  name: z.string().optional(),
  gpa: z.number().optional(),
  value: z.number().optional(),
}).passthrough();

const InstitutionalGrowthSchema = z.object({
  role: z.string().optional(),
  name: z.string().optional(),
  count: z.number().optional(),
  value: z.number().optional(),
}).passthrough();

export const AdminReportsResponseSchema = z.object({
  kpis: z.array(KpiSchema),
  enrollmentTrends: z.array(EnrollmentTrendSchema),
  gpaByDepartment: z.array(GpaByDepartmentSchema),
  institutionalGrowth: z.array(InstitutionalGrowthSchema),
}).passthrough();
