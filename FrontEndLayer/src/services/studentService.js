import { fetchService } from './genericFetchService';
import { StudentResponseSchema } from '../Schemas/ResponseSchemas/studentResponseSchema';
import { DashboardResponseSchema } from '../Schemas/ResponseSchemas/dashboardResponseSchema';
import { CourseResponseSchema } from '../Schemas/ResponseSchemas/courseResponseSchema';
import { EnrollmentRequestSchema } from '../Schemas/RequestSchemas/enrollmentSchemas';
import { ComplaintRequestSchema } from '../Schemas/RequestSchemas/complaintSchemas';

export const getStudentProfile = () =>
  fetchService('/students/profile', { method: 'GET' }, StudentResponseSchema);

export const getStudentDashboard = () =>
  fetchService('/students/dashboard', { method: 'GET' }, DashboardResponseSchema);

export const getAvailableCourses = () =>
  fetchService('/courses/available', { method: 'GET' }, CourseResponseSchema);

export const getCourseOfferings = (courseId) =>
  fetchService(`/courses/${courseId}/offerings`, { method: 'GET' });

export const getMyEnrollments = () =>
  fetchService('/students/enrollments', { method: 'GET' });

export const enrollInOffering = (offeringId) => {
  const payload = EnrollmentRequestSchema.parse({ offeringId });
  return fetchService('/enrollments', { method: 'POST', data: payload });
};

export const dropEnrollment = (enrollmentId) =>
  fetchService(`/enrollments/${enrollmentId}`, { method: 'DELETE' });

export const getMyComplaints = () =>
  fetchService('/students/complaints', { method: 'GET' });

export const submitComplaint = (data) => {
  const payload = ComplaintRequestSchema.parse(data);
  return fetchService('/complaints', { method: 'POST', data: payload });
};

export const getMyPayments = () =>
  fetchService('/students/payments', { method: 'GET' });

export const makePayment = (data) =>
  fetchService('/payments', { method: 'POST', data });

export const getMyAdvisingSessions = () =>
  fetchService('/students/advising-sessions', { method: 'GET' });
