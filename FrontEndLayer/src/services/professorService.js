import { fetchService } from './genericFetchService';
import { GradeRequestSchema } from '../Schemas/RequestSchemas/gradeSchemas';
import { AssignmentRequestSchema } from '../Schemas/RequestSchemas/assignmentSchemas';

export const getProfessorProfile = () =>
  fetchService('/professors/profile', { method: 'GET' });

export const getMyOfferings = () =>
  fetchService('/professors/offerings', { method: 'GET' });

export const getOfferingStudents = (offeringId) =>
  fetchService(`/professors/offerings/${offeringId}/students`, { method: 'GET' });

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
