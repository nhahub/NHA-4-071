import { z } from 'zod';

const SemesterInfoSchema = z.object({
  name: z.string(),
  registrationStatus: z.string(),
}).passthrough();

const AvailableCourseSchema = z.object({
  _id: z.string().optional(),
  offeringId: z.string().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
  credits: z.number().optional(),
  professor: z.string().optional(),
  schedule: z.string().optional(),
  classroom: z.string().optional(),
  capacity: z.number().optional(),
  enrolledCount: z.number().optional(),
  seatsAvailable: z.number().optional(),
}).passthrough();

const EnrolledCourseSchema = z.object({
  _id: z.string().optional(),
  courseId: z.string().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
  credits: z.number().optional(),
  schedule: z.string().optional(),
  classroom: z.string().optional(),
  status: z.string().optional(),
}).passthrough();

export const SemesterRegistrationInfoResponseSchema = z.object({
  semester: SemesterInfoSchema.nullable().optional(),
  isRegistered: z.boolean(),
  registeredAt: z.string().nullable().optional(),
  availableCourses: z.array(AvailableCourseSchema),
  enrolledCourses: z.array(EnrolledCourseSchema),
  enrolledCredits: z.number(),
  maxCredits: z.number(),
  earnedCredits: z.number(),
  requiredCredits: z.number(),
  remainingCredits: z.number(),
}).passthrough();
