import { fetchService } from './genericFetchService';
import { GradeRequestSchema } from '../Schemas/RequestSchemas/gradeSchemas';
import { AssignmentRequestSchema } from '../Schemas/RequestSchemas/assignmentSchemas';
import { ProfessorProfileSchema } from '../Schemas/ResponseSchemas/professorResponseSchema';
import { CourseOfferingsResponseSchema } from '../Schemas/ResponseSchemas/offeringResponseSchema';
import { ProfessorDashboardResponseSchema } from '../Schemas/ResponseSchemas/professorDashboardResponseSchema';
import { NotificationResponseSchema } from '../Schemas/ResponseSchemas/notificationResponseSchema';
import { ProfessorGradesResponseSchema } from '../Schemas/ResponseSchemas/professorGradesResponseSchema';
import { ProfessorPerformanceResponseSchema } from '../Schemas/ResponseSchemas/professorPerformanceResponseSchema';
import { ScheduleResponseSchema } from '../Schemas/ResponseSchemas/scheduleResponseSchema';
import { ProfessorOfferingStudentsResponseSchema } from '../Schemas/ResponseSchemas/professorOfferingStudentsResponseSchema';
import { ProfessorAttendanceResponseSchema } from '../Schemas/ResponseSchemas/professorAttendanceResponseSchema';

export const getProfessorProfile = () =>
  fetchService('/professors/profile', { method: 'GET' }, ProfessorProfileSchema);

export const updateProfessorProfile = (data) =>
  fetchService('/professors/profile', { method: 'PATCH', data }, ProfessorProfileSchema);

export const getMyOfferings = () =>
  fetchService('/professors/offerings', { method: 'GET' }, CourseOfferingsResponseSchema);

export const submitStudentGrade = (gradeData) => {
  const payload = GradeRequestSchema.parse(gradeData);
  return fetchService('/professors/grades', { method: 'POST', data: payload });
};

export const getAssignments = (offeringId) =>
  fetchService(`/professors/offerings/${offeringId}/assignments`, { method: 'GET' });

export const createAssignment = (data) => {
  const payload = AssignmentRequestSchema.parse(data);
  return fetchService('/professors/assignments', { method: 'POST', data: payload });
};

export const getProfessorDashboard = () =>
  fetchService('/professors/dashboard', { method: 'GET' }, ProfessorDashboardResponseSchema);

export const getProfessorNotifications = () =>
  fetchService('/professors/notifications', { method: 'GET' }, NotificationResponseSchema);

export const getProfessorGradesOverview = () =>
  fetchService('/professors/grades-overview', { method: 'GET' }, ProfessorGradesResponseSchema);

export const getProfessorPerformance = () =>
  fetchService('/professors/performance', { method: 'GET' }, ProfessorPerformanceResponseSchema);

export const getProfessorSchedule = () =>
  fetchService('/professors/schedule', { method: 'GET' }, ScheduleResponseSchema);

export const getOfferingStudents = (offeringId) =>
  fetchService(`/professors/offerings/${offeringId}/students`, { method: 'GET' }, ProfessorOfferingStudentsResponseSchema);

export const markAttendance = (offeringId, data) =>
  fetchService(`/professors/offerings/${offeringId}/attendance`, { method: 'POST', data });

export const getAttendanceRecords = (offeringId) =>
  fetchService(`/professors/offerings/${offeringId}/attendance`, { method: 'GET' }, ProfessorAttendanceResponseSchema);
