import { fetchService } from './genericFetchService';
import { StudentResponseSchema } from '../Schemas/ResponseSchemas/studentResponseSchema';
import { DashboardResponseSchema } from '../Schemas/ResponseSchemas/dashboardResponseSchema';
import { CourseResponseSchema } from '../Schemas/ResponseSchemas/courseResponseSchema';
import { EnrollmentResponseSchema } from '../Schemas/ResponseSchemas/enrollmentResponseSchema';
import { ComplaintResponseSchema } from '../Schemas/ResponseSchemas/complaintResponseSchema';
import { PaymentResponseSchema } from '../Schemas/ResponseSchemas/paymentResponseSchema';
import { AdvisingSessionResponseSchema } from '../Schemas/ResponseSchemas/advisingSessionResponseSchema';
import { SettingsResponseSchema } from '../Schemas/ResponseSchemas/settingsResponseSchema';
import { CourseOfferingsResponseSchema } from '../Schemas/ResponseSchemas/offeringResponseSchema';
import { EnrollmentRequestSchema } from '../Schemas/RequestSchemas/enrollmentSchemas';
import { ComplaintRequestSchema } from '../Schemas/RequestSchemas/complaintSchemas';
import { AdvisingSessionRequestSchema } from '../Schemas/RequestSchemas/advisingSessionSchemas';
import { MakePaymentRequestSchema } from '../Schemas/RequestSchemas/paymentSchemas';
import { ScheduleResponseSchema } from '../Schemas/ResponseSchemas/scheduleResponseSchema';
import { ExamResponseSchema } from '../Schemas/ResponseSchemas/examResponseSchema';
import { TranscriptResponseSchema } from '../Schemas/ResponseSchemas/transcriptResponseSchema';
import { StudyPlanResponseSchema } from '../Schemas/ResponseSchemas/studyPlanResponseSchema';
import { NotificationResponseSchema } from '../Schemas/ResponseSchemas/notificationResponseSchema';
import { AttendanceResponseSchema } from '../Schemas/ResponseSchemas/attendanceResponseSchema';

export const getStudentProfile = () =>
  fetchService('/students/profile', { method: 'GET' }, StudentResponseSchema);

export const updateStudentProfile = (data) =>
  fetchService('/students/profile', { method: 'PATCH', data }, StudentResponseSchema);

export const getMySettings = () =>
  fetchService('/students/settings', { method: 'GET' }, SettingsResponseSchema);

export const updateMySettings = (data) =>
  fetchService('/students/settings', { method: 'PUT', data }, SettingsResponseSchema);

export const getStudentDashboard = () =>
  fetchService('/students/dashboard', { method: 'GET' }, DashboardResponseSchema);

export const getAvailableCourses = () =>
  fetchService('/courses/available', { method: 'GET' }, CourseResponseSchema);

export const getCourseOfferings = (courseId) =>
  fetchService(`/courses/${courseId}/offerings`, { method: 'GET' }, CourseOfferingsResponseSchema);

export const getMyEnrollments = () =>
  fetchService('/students/enrollments', { method: 'GET' }, EnrollmentResponseSchema);

export const enrollInOffering = (courseId) => {
  const payload = EnrollmentRequestSchema.parse({ courseId });
  return fetchService('/enrollments', { method: 'POST', data: payload });
};

export const dropEnrollment = (enrollmentId) =>
  fetchService(`/enrollments/${enrollmentId}`, { method: 'DELETE' });

export const getMyComplaints = () =>
  fetchService('/students/complaints', { method: 'GET' }, ComplaintResponseSchema);

export const submitComplaint = (data) => {
  const payload = ComplaintRequestSchema.parse(data);
  return fetchService('/complaints', { method: 'POST', data: payload });
};

export const getMyPayments = () =>
  fetchService('/students/payments', { method: 'GET' }, PaymentResponseSchema);

export const makePayment = (data) => {
  const payload = MakePaymentRequestSchema.parse(data);
  return fetchService('/payments', { method: 'POST', data: payload });
};

export const getMyAdvisingSessions = () =>
  fetchService('/students/advising-sessions', { method: 'GET' }, AdvisingSessionResponseSchema);

export const getMyNotifications = () =>
  fetchService('/students/notifications', { method: 'GET' }, NotificationResponseSchema);

export const markNotificationRead = (notificationId) =>
  fetchService(`/notifications/${notificationId}/read`, { method: 'PATCH' });

export const getMyAttendance = () =>
  fetchService('/students/attendance', { method: 'GET' }, AttendanceResponseSchema);

export const getMySchedule = () =>
  fetchService('/students/schedule', { method: 'GET' }, ScheduleResponseSchema);

export const getMyExams = () =>
  fetchService('/students/exams', { method: 'GET' }, ExamResponseSchema);

export const getMyTranscript = () =>
  fetchService('/students/transcript', { method: 'GET' }, TranscriptResponseSchema);

export const getMyStudyPlan = () =>
  fetchService('/students/study-plan', { method: 'GET' }, StudyPlanResponseSchema);

export const submitSemesterRegistration = () =>
  fetchService('/semester-registration', { method: 'POST' });

export const saveGpaCalculation = (data) =>
  fetchService('/gpa-calculations', { method: 'POST', data });

export const createStudentAdvisingSession = (data) => {
  const payload = AdvisingSessionRequestSchema.parse(data);
  return fetchService('/students/advising-sessions', { method: 'POST', data: payload });
};

