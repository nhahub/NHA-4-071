import { fetchService } from './genericFetchService';
import { GradeRequestSchema } from '../Schemas/RequestSchemas/gradeSchemas';
import { AssignmentRequestSchema } from '../Schemas/RequestSchemas/assignmentSchemas';
import { ProfessorProfileSchema } from '../Schemas/ResponseSchemas/professorResponseSchema';
import { CourseOfferingsResponseSchema } from '../Schemas/ResponseSchemas/offeringResponseSchema';

export const getProfessorProfile = () =>
  fetchService('/professors/profile', { method: 'GET' }, ProfessorProfileSchema);

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

export const getOfferingStudents = (offeringId) =>
  fetchService(`/professors/offerings/${offeringId}/students`, { method: 'GET' });
