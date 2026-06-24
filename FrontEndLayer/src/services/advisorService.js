import { fetchService } from './genericFetchService';
import { AdvisorProfileSchema } from '../Schemas/ResponseSchemas/professorResponseSchema';
import { StudentResponseSchema } from '../Schemas/ResponseSchemas/studentResponseSchema';

export const getAdvisorProfile = () =>
  fetchService('/advisors/profile', { method: 'GET' }, AdvisorProfileSchema);

export const getAssignedStudents = () =>
  fetchService('/advisors/students', { method: 'GET' });

export const updateAdvisingSession = (sessionId, data) =>
  fetchService(`/advisors/sessions/${sessionId}`, { method: 'PATCH', data });
