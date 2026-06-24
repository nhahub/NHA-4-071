import { fetchService } from './genericFetchService';
import { UsersResponseSchema, ComplaintsResponseSchema } from '../Schemas/ResponseSchemas/usersResponseSchema';
import { SemesterListResponseSchema, CurrentSemesterResponseSchema } from '../Schemas/ResponseSchemas/semesterResponseSchema';
import { DepartmentsResponseSchema } from '../Schemas/ResponseSchemas/departmentResponseSchema';

export const getAllUsers = () =>
  fetchService('/admin/users', { method: 'GET' }, UsersResponseSchema);

export const getAllComplaints = () =>
  fetchService('/admin/complaints', { method: 'GET' }, ComplaintsResponseSchema);

export const updateComplaintStatus = (complaintId, status) =>
  fetchService(`/admin/complaints/${complaintId}`, { method: 'PATCH', data: { status } });

export const getAllSemesters = () =>
  fetchService('/semesters', { method: 'GET' }, SemesterListResponseSchema);

export const getCurrentSemester = () =>
  fetchService('/semesters/current', { method: 'GET' }, CurrentSemesterResponseSchema);

export const createSemester = (data) =>
  fetchService('/admin/semesters', { method: 'POST', data });

export const getDepartments = () =>
  fetchService('/departments', { method: 'GET' }, DepartmentsResponseSchema);
