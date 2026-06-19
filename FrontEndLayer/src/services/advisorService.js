import { fetchService } from './genericFetchService';

export const getAdvisorProfile = () =>
  fetchService('/advisors/profile', { method: 'GET' });

export const getAssignedStudents = () =>
  fetchService('/advisors/students', { method: 'GET' });

export const getAdvisingSessions = () =>
  fetchService('/advisors/sessions', { method: 'GET' });

export const createAdvisingSession = (data) =>
  fetchService('/advisors/sessions', { method: 'POST', data });

export const updateAdvisingSession = (sessionId, data) =>
  fetchService(`/advisors/sessions/${sessionId}`, { method: 'PATCH', data });
