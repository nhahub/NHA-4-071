import { fetchService } from './genericFetchService';
import { ComplaintsResponseSchema } from '../Schemas/ResponseSchemas/usersResponseSchema';
import { SemesterListResponseSchema, CurrentSemesterResponseSchema } from '../Schemas/ResponseSchemas/semesterResponseSchema';
import { DepartmentsResponseSchema } from '../Schemas/ResponseSchemas/departmentResponseSchema';
import { AdminReportsResponseSchema } from '../Schemas/ResponseSchemas/adminReportsResponseSchema';
import { AdminRegistrationStatsResponseSchema } from '../Schemas/ResponseSchemas/adminRegistrationStatsResponseSchema';
import { AdminDashboardResponseSchema } from '../Schemas/ResponseSchemas/adminDashboardResponseSchema';
import { AdminUsersResponseSchema } from '../Schemas/ResponseSchemas/adminUsersResponseSchema';

export const getAllUsers = () =>
  fetchService('/admin/users', { method: 'GET' }, AdminUsersResponseSchema);

export const getAdvisors = () =>
  fetchService('/admin/users?role=advisor', { method: 'GET' }, AdminUsersResponseSchema);

export const setUserRole = (userId, role) =>
  fetchService(`/admin/users/${userId}`, { method: 'PATCH', data: { role } });

export const withdrawUser = (userId) =>
  fetchService(`/admin/users/${userId}`, { method: 'PATCH', data: { isActive: false } });

export const getAllComplaints = () =>
  fetchService('/admin/complaints', { method: 'GET' }, ComplaintsResponseSchema);

export const updateComplaintStatus = (complaintId, status) =>
  fetchService(`/admin/complaints/${complaintId}`, { method: 'PATCH', data: { status } });

export const assignComplaint = (complaintId, adminId) =>
  fetchService(`/admin/complaints/${complaintId}`, { method: 'PATCH', data: { adminId } });

export const resolveComplaint = (complaintId, resolutionNote) =>
  fetchService(`/admin/complaints/${complaintId}`, { method: 'PATCH', data: { status: 'resolved', resolutionNote } });

export const getAllSemesters = () =>
  fetchService('/semesters', { method: 'GET' }, SemesterListResponseSchema);

export const getCurrentSemester = () =>
  fetchService('/semesters/current', { method: 'GET' }, CurrentSemesterResponseSchema);

export const createSemester = (data) =>
  fetchService('/admin/semesters', { method: 'POST', data });

export const updateSemesterStatus = (semesterId, data) =>
  fetchService(`/admin/semesters/${semesterId}`, { method: 'PATCH', data });

export const getDemographics = () =>
  fetchService('/departments', { method: 'GET' }, DepartmentsResponseSchema);

export const getAdminDashboard = () =>
  fetchService('/admin/dashboard', { method: 'GET' }, AdminDashboardResponseSchema);

export const getReports = () =>
  fetchService('/admin/reports', { method: 'GET' }, AdminReportsResponseSchema);

export const getRegistrationStats = () =>
  fetchService('/admin/registration-stats', { method: 'GET' }, AdminRegistrationStatsResponseSchema);

export const getSettings = () =>
  fetchService('/admin/settings', { method: 'GET' });

export const updateSettings = (data) =>
  fetchService('/admin/settings', { method: 'PUT', data });

export const createDepartment = (name, code) =>
  fetchService('/departments', { method: 'POST', data: { name, code } });