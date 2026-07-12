import { fetchService } from './genericFetchService';
import { AdvisorProfileSchema } from '../Schemas/ResponseSchemas/professorResponseSchema';
import { AdvisorSessionsResponseSchema } from '../Schemas/ResponseSchemas/advisorSessionsResponseSchema';
import { AdvisorStudentProgressResponseSchema } from '../Schemas/ResponseSchemas/advisorStudentProgressResponseSchema';
import { AdvisorGraduationAuditResponseSchema } from '../Schemas/ResponseSchemas/advisorGraduationAuditResponseSchema';
import { AdvisorIssuesResponseSchema } from '../Schemas/ResponseSchemas/advisorIssuesResponseSchema';
import { UpdateAdvisingSessionRequestSchema } from '../Schemas/RequestSchemas/advisingSessionUpdateSchema';
import { UpdateIssueStatusRequestSchema } from '../Schemas/RequestSchemas/issueSchemas';

export const getAdvisorProfile = () =>
  fetchService('/advisors/profile', { method: 'GET' }, AdvisorProfileSchema);

export const getAssignedStudents = () =>
  fetchService('/advisors/students', { method: 'GET' });

export const getAdvisorDashboard = () =>
  fetchService('/advisors/dashboard', { method: 'GET' });

export const updateAdvisingSession = (sessionId, data) => {
  const payload = UpdateAdvisingSessionRequestSchema.parse(data);
  return fetchService(`/advisors/sessions/${sessionId}`, { method: 'PATCH', data: payload });
};

export const getSessions = () =>
  fetchService('/advisors/sessions', { method: 'GET' }, AdvisorSessionsResponseSchema);

export const createSession = (data) =>
  fetchService('/advisors/sessions', { method: 'POST', data });

export const getStudentProgress = (studentId) =>
  fetchService(`/advisors/student-progress/${studentId}`, { method: 'GET' }, AdvisorStudentProgressResponseSchema);

export const getGraduationAudit = (studentId) =>
  fetchService(`/advisors/graduation/${studentId}`, { method: 'GET' }, AdvisorGraduationAuditResponseSchema);

export const getIssues = () =>
  fetchService('/advisors/issues', { method: 'GET' }, AdvisorIssuesResponseSchema);

export const updateIssueStatus = (issueId, status) => {
  const payload = UpdateIssueStatusRequestSchema.parse({ status });
  return fetchService(`/advisors/issues/${issueId}`, { method: 'PATCH', data: payload });
};
